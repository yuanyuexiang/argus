import type React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';
import { MasterDetailContext } from './MasterDetailContext';

interface MasterDetailProps {
  /** 中间列表栏内容（通常是 <ListPanel>）。省略则主区全宽（无列表模式）。 */
  list?: React.ReactNode;
  /** 主区内容（通常是 <DetailHeader> + 内容 + 可选底部）。 */
  children: React.ReactNode;
  /** 列表栏的无障碍标签 / 移动端抽屉标题。 */
  listLabel?: string;
  /** 桌面端列表栏宽度（CSS 长度，默认 var(--list-width)=320px）。 */
  listWidth?: string;
  /**
   * 移动端（<lg）列表栏的呈现方式：
   * - 'drawer'（默认）：列表收进左侧抽屉，需由 DetailHeader 的按钮或页面自有按钮唤起（如问股的会话列表）。
   * - 'stack'：列表堆叠在主区上方（如设置分类、回测指标），无需触发按钮。
   */
  mobileList?: 'drawer' | 'stack';
  className?: string;
  /** 受控：移动端列表抽屉是否打开。提供则由父组件托管（便于在切换/新建等回调里关闭）。 */
  listOpen?: boolean;
  /** 受控：移动端列表抽屉开合回调。 */
  onListOpenChange?: (open: boolean) => void;
}

/**
 * 微信式「列表栏 + 主区」两栏容器（位于左侧图标栏右侧的主内容区内）。
 * - 桌面（lg+）：列表栏固定宽（listWidth）+ 主区 flex-1，两栏并排。
 * - 移动端（<lg）：按 mobileList 决定抽屉或堆叠；不传 list 时主区全宽。
 */
export const MasterDetail: React.FC<MasterDetailProps> = ({
  list,
  children,
  listLabel = '列表',
  listWidth = 'var(--list-width)',
  mobileList = 'drawer',
  className,
  listOpen,
  onListOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = listOpen !== undefined;
  const open = isControlled ? listOpen : internalOpen;
  const hasList = Boolean(list);
  const isStack = mobileList === 'stack';

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onListOpenChange?.(next);
    },
    [isControlled, onListOpenChange]
  );

  const contextValue = useMemo(
    () => ({
      hasList,
      openList: () => setOpen(true),
      closeList: () => setOpen(false),
    }),
    [hasList, setOpen]
  );

  const listWidthStyle = { ['--md-list-w']: listWidth } as React.CSSProperties;

  return (
    <MasterDetailContext.Provider value={contextValue}>
      <div
        className={cn(
          'flex h-full min-h-0 w-full overflow-hidden rounded-[0.875rem] border border-border/60 bg-card/40 backdrop-blur-sm',
          isStack ? 'flex-col lg:flex-row' : 'flex-row',
          className
        )}
      >
        {hasList ? (
          <aside
            className={cn(
              'shrink-0 flex-col bg-card/50 border-border/60 lg:w-[var(--md-list-w)]',
              isStack
                ? 'flex max-h-[42vh] w-full overflow-y-auto border-b lg:max-h-none lg:border-b-0 lg:border-r'
                : 'hidden border-r lg:flex'
            )}
            style={listWidthStyle}
            aria-label={listLabel}
          >
            {list}
          </aside>
        ) : null}

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</section>
      </div>

      {hasList && !isStack && open ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={listLabel}
        >
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col border-r border-border/70 bg-card shadow-2xl animate-slide-in-left">
            {list}
          </div>
        </div>
      ) : null}
    </MasterDetailContext.Provider>
  );
};
