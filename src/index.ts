import type { IPluginContext } from '@tarojs/service'
import { AutoPathConfig } from './types'
import { Plugin } from './plugin'

const defaultOpts: AutoPathConfig = {
  homePath: '',
  tabbarDir: 'tabbar',
  subPackageDir: 'pages-sub',
}

/**
 * 命令行扩展
 */
export default (ctx: IPluginContext, pluginOpts: AutoPathConfig) => {
  pluginOpts = Object.assign(pluginOpts, defaultOpts)
  new Plugin(ctx, pluginOpts).onBuildStart().registerCommand()
}
export { AutoPathConfig }
