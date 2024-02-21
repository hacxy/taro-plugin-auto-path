import type { IPluginContext } from "@tarojs/service";
import { mergeDeep } from "tianjie";
import { Plugin } from "./plugin";
import { AutoPathOptions } from "./types";

const defaultOpts: AutoPathOptions = {
  homePath: "",
  subPackage: {
    rootDir: "pages-sub",
  },
  mainPackage: {
    rootDir: "pages",
    tabbarDir: "tabbar",
  },
};

/**
 * 命令行扩展
 */
export default (ctx: IPluginContext, pluginOpts: AutoPathOptions) => {
  const options = mergeDeep(defaultOpts, pluginOpts);
  new Plugin(ctx, options).onBuildStart().registerCommand();
};

export type { AutoPathOptions };
