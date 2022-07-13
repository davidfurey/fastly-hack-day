const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.ts",
  optimization: {
    minimize: true
  },
  mode: "production",
  target: "webworker",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "bin"),
    libraryTarget: "this",
  },
  module: {
    // Asset modules are modules that allow the use asset files (fonts, icons, etc) 
    // without additional configuration or dependencies.
    rules: [
      // asset/source exports the source code of the asset. 
      // Usage: e.g., import notFoundPage from "./page_404.html"
      {
        test: /\.(txt|html)/,
        type: "asset/source",
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          }
        ],
      },
    ],
  },
  // resolve: {
  //   fallback: {
  //     "child_process": false,
  //     "path": false,
  //     "fs": false,
  //     "os": false,
  //   }
  // },
  plugins: [
    // Polyfills go here.
    // Used for, e.g., any cross-platform WHATWG, 
    // or core nodejs modules needed for your application.
    new webpack.ProvidePlugin({
      URL: "core-js/web/url",
    }),
  ],
};
