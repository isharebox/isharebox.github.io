import { defineConfig, transformerDirectives, presetUno, presetIcons } from "unocss";
import { presetTheme } from "unocss-preset-theme";

const themes = {
  dark: {
    colors: {
      primary: "#4a9eff",
      text: "#c8d3f5",
      icon: "#c8d3f5",
      bg: "#1e2030",
      modal: '#1f2335',
      gray: '#2a2e45',
      border: '#292e42',
      selection: '#3b4261',
      comment: '#565f89',
      string: '#9ece6a',
      keyword: '#bb9af7',
      function: '#7aa2f7',
      variable: '#e0af68',
      type: '#f7768e',
      number: '#ff9e64',
      operator: '#89ddff',
      constant: '#7dcfff',
    },
  } as any,
  light: {
    colors: {
      primary: "#facc15",
      text: "#000",
      icon: "rgba(116,115,115,1)",
      bg: "#fff",
      modal: '#fff',
      gray: '#f5f5f5',
      border: '#e5e5e5',
      selection: '#e5e5e5',
    },
  },
};

export default defineConfig({
  transformers: [transformerDirectives({ enforce: "pre" })],
  presets: [
    presetUno({
      dark: "class",  // ★ 改："media" → "class"
    }),
    presetTheme({
      theme: {
        dark: themes.dark,
      },
    }),
    presetIcons({
      autoInstall: true,
    }),
  ],
  theme: themes.dark,  // ★ 改：themes.light → themes.dark
  content: {
    filesystem: ["src/**/*.tsx", "src/**/*.astro"],  // ★ 添加 astro
  }
});
