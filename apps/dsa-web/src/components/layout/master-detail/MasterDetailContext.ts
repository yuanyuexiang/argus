import { createContext, useContext } from 'react';

/**
 * 三栏布局中「列表栏 + 主区」之间的协作上下文。
 * 主区里的 DetailHeader 借此在移动端弹出列表抽屉。
 */
export interface MasterDetailContextValue {
  /** 是否存在中间列表栏（无列表时主区全宽，移动端不显示「打开列表」按钮）。 */
  hasList: boolean;
  /** 打开移动端列表抽屉。 */
  openList: () => void;
  /** 关闭移动端列表抽屉。 */
  closeList: () => void;
}

export const MasterDetailContext = createContext<MasterDetailContextValue>({
  hasList: false,
  openList: () => {},
  closeList: () => {},
});

export const useMasterDetail = (): MasterDetailContextValue => useContext(MasterDetailContext);
