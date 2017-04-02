const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const xliv = require("xliv/utils");
const webpack = require("webpack");
const path = require("path");

console.log("Building with webpack.config.js from " + __filename);
console.log("Environment: " + process.env.NODE_ENV);

module.exports = {
    entry: xliv.addModuleEntries({
        app: "./app/index.tsx",
        vendor: ["react", "react-dom", "react-flares"]
    }),

    output: {
        filename: "js/[name].bundle.js",
        path: process.cwd() + "/dist"
    },

    devtool: "source-map",

    resolve: {
        alias: {
            flares: path.resolve(process.cwd(), "app/flares/")
        },
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "awesome-typescript-loader?configFileName=" + xliv.getTsConfig(__dirname)
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!sass-loader",
                })
            },
            {
                test: /\.js$/,
                enforce: "pre",
                use: "source-map-loader"
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'file-loader?name=[name].[ext]'
                }]
            }
        ]
    },

    plugins: [
        new CheckerPlugin(),
        new ExtractTextPlugin('css/[name].bundle.css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "js/vendor.bundle.js"
        })
    ],

    devServer: {
        contentBase: path.join(process.cwd(), "dist"),
        compress: true
    }
};
