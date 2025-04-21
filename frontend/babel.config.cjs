module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "> 0.25%, not dead",
        modules: false, // keep ES modules if using webpack
      },
    ],
  ],
  plugins: ["@babel/plugin-transform-runtime"],
};
