import { IPluginContext } from "@tarojs/service";
import * as path from "path";
import { LogTypeEnum } from "./constant";
import { AutoPathOptions, IConfigModel } from "./types";
import {
  generateMainPackagePaths,
  generateSubPackagePaths,
  loadAppConfig,
} from "./utils";

export class Plugin {
  appConfigModel?: IConfigModel;

  constructor(
    public readonly ctx: IPluginContext,
    readonly options: AutoPathOptions
  ) {
    // this.loadConfig()
  }

  async loadConfig() {
    this.appConfigModel = await loadAppConfig(this.ctx.paths.sourcePath);
  }

  log(type: LogTypeEnum, message: string) {
    this.ctx.helper.printLog(type as any, message);
  }

  watch() {
    this.ctx.helper.chokidar
      .watch(
        [
          path.join(
            this.ctx.paths.sourcePath,
            `${this.options.mainPackage.rootDir}/**/index.tsx`
          ),
          path.join(
            this.ctx.paths.sourcePath,
            `${this.options.subPackage!.rootDir}/*/*/index.tsx`
          ),
        ],
        { ignoreInitial: true }
      )
      .on("add", () => this.autoRegister())
      .on("unlink", () => this.autoRegister());
  }

  async autoRegister() {
    this.log(LogTypeEnum.REMIND, "开始自动注册app.config.ts");
    await this.loadConfig();

    const mainPackagesPaths = await generateMainPackagePaths(
      this.ctx,
      this.options
    );
    const subPackagePaths = await generateSubPackagePaths(
      this.ctx,
      this.options
    );

    if (mainPackagesPaths.pagesPaths.length) {
      const pagesPathStr = JSON.stringify(mainPackagesPaths.pagesPaths);
      await this.appConfigModel?.setConfig("pages", pagesPathStr);
    }

    if (mainPackagesPaths.tabbarPaths.list.length) {
      const tabbarPathStr = JSON.stringify(mainPackagesPaths.tabbarPaths);
      await this.appConfigModel?.setConfig("tabBar", tabbarPathStr);
    }

    if (subPackagePaths.length) {
      const subPackagePathStr = JSON.stringify(subPackagePaths);
      await this.appConfigModel?.setConfig("subPackages", subPackagePathStr);
    }

    await this.appConfigModel?.saveConfig();

    this.log(LogTypeEnum.MODIFY, "app.config.ts已完成修改");
  }

  onBuildStart() {
    this.ctx.onBuildStart(async () => {
      await this.autoRegister();
      this.watch();
    });
    return this;
  }

  registerCommand() {
    const { ctx } = this;
    ctx.registerCommand({
      name: "pages",
      synopsisList: [
        "taro pages    启动路径监听并自动app.config.ts注册pages相关配置",
      ],
      fn: async () => {
        await this.autoRegister();
        process.exit(0);
      },
    });
    return this;
  }
}
