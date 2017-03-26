
const libName = "ReactFlares";

module.exports = {
    entry: __dirname + "/src/lib/react-flares.ts",
    devtool: "source-map",
    output: {
        path: __dirname + "/dist",
        filename: "react-flares.js",
        library: libName,
        libraryTarget: "umd",
        umdNamedDefine: true
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "awesome-typescript-loader?{configFileName: './src/lib/tsconfig.json'}"
            },
            {
                test: /\.js$/,
                enforce: "pre",
                use: "source-map-loader"
            }
        ]
    },

    externals: {
        "react": "react",
        "react-dom": "react-dom"
    }
};
