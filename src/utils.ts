import { IPluginContext } from "@tarojs/service";
import * as fs from "fs-extra";
import * as path from "path";
import { IndentationText, Project } from "ts-morph";
import type { AutoPathOptions, IConfigModel, LoadConfig } from "./types";

export const loadConfig: LoadConfig = (
  path: string,
  fnName: string
): Promise<IConfigModel> => {
  const project = new Project({
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
    },
  });
  const sourceFile = project.addSourceFileAtPath(path);

  return new Promise((resolve) => {
    sourceFile.forEachDescendant((node) => {
      if (node.getKindName() === "CallExpression") {
        const callExpr: any = node;
        if (callExpr.getExpression().getText() === fnName) {
          const configObjModel = callExpr.getArguments()[0];
          const configModel = {
            getConfigStr: () => configObjModel.getText(),
            getConfig: () => eval(`(${configObjModel.getText()})`),
            setConfig: async (
              key: string,
              value: string,
              autoSave: boolean = true
            ) => {
              const propertyKey = configObjModel.getProperty(key);
              if (propertyKey) {
                await propertyKey.setInitializer(value);
              } else {
                await configObjModel.addPropertyAssignment({
                  name: key,
                  initializer: value,
                });
              }
              // 格式化文本以修复缩进
              await sourceFile.formatText();

              // 自动保存更改到文件
              autoSave && (await sourceFile.saveSync());
            },
            /**
             * 移除
             * @param key
             * @param autoSave
             */
            remove: async (key, autoSave: boolean = true) => {
              const propertyKey = configObjModel.getProperty(key);
              await propertyKey.remove();
              autoSave && (await sourceFile.saveSync());
            },
            saveConfig: async () => await sourceFile.saveSync(),
          };
          resolve(configModel);
        } else {
          console.error(`没有找到用${fnName}的调用`);
        }
      }
    });
  });
};

export const loadAppConfig = async (sourcePath: string) => {
  const appCinfigFileName = "app.config.ts";
  const configPath = path.resolve(sourcePath, appCinfigFileName);
  if (!fs.existsSync(configPath)) {
    return;
  }
  return await loadConfig(configPath, "defineAppConfig");
};

export function getPagesPath(ctx: IPluginContext, options: AutoPathOptions) {
  return path.resolve(ctx.paths.sourcePath, `${options.mainPackage.rootDir}`);
}

export function getTabbarPath(ctx: IPluginContext, options: AutoPathOptions) {
  return path.resolve(
    ctx.paths.sourcePath,
    `${options.mainPackage.rootDir}/${options.mainPackage.tabbarDir}`
  );
}

export function getSubPackagePath(
  ctx: IPluginContext,
  options: AutoPathOptions
) {
  return path.resolve(ctx.paths.sourcePath, options.subPackage!.rootDir!);
}

/** 生成分包路径配置 */
export async function generateSubPackagePaths(
  ctx: IPluginContext,
  options: AutoPathOptions
) {
  const subPackagePath = await getSubPackagePath(ctx, options);
  if (!fs.pathExistsSync(subPackagePath)) return [];

  const pagesSubPathArr = fs
    .readdirSync(subPackagePath)
    .map((subName) => {
      const root = `pages-sub/${subName}`;
      const pages = fs
        .readdirSync(path.join(subPackagePath, subName))
        .map((item) => {
          const pageSubCpnPath = path.join(
            subPackagePath,
            subName,
            item,
            "index.tsx"
          );
          if (fs.pathExistsSync(pageSubCpnPath)) {
            return `${item}/index`;
          }
        })
        .filter((item) => item);

      if (pages.length) {
        return {
          root,
          pages,
        };
      }
    })
    .filter((item) => item);

  return pagesSubPathArr;
}

/** 生成tabbar路径配置 */
export const generateTabbarPaths = async (
  ctx: IPluginContext,
  options: AutoPathOptions
) => {
  const tabbarPath = getTabbarPath(ctx, options);

  if (!fs.pathExistsSync(tabbarPath)) {
    return {
      custom: true,
      list: [],
    };
  }

  const tabbarDir = options.mainPackage.tabbarDir;
  const tabbarPaths = fs
    .readdirSync(tabbarPath)
    .map((item) => {
      const pageCpnPath = path.join(tabbarPath, item, "index.tsx");
      if (fs.pathExistsSync(pageCpnPath)) {
        return {
          text: item,
          pagePath: `${options.mainPackage.rootDir}/${tabbarDir}/${item}/index`,
        };
      }
    })
    .filter((item) => item);

  return {
    custom: true,
    list: tabbarPaths,
  };
};

/** 生成主包路径配置 */
export async function generateMainPackagePaths(
  ctx: IPluginContext,
  options: AutoPathOptions
) {
  const tabbarPaths = await generateTabbarPaths(ctx, options);

  let pagesPathArr = fs
    .readdirSync(getPagesPath(ctx, options))
    .map((item) => {
      const pageCpnPath = path.join(
        ctx.paths.sourcePath,
        `./${options.mainPackage.rootDir}`,
        item,
        "index.tsx"
      );
      if (fs.pathExistsSync(pageCpnPath)) {
        return `${options.mainPackage.rootDir}/${item}/index`;
      }
    })
    .filter((item) => item);

  const tabbarPathArr = tabbarPaths.list.map((item) => item?.pagePath);
  pagesPathArr = [...pagesPathArr, ...tabbarPathArr];
  pagesPathArr = await handleHomePage(options.homePath, pagesPathArr);
  return { pagesPaths: pagesPathArr, tabbarPaths };
}

const handleHomePage = async (
  homePath: string,
  pathsPathArr: (string | undefined)[]
) => {
  const homePathStr = pathsPathArr.find((item) => `/${item}` === homePath);
  if (homePathStr) {
    const finalPaths = pathsPathArr.filter((item) => `/${item}` !== homePath);
    finalPaths.unshift(homePathStr);
    return finalPaths;
  } else {
    return pathsPathArr;
  }
};
