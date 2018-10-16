const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const PATHS = {
  root: path.resolve(__dirname, ".."),
  nodeModules: path.resolve(__dirname, "../node_modules"),
  src: path.resolve(__dirname, "../src"),
  dist: path.resolve(__dirname, "../dist")
};

const DEV_SERVER = {
  hot: true,
  hotOnly: true,
  host: "0.0.0.0",
  historyApiFallback: true,
  overlay: true
  // stats: 'verbose',
  // proxy: {
  //   '/api': 'http://localhost:3000'
  // },
};

module.exports = (env = {}) => {
  console.log({
    env
  });
  const isBuild = !!env.build;
  const isDev = !env.build;
  const isSourceMap = !!env.sourceMap || isDev;
  const mode = isDev ? "development" : "production";

  const frontend = {
    cache: true,
    devtool: isDev ? "eval-source-map" : "source-map",
    devServer: DEV_SERVER,

    context: PATHS.root,

    mode,

    entry: {
      app: isDev
        ? ["react-hot-loader/patch", "./src/index.tsx"]
        : ["./src/index.tsx"]
    },
    output: {
      path: PATHS.dist,
      filename: isDev ? "[name].js" : "[name].[hash].js",
      publicPath: isDev ? "/" : "/react-context"
      // chunkFilename: '[id].chunk.js',
    },

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      modules: ["src", "node_modules"]
    },

    module: {
      rules: [
        // typescript
        // { test: /\.tsx?$/, include: /src/, use: 'awesome-typescript-loader?silent=true' },
        {
          test: /\.tsx?$/,
          // test: modulePath => {
          //   const check = /(?<!\.(stories|spec))\.tsx?$/.test(modulePath);
          //   console.log(modulePath, check);
          //   return check;
          // },
          include: PATHS.src,
          // include: /(?<!\.(stories|spec))\.tsx?$/,
          // exclude: /(\.spec|stories)/,
          use: env.awesome
            ? [
                // { loader: 'react-hot-loader/webpack' },
                // {
                // 	loader: 'awesome-typescript-loader',
                // 	options: {
                // 		transpileOnly: true,
                // 		useTranspileModule: false,
                // 		sourceMap: isSourceMap,
                // 	},
                // },
              ]
            : [
                // { loader: 'react-hot-loader/webpack' },
                {
                  loader: "ts-loader",
                  options: {
                    // transpileOnly: true,
                    compilerOptions: {
                      // 'sourceMap': isSourceMap,
                      // 'target': isDev ? 'es2015' : 'es5',
                      // 'isolatedModules': true,
                      // 'noEmitOnError': true,
                    }
                  }
                }
              ]
        },
        // json
        {
          test: /\.json$/,
          include: [PATHS.src],
          use: {
            loader: "json-loader"
          }
        },
        // css
        {
          test: /\.css$/,
          // include: [PATHS.STYLES],
          loader: ExtractTextPlugin.extract([
            "css-loader"
            // 'postcss-loader',
          ])
        }
        // // less
        // {
        //   test: /\.less$/,
        //   include: [PATHS.STYLES],
        //   loader: ExtractTextPlugin.extract([
        //     'css-loader?{modules: false}',
        //     'less-loader',
        //   ]),
        // },
        // // images
        // {
        //   test: /\.(jpg|jpeg|png|gif|svg)$/,
        //   include: [PATHS.IMAGES],
        //   use: {
        //     loader: 'url-loader',
        //     options: {
        //       name: 'images/[hash].[ext]',
        //       limit: 1000, // inline file data until size
        //     },
        //   },
        // },
        // // fonts
        // {
        //   test: /\.(woff|woff2|ttf|eot)$/,
        //   include: [
        //     PATHS.ASSETS,
        //   ],
        //   use: {
        //     loader: 'file-loader',
        //     options: {
        //       name: 'fonts/[name].[hash].[ext]',
        //     },
        //   },
        // },
      ]
    },
    optimization: {
      splitChunks: false,
      minimizer: isBuild
        ? [
            new UglifyJsPlugin({
              // beautify: false,
              // compress: {
              // 	screw_ie8: true,
              // },
              // comments: false,
              // sourceMap: isSourceMap,
            })
          ]
        : []
    },
    plugins: [
      new webpack.EnvironmentPlugin(["NODE_ENV", "BACKEND_ENDPOINT"]),
      // new (require('webpack-dashboard/plugin').DashboardPlugin()),
      new ExtractTextPlugin("styles.css"),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(isDev ? "development" : "development")
        }
      }),
      new CopyWebpackPlugin([{ from: "static" }]),
      new HtmlWebpackPlugin({
        template: "./index.html",
        metadata: {
          baseUrl: isDev ? "/" : "/react-context"
        }
      }),
      ...(isDev
        ? [
            new webpack.HotModuleReplacementPlugin({
              // multiStep: true, // better performance with many files
            }),
            new webpack.NamedModulesPlugin()
          ]
        : []),
      ...(isBuild
        ? [
            new webpack.LoaderOptionsPlugin({
              minimize: true,
              debug: false
            })
          ]
        : [])
    ]
  };

  return [frontend];
};
