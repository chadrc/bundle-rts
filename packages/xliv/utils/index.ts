import * as fs from "fs";
import * as glob from "glob";

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

export interface EnvConfig {
    defines?: {[name: string]: any}
}

export function getDefines(baseDefines: {[name: string]: string}) {
    let env: string = process.env.NODE_ENV;
    let baseConfig: {[name: string]: EnvConfig} = {};
    try {
        baseConfig = require(process.cwd() + "/environments/base.js");
    } catch (e) {}

    let envConfig: {[name: string]: EnvConfig} = {};
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
        baseConfig[key] = envConfig[key];
    }

    for (let key of Object.keys(baseConfig.defines)) {
        baseDefines[key] = JSON.stringify(baseConfig[key]);
    }

    return baseDefines;
}