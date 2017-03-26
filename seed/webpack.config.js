const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require("webpack");
const glob = require("glob");

let entries = {
    app: "./app/index.tsx",
    index: "./app/index.html",
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
        path: __dirname + "/dist"
    },

    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "awesome-typescript-loader"
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
            filename: "vendor.bundle.js"
        })
    ]
};
