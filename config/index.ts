import { defineConfig } from '@tarojs/cli'
import devConfig from './dev'
import prodConfig from './prod'

// https://taro-docs.jd.com/docs/next/config
export default defineConfig(async (merge) => {
  const baseConfig = {
    projectName: 'yuantou-community',
    date: '2026-08-14',
    designWidth: 750,
    deviceRatio: {
      '640': 2.34 / 2,
      '750': 1,
      '828': 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'react',
    compiler: {
      type: 'webpack5',
      prebundle: { enable: false },
    },
    // JS 使用 esbuild 压缩（terser 在本项目产物规模下长时间卡死，esbuild 原生并行快得多）
    // 注意：target 需高于 es5，否则 esbuild 无法处理 const/let 会直接报错
    // CSS 保持默认 csso（Taro 的 esbuild CSS 压缩插件与内置 esbuild 版本不兼容，会报 preset 无效）
    jsMinimizer: 'esbuild',
    esbuild: {
      minify: {
        enable: true,
        config: {
          target: 'es2015',
        },
      },
    },
    cache: {
      enable: false,
    },
    mini: {
      miniCssExtractPluginOption: {
        ignoreOrder: true,
      },
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
    h5: {
      publicPath: './',
      staticDirectory: 'static',
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
  }

  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, devConfig)
  }
  return merge({}, baseConfig, prodConfig)
})
