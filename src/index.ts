import type { IPluginContext } from '@tarojs/service'
import { AutoPagesConfig } from './types'
import { Plugin } from './plugin'

const defaultOpts: AutoPagesConfig = {
  homePath: '',
  tabbarDir: 'tabbar',
  subPackageDir: 'pages-sub',
}

/**
 * 命令行扩展
 */
export default (ctx: IPluginContext, pluginOpts: AutoPagesConfig) => {
  pluginOpts = Object.assign(pluginOpts, defaultOpts)
  new Plugin(ctx, pluginOpts).onBuildStart().registerCommand()
}
export { AutoPagesConfig }
