import {exposeCommand} from "../src/commands";
import {getFileData} from "./setup";
import * as fs from "fs";

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
const EnvFileResolverPlugin = require("env-file-resolver-plugin");
const xliv = require("xliv/utils");
const webpack = require("webpack");
const path = require("path");

console.log("Building with webpack.config.js from " + __filename);
console.log("Environment: " + process.env.NODE_ENV);

let isProduction = process.env.NODE_ENV === "production";

let entries = xliv.addModuleEntries({
    app: "./index.tsx",
    vendor: ["react", "react-dom", "react-flares"]
});

if (!isProduction) {
    entries.patch = 'react-hot-loader/patch';
    entries.client = 'webpack-dev-server/client?http://8080';
    entries.hot = 'webpack/hot/only-dev-server';
}

module.exports = {
    context: path.resolve(process.cwd(), 'app'),

    entry: entries,

    output: {
        filename: "js/[name].bundle.js",
        path: process.cwd() + "/dist",
        publicPath: "/"
    },

    devtool: isProduction ? "source-map" : "eval-source-map",

    resolve: {
        modules: [
            path.resolve(process.cwd(), "app/"),
            "node_modules"
        ],
        extensions: [".ts", ".tsx", ".js"],
        plugins: [
            new EnvFileResolverPlugin()
        ]
    },

    module: {
        rules: [
            {
                test: /\\.tsx?$/,
                use: [
                    "react-hot-loader/webpack",
                    "awesome-typescript-loader?configFileName=" + xliv.getTsConfig(__dirname)
                ]
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new CheckerPlugin(),
        new ExtractTextPlugin('css/[name].bundle.css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "js/vendor.bundle.js"
        })
    ],

    devServer: {
        contentBase: path.join(process.cwd(), "dist"),
        compress: isProduction,
        publicPath: "/",
        hot: !isProduction
    }
};
`;
    expect(data).toBe(expected);
});

test('expose webpack config should match output', () => {
    exposeCommand();

    fs.appendFileSync(process.cwd() + webpackConfigFilePath, "\ntemp\n");

    exposeCommand();

    let data = getFileData(webpackConfigFilePath);

    let expected = `\
const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const EnvFileResolverPlugin = require("env-file-resolver-plugin");
const xliv = require("xliv/utils");
const webpack = require("webpack");
const path = require("path");

console.log("Building with webpack.config.js from " + __filename);
console.log("Environment: " + process.env.NODE_ENV);

let isProduction = process.env.NODE_ENV === "production";

let entries = xliv.addModuleEntries({
    app: "./index.tsx",
    vendor: ["react", "react-dom", "react-flares"]
});

if (!isProduction) {
    entries.patch = 'react-hot-loader/patch';
    entries.client = 'webpack-dev-server/client?http://8080';
    entries.hot = 'webpack/hot/only-dev-server';
}

module.exports = {
    context: path.resolve(process.cwd(), 'app'),

    entry: entries,

    output: {
        filename: "js/[name].bundle.js",
        path: process.cwd() + "/dist",
        publicPath: "/"
    },

    devtool: isProduction ? "source-map" : "eval-source-map",

    resolve: {
        modules: [
            path.resolve(process.cwd(), "app/"),
            "node_modules"
        ],
        extensions: [".ts", ".tsx", ".js"],
        plugins: [
            new EnvFileResolverPlugin()
        ]
    },

    module: {
        rules: [
            {
                test: /\\.tsx?$/,
                use: [
                    "react-hot-loader/webpack",
                    "awesome-typescript-loader?configFileName=" + xliv.getTsConfig(__dirname)
                ]
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new CheckerPlugin(),
        new ExtractTextPlugin('css/[name].bundle.css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "js/vendor.bundle.js"
        })
    ],

    devServer: {
        contentBase: path.join(process.cwd(), "dist"),
        compress: isProduction,
        publicPath: "/",
        hot: !isProduction
    }
};

temp
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
      "*": [
        "app/*"
      ]
    }
  },
  "include": [
    "./app/**/*"
  ],
  "files": [
    "./node_modules/@types/webpack-env/index.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}`;
    expect(data).toBe(expected);
});

test(`second expose shouldn't override current file`, () => {
    exposeCommand();

    fs.appendFileSync(process.cwd() + tsConfigFilePath, "\ntemp\n");

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
      "*": [
        "app/*"
      ]
    }
  },
  "include": [
    "./app/**/*"
  ],
  "files": [
    "./node_modules/@types/webpack-env/index.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
temp
`;
    expect(data).toBe(expected);
});