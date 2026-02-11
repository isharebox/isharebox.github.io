export const config = {
  github: {
    login: "isharebox", // github login name, not user name
    repo: "isharebox.github.io", //"urodele",
    logInUrl: "",
    logInAuthUrl: "",
  },
  head: {
    title: "isharebox",
    brand: "isharebox",
    description: "Less is more",
  },
  footer: {
    copyright: "©  isharebox  ·  since 2026  · ",
    copyrightUrl: "https://isharebox.github.io",
  },
  pagination: {
    size: 10,
  },
  giscus: false as object | false,
} as const;

export default config;
