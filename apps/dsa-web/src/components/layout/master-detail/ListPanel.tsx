import type React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ListPanelSearch {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface ListPanelProps {
  /** 顶部标题（与 search 互斥，search 优先）。 */
  title?: React.ReactNode;
  /** 顶部搜索框配置。传入则显示搜索框。 */
  search?: ListPanelSearch;
  /** 顶部右侧动作（如微信式「+」按钮）。 */
  action?: React.ReactNode;
  /** 列表项。 */
  children: React.ReactNode;
  className?: string;
}

/**
 * 微信式列表栏：顶部搜索/标题 + 可选动作，下方可滚动列表区。
 */
export const ListPanel: React.FC<ListPanelProps> = ({ title, search, action, children, className }) => {
  const hasHeader = Boolean(title || search || action);

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      {hasHeader ? (
        <div className="flex shrink-0 items-center gap-2 border-b border-border/60 px-3 py-3">
          {search ? (
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-text" />
              <input
                type="text"
                value={search.value}
                onChange={(event) => search.onChange(event.target.value)}
                placeholder={search.placeholder ?? '搜索'}
                className="h-9 w-full rounded-xl border border-border/60 bg-background/60 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-text focus:border-[hsl(var(--primary)/0.5)] focus:outline-none"
              />
            </div>
          ) : title ? (
            <div className="flex-1 truncate text-sm font-semibold text-foreground">{title}</div>
          ) : (
            <div className="flex-1" />
          )}
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto p-2">{children}</div>
    </div>
  );
};
