export interface AutoPathConfig {
  /**
   * @description 首页路径，自动注册页面时会将此路径排列至首位
   */
  homePath: string
  /**
   * @description
   */
  tabbarDir: string

  subPackageDir: string
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
