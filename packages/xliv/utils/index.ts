import * as fs from "fs";
import * as glob from "glob";
import {ensureDir, writeFile} from "../src/Utils";

export function getTsConfig(baseDir: string) {
    let tsConfigPath = baseDir + "/tsconfig.json";
    try {
        let localConfigPath = process.cwd() + "/tsconfig.json";
        fs.readFileSync(localConfigPath);
        tsConfigPath = localConfigPath
    } catch (e) {}
    return tsConfigPath
}

export function addModuleEntries(baseEntries: {[name: string]: string | string[]}) {
    let locations = glob.sync("./app/modules/*/*.module.ts");
    for (let g of locations) {
        let name = g.replace("./app/modules/", "").replace(".module.tsx", "").split("/")[0];
        process.stdout.write("module: " + name + " @ " + g);
        baseEntries[name] = g;
    }
    return baseEntries;
}

export function getDefines(baseDefines: {[name: string]: string}) {
    let env: string = process.env.NODE_ENV;
    let baseConfig: EnvConfig = {};
    try {
        baseConfig = require(process.cwd() + "/environments/base.js");
    } catch (e) {}

    let envConfig: EnvConfig = {};
    try {
        envConfig = require(process.cwd() + `/environments/${env}.js`);
    } catch (e) {}

    if (!envConfig.defines) {
        envConfig.defines = {};
    }

    if (!baseConfig.defines) {
        baseConfig.defines = {};
    }

    for (let key of Object.keys(envConfig.defines)) {
        baseConfig.defines[key] = envConfig.defines[key];
    }

    for (let key of Object.keys(baseConfig.defines)) {
        baseDefines[key] = JSON.stringify(baseConfig.defines[key]);
    }

    return baseDefines;
}

export function genDefineTypes() {
    let constMap: {[name: string]: boolean} = {};

    let files = glob.sync("./environments/*.js");
    for (let file of files) {
        file = file.replace(/^\./, process.cwd());
        let config: EnvConfig = null;
        try {
            config = require(file);
        } catch (e) {}

        if (config && config.defines) {
            for (let key of Object.keys(config.defines)) {
                constMap[key] = true;
            }
        }
    }

    let constText = "";
    for (let key of Object.keys(constMap)) {
        constText += `declare const ${key}: string;\n`;
    }
    constText = constText.trim();

    let text = `\
/* Generated File for Typescript compilation */

declare const BUILD_ENV: string;
${constText}
`;

    let localDir = "/environments/";
    ensureDir(localDir);
    let basePath = process.cwd() + localDir;
    writeFile(`${basePath}typings.d.ts`, text);
}