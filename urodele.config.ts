export const config = {
  github: {
    login: "2kindlebox", // github login name, not user name
    repo: "2kindlebox.github.io", //"urodele",
    logInUrl: "",
    logInAuthUrl: "",
  },
  head: {
    title: "2kindlebox",
    brand: "2kindlebox",
    description: "Less is more",
  },
  footer: {
    copyright: "©  2kindlebox * since 2026  ",
    copyrightUrl: "https://2kindlebox.github.io",
  },
  pagination: {
    size: 10,
  },
  giscus: false as object | false,
} as const;

export default config;
