import { IPluginContext } from '@tarojs/service';
import type { AutoPagesConfig, IConfigModel, LoadConfig } from './types';
export declare const loadConfig: LoadConfig;
export declare const loadAppConfig: (sourcePath: string) => Promise<IConfigModel | undefined>;
export declare function getPagesPath(ctx: IPluginContext): string;
export declare function getTabbarPath(ctx: IPluginContext, options: AutoPagesConfig): string;
export declare function getSubPackagePath(ctx: IPluginContext, options: AutoPagesConfig): string;
/** 生成分包路径配置 */
export declare function generateSubPackagePaths(ctx: IPluginContext, options: AutoPagesConfig): Promise<({
    root: string;
    pages: (string | undefined)[];
} | undefined)[]>;
/** 生成tabbar路径配置 */
export declare const generateTabbarPaths: (ctx: IPluginContext, options: AutoPagesConfig) => Promise<{
    custom: boolean;
    list: ({
        text: string;
        pagePath: string;
    } | undefined)[];
}>;
/** 生成主包路径配置 */
export declare function generateMainPackagePaths(ctx: IPluginContext, options: AutoPagesConfig): Promise<{
    pagesPaths: (string | undefined)[];
    tabbarPaths: {
        custom: boolean;
        list: ({
            text: string;
            pagePath: string;
        } | undefined)[];
    };
}>;
