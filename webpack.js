const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const package = require("./package.json");
const path = require("path");
const webpack = require("webpack");

const build = (() => {
    const timestamp = new Date().getTime();
    return {
        name: package.name,
        version: package.version,
        timestamp: timestamp,
        author: package.author,
    };
})();

module.exports = {
    entry: {
        app: "./src/index.tsx",
    },

    output: {
        path: path.resolve("dist"),
        publicPath: "/",
        filename: `[name].[hash].${Date.now()}.js`,
        chunkFilename: `[id].[hash].${Date.now()}.chunk.js`,
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                enforce: "pre",
                use: [
                    {
                        loader: "tslint-loader",
                        options: {
                            configFile: "./tslint.json",
                            emitErrors: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: ["react-hot-loader/webpack", "ts-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                use: {
                    loader: "file-loader",
                    query: {
                        name: "assets/[name].[ext]",
                    },
                },
            },
        ],
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),

        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.BannerPlugin({
            banner: `${build.name} v.${build.version} (${build.timestamp}) © ${build.author}`,
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer({
                        // This option is replaced with `browserlist` in package.json
                        // browsers: ["Safari >= 8", "last 2 versions"],
                    }),
                ],
                htmlLoader: {
                    minimize: true,
                },
            },
        }),

        new HtmlWebpackPlugin({
            title: "React Skeleton",
            filename: "index.html",
            template: "./src/index.html",
        }),
    ],

    mode: "development",

    devtool: "source-map",

    stats: "errors-only",

    devServer: {
        publicPath: "/",
        contentBase: path.resolve("dist"),
        hot: true,
        compress: true,
        overlay: {
            warnings: false,
            errors: true,
        },
        proxy: {
            "/api": "http://localhost:3001/",
        },
        port: 3000,
        historyApiFallback: true,
        host: "0.0.0.0",
        disableHostCheck: true,
    },
};
