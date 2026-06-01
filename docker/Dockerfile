# ===================================
# A股自选股智能分析系统 - Docker 镜像
# ===================================
# 多阶段构建：前端打包 + 后端运行

FROM node:20-slim AS web-builder

WORKDIR /app/apps/dsa-web

COPY apps/dsa-web/package.json apps/dsa-web/package-lock.json ./
RUN npm ci

COPY apps/dsa-web/ ./
RUN npm run build

# Pin to bookworm: wkhtmltopdf was removed from Debian testing (2025)
FROM python:3.11-slim-bookworm

# 设置工作目录
WORKDIR /app

# 设置时区为上海
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 可选：国内 apt 镜像（默认空=官方 deb.debian.org；CI/单体/海外环境不受影响）。
# 网络受限（如代理无法直达 Debian 源）时通过 --build-arg APT_MIRROR=mirrors.tuna.tsinghua.edu.cn 绕行。
ARG APT_MIRROR=""

# 安装系统依赖（wkhtmltopdf 含 wkhtmltoimage，用于 Markdown 转图片 Issue #289）
RUN if [ -n "$APT_MIRROR" ]; then \
        sed -i "s|deb.debian.org|$APT_MIRROR|g; s|security.debian.org|$APT_MIRROR|g" /etc/apt/sources.list.d/debian.sources 2>/dev/null || true; \
        sed -i "s|deb.debian.org|$APT_MIRROR|g; s|security.debian.org|$APT_MIRROR|g" /etc/apt/sources.list 2>/dev/null || true; \
    fi && \
    apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    curl \
    git \
    gosu \
    wkhtmltopdf \
    fontconfig \
    libjpeg62-turbo \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# 创建非 root 用户 (UID 1000)
RUN groupadd -g 1000 dsa && \
    useradd -u 1000 -g dsa -m dsa

# 复制依赖文件
COPY requirements.txt .

# 可选：国内 PyPI 镜像（默认官方 pypi.org；CI/单体/海外环境不受影响）。
# 网络受限时通过 --build-arg PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple 绕行。
ARG PIP_INDEX_URL=https://pypi.org/simple

# 安装 Python 依赖
RUN pip install --no-cache-dir -i "$PIP_INDEX_URL" -r requirements.txt

# 复制应用代码
COPY *.py ./
COPY api/ ./api/
COPY data_provider/ ./data_provider/
COPY bot/ ./bot/
COPY src/ ./src/
COPY strategies/ ./strategies/
COPY --from=web-builder /app/static ./static/
COPY docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Bundle the default AlphaSift adapter in Docker images, matching desktop packages.
RUN ALPHASIFT_INSTALL_SPEC="$(python -c 'from src.config import DEFAULT_ALPHASIFT_INSTALL_SPEC; print(DEFAULT_ALPHASIFT_INSTALL_SPEC)')" \
    && test -n "$ALPHASIFT_INSTALL_SPEC" \
    && python -m pip install --no-cache-dir -i "$PIP_INDEX_URL" "$ALPHASIFT_INSTALL_SPEC" \
    && python -c "import alphasift.dsa_adapter"

# 确保数据目录存在并授权给 non-root 用户
RUN mkdir -p /app/data /app/logs /app/reports && \
    chown -R dsa:dsa /app && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

# 设置环境变量默认值
ENV PYTHONUNBUFFERED=1
ENV LOG_DIR=/app/logs
ENV DATABASE_PATH=/app/data/stock_analysis.db
# Web/API service
ENV WEBUI_HOST=0.0.0.0
ENV API_PORT=8000

# 暴露 API 端口
EXPOSE 8000

# 数据卷（持久化数据）
VOLUME ["/app/data", "/app/logs", "/app/reports"]

# 健康检查（FastAPI 模式）
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || curl -f http://localhost:8000/health \
    || python -c "import sys; sys.exit(0)"

# 启动入口先修复 bind mount 目录权限，再降权为 dsa 执行应用；
# 文档化 docker-compose exec 命令需显式使用 -u dsa，避免手动进程写入 root-owned 文件。
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# 默认命令（可被覆盖）
CMD ["python", "main.py", "--schedule"]
