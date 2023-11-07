import { IPluginContext } from '@tarojs/service'
import { AutoPathConfig, IConfigModel } from './types'
import { LogTypeEnum } from './constant'
import {
  generateMainPackagePaths,
  generateSubPackagePaths,
  loadAppConfig,
} from './utils'

export class Plugin {
  appConfigModel?: IConfigModel

  constructor(
    public readonly ctx: IPluginContext,
    readonly options: AutoPathConfig
  ) {
    this.loadConfig()
  }

  async loadConfig() {
    this.appConfigModel = await loadAppConfig(this.ctx.paths.sourcePath)
  }

  log(type: LogTypeEnum, message: string) {
    this.ctx.helper.printLog(type as any, message)
  }

  async autoRegister() {
    this.log(LogTypeEnum.REMIND, '开始自动注册app.config.ts')
    const mainPackagesPaths = await generateMainPackagePaths(
      this.ctx,
      this.options
    )
    const subPackagePaths = await generateSubPackagePaths(
      this.ctx,
      this.options
    )
    if (mainPackagesPaths.pagesPaths.length) {
      const pagesPathStr = JSON.stringify(mainPackagesPaths.pagesPaths)
      await this.appConfigModel?.setConfig('pages', pagesPathStr)
    }

    if (mainPackagesPaths.tabbarPaths.list.length) {
      const tabbarPathStr = JSON.stringify(mainPackagesPaths.tabbarPaths)
      await this.appConfigModel?.setConfig('tabBar', tabbarPathStr)
    }

    if (subPackagePaths.length) {
      const subPackagePathStr = JSON.stringify(subPackagePaths)
      await this.appConfigModel?.setConfig('subPackages', subPackagePathStr)
    }

    await this.appConfigModel?.saveConfig()

    this.log(LogTypeEnum.MODIFY, 'app.config.ts已完成修改')
  }

  onBuildStart() {
    this.ctx.onBuildStart(() => {
      this.autoRegister()
    })
    return this
  }

  registerCommand() {
    const { ctx } = this
    ctx.registerCommand({
      name: 'pages',
      synopsisList: ['taro pages    自动为app.config.ts注册pages相关配置'],
      fn: async () => {
        await this.autoRegister()
        process.exit(0)
      },
    })
    return this
  }
}
