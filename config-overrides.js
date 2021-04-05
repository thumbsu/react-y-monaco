const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  webpack: (config, env) => {
    config.plugins.push(
      new MonacoWebpackPlugin({
        languages: ["javascript", "typescript", "html", "css", "json"]
      })
    );

    return config;
  }
};
