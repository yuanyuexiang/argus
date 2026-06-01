import type React from 'react';
import { cn } from '../../../utils/cn';

interface ListItemProps {
  /** 头像 / 图标。 */
  leading?: React.ReactNode;
  title: React.ReactNode;
  /** 副标题 / 预览行。 */
  subtitle?: React.ReactNode;
  /** 右上角元信息（如时间）。 */
  meta?: React.ReactNode;
  /** 右侧附加元素（如未读徽标）。 */
  trailing?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * 微信式列表项：头像 + 标题/副标题 + 元信息，选中态高亮。
 * 列表项内容多样的页面可不使用本组件、直接自定义渲染。
 */
export const ListItem: React.FC<ListItemProps> = ({
  leading,
  title,
  subtitle,
  meta,
  trailing,
  active = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
        active ? 'bg-[var(--nav-active-bg)]' : 'hover:bg-hover',
        className
      )}
    >
      {leading ? <div className="shrink-0">{leading}</div> : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={cn('truncate text-sm text-foreground', active ? 'font-semibold' : 'font-medium')}>
            {title}
          </span>
          {meta ? <span className="shrink-0 text-xs text-muted-text">{meta}</span> : null}
        </div>
        {subtitle ? <div className="mt-0.5 truncate text-xs text-secondary-text">{subtitle}</div> : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </button>
  );
};
