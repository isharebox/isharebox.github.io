import { defineConfig, transformerDirectives, presetUno, presetIcons } from "unocss";
import { presetTheme } from "unocss-preset-theme";

// 深青色主题（JustGoIdea 风格）
const darkTheme = {
  colors: {
    primary: "#6b9999",        // 强调色
    text: "#e0e0e0",           // 主文字
    icon: "#8cbaba",           // 图标
    bg: "#0a2e2e",             // 深青背景
    modal: "#0d3b3b",          // 稍浅背景
    gray: "#5c8a8a",           // 弱化文字
    border: "#1a4a4a",         // 边框
    selection: "#1a4a4a",      // 选中
    comment: "#5c8a8a",        // 注释
    string: "#8cbaba",         // 字符串
    keyword: "#6b9999",        // 关键字
    function: "#8cbaba",       // 函数
    variable: "#e0e0e0",       // 变量
    type: "#6b9999",           // 类型
    number: "#8cbaba",         // 数字
    operator: "#5c8a8a",       // 操作符
    constant: "#8cbaba",       // 常量
  },
};

export default defineConfig({
  transformers: [transformerDirectives({ enforce: "pre" })],
  presets: [
    presetUno({
      dark: "class", // 改为 class 模式，强制用 dark 类
    }),
    presetTheme({
      theme: {
        dark: darkTheme,
      },
    }),
    presetIcons({
      autoInstall: true,
    }),
  ],
  theme: darkTheme, // 默认就用深色主题
  content: {
    filesystem: ["src/**/*.tsx", "src/**/*.astro"],
  },
});
