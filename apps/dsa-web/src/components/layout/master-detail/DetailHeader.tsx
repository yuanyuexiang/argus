import type React from 'react';
import { PanelLeft } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useMasterDetail } from './MasterDetailContext';

interface DetailHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** 右侧操作区（图标按钮等）。 */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * 微信式主区标题栏：左侧标题（移动端含「打开列表」按钮）+ 右侧操作。
 * 当所在 MasterDetail 存在列表栏时，移动端自动显示唤起列表抽屉的按钮。
 */
export const DetailHeader: React.FC<DetailHeaderProps> = ({ title, subtitle, actions, className }) => {
  const { hasList, openList } = useMasterDetail();

  return (
    <header
      className={cn(
        'flex h-[var(--detail-header-height)] shrink-0 items-center gap-3 border-b border-border/60 px-4',
        className
      )}
    >
      {hasList ? (
        <button
          type="button"
          onClick={openList}
          aria-label="打开列表"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-secondary-text transition-colors hover:bg-hover hover:text-foreground lg:hidden"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      ) : null}

      <div className="min-w-0 flex-1">
        {title ? <div className="truncate text-base font-semibold text-foreground">{title}</div> : null}
        {subtitle ? <div className="truncate text-xs text-secondary-text">{subtitle}</div> : null}
      </div>

      {actions ? <div className="flex shrink-0 items-center gap-1.5">{actions}</div> : null}
    </header>
  );
};
