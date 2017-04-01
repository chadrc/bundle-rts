const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require("webpack");
const path = require("path");
const glob = require("glob");
const fs = require("fs");

console.log("Building with webpack.config.js from " + __filename);

let tsConfigPath = __dirname + "/tsconfig.json";
try {
    let localConfigPath = process.cwd() + "/tsconfig.json";
    fs.readFileSync(localConfigPath);
    tsConfigPath = localConfigPath
} catch (e) {}

let entries = {
    app: "./app/index.tsx",
    vendor: ["react", "react-dom", "react-flares"]
};

let locations = glob.sync("./app/modules/*/*.module.ts");
for (let g of locations) {
    let name = g.replace("./app/modules/", "").replace(".module.tsx").split("/")[0];
    process.stdout.write("module: " + name + " @ " + g);
    entries[name] = g;
}

module.exports = {
    entry: entries,

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
                use: "awesome-typescript-loader?configFileName=" + tsConfigPath
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
