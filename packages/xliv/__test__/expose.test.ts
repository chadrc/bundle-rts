import {exposeCommand} from "../src/commands";
import {getFileData} from "./setup";

const webpackConfigFilePath = "/webpack.config.js";
const tsConfigFilePath = "/tsconfig.json";

test('expose webpack config should create webpack.config.js and tsconfig.json files', () => {
    exposeCommand();
    expect(getFileData(webpackConfigFilePath)).toBeTruthy();
    expect(getFileData(tsConfigFilePath)).toBeTruthy();
});

test('expose typescript config should only create tsconfig.json file', () => {
    exposeCommand(true);
    expect(() => getFileData(webpackConfigFilePath)).toThrow();
    expect(getFileData(tsConfigFilePath)).toBeTruthy();
});

test('expose webpack config should match output', () => {
    exposeCommand();

    let data = getFileData(webpackConfigFilePath);

    let expected = `\
const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const xliv = require("xliv/utils");
const webpack = require("webpack");
const path = require("path");

console.log("Building with webpack.config.js from " + __filename);
console.log("Environment: " + process.env.NODE_ENV);

let isProduction = process.env.NODE_ENV === "production";

module.exports = {
    entry: xliv.addModuleEntries({
        app: "./app/index.tsx",
        vendor: ["react", "react-dom", "react-flares"]
    }),

    output: {
        filename: "js/[name].bundle.js",
        path: process.cwd() + "/dist"
    },

    devtool: isProduction ? "source-map" : "eval-source-map",

    resolve: {
        alias: {
            flares: path.resolve(process.cwd(), "app/flares/")
        },
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\\.tsx?$/,
                use: "awesome-typescript-loader?configFileName=" + xliv.getTsConfig(__dirname)
            },
            {
                test: /\\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!sass-loader",
                })
            },
            {
                test: /\\.js$/,
                enforce: "pre",
                use: "source-map-loader"
            },
            {
                test: /\\.html$/,
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
        compress: isProduction
    }
};
`;
    expect(data).toBe(expected);
});

test('expose tsconfig config should match output', () => {
    exposeCommand();

    let data = getFileData(tsConfigFilePath);

    let expected = `\
{
  "compilerOptions": {
    "outDir": "./dist/",
    "sourceMap": true,
    "noImplicitAny": true,
    "module": "commonjs",
    "target": "es5",
    "jsx": "react",
    "baseUrl": ".",
    "paths": {
      "flares/*": [
        "app/flares/*"
      ]
    }
  },
  "include": [
    "./app/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
}`;
    expect(data).toBe(expected);
});