export interface AutoPathOptions {
  /**
   * 首页路径，自动注册页面时会将此路径排列至首位
   */
  homePath: string;

  /**
   * 主包页面路径配置
   */
  mainPackage: {
    /**
     * 监听主包页面存放的根路径  默认值对应路径: /src/pages
     * @default pages
     */
    rootDir?: string;

    /**
     * tabbar页面存放路径 默认值对应路径: /src/pages/tababr
     * @default tabbar
     */
    tabbarDir?: string;
  };

  /**
   * 分包页面路径配置
   */
  subPackage?: {
    /**
     * 分包页面存放的根路径 默认值对应路径 /src/pages-sub
     * @default pages-sub
     */
    rootDir?: string;
  };
}

export interface IConfigModel {
  getConfigStr: () => string;
  getConfig: <T = { [key: string]: any }>() => T;
  setConfig: (key: string, value: string, autoSave?: boolean) => Promise<void>;
  saveConfig: () => Promise<void>;
  remove: (key: string, autoSave?: boolean) => Promise<void>;
}

export type LoadConfig = (
  path: string,
  fnName: string
) => Promise<IConfigModel>;
