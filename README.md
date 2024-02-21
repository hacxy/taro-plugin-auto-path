# taro-plugin-auto-path

## 概述

在 Taro 项目中自动监听页面文件夹变化, 并自动注册 `app.config.ts`中的`pages` 、`tabBar` 、`subPackages`选项. 搭配 [taro-plugin-creator](https://github.com/loclink/taro-plugin-creator) 使用更佳

## 安装 & 更新

```
npm i taro-plugin-auto-path@latest -D
```

## 使用插件

### 简单注册

- 在`/config/index.ts`中注册插件, 未传入配置则使用插件默认配置

```ts
export default defineConfig(async (merge) => {
  const baseConfig: UserConfigExport = {
    // ...other config

    plugins: [
      // ... other plugins
      "taro-plugin-auto-path",
    ],

    // ...other config
  };
});
```

### 自定义配置

- 默认配置注解, 插件在运行时, 将监听配置:

```ts
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
```

- 配置示例:

```ts
export default defineConfig(async (merge) => {
  const baseConfig: UserConfigExport = {
    // ...other config

    plugins: [
      // ... other plugins
      [
        "taro-plugin-auto-path",
        {
          homePath: "/pages/tabbar/home/index",
          mainPackage: {
            rootDir: "pages",
            tabbarDir: "tabbar",
          },
          subPackage: {
            rootDir: "pages-sub",
          },
        },
      ],
    ],

    // ...other config
  };
});
```

- 你还可以利用插件提供的接口, 对选项进行类型推导, 我推荐这样使用:

1. 新建一个文件`/config/plugin.options.ts`由于存放插件选项, 这样您就可以跳转至该插件的类型定义查看更详细的配置注解:

```ts
// /config/plugin.options.ts
import { AutoPathOptions } from "taro-plugin-auto-path";
export const autoPathOptions: AutoPathOptions = {
  homePath: "/pages/tabbar/home/index",
  mainPackage: {
    rootDir: "pages",
    tabbarDir: "tabbar",
  },
  subPackage: {
    rootDir: "pages-sub",
  },
};
```

2. 在`/config/index.ts`中使用配置

```ts
// /config/index.ts
import { autoPathOptions } from "./plugin.options";
export default defineConfig(async (merge) => {
  const baseConfig: UserConfigExport = {
    // ...other config

    plugins: [
      // ... other plugins
      ["taro-plugin-auto-path", autoPathOptions],
    ],

    // ...other config
  };
});
```
