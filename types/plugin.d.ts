import { IPluginContext } from '@tarojs/service';
import { AutoPagesConfig, IConfigModel } from './types';
import { LogTypeEnum } from './constant';
export declare class Plugin {
    readonly ctx: IPluginContext;
    readonly options: AutoPagesConfig;
    appConfigModel?: IConfigModel;
    constructor(ctx: IPluginContext, options: AutoPagesConfig);
    loadConfig(): Promise<void>;
    log(type: LogTypeEnum, message: string): void;
    autoRegister(): Promise<void>;
    onBuildStart(): this;
    registerCommand(): this;
}
