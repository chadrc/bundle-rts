import * as fs from "fs";
import * as path from "path";
import * as Templates from './templates'
import {ensureDir, isJsIdentifier, writeFile} from "./Utils";

function cpToCwd(dirName: string, fileName: string): void {
    let file = fs.readFileSync(`${dirName}/${fileName}`, "utf-8");
    writeFile(`${process.cwd()}/${fileName}`, file);
}

export function exposeCommand(typescriptOnly: boolean = false): void {
    let configDir = __dirname;
    let parts = configDir.split(path.sep);
    parts.pop();
    parts.push("config");
    configDir = parts.join(path.sep);
    if (!typescriptOnly) {
        if (!fs.existsSync(`${process.cwd()}/webpack.config.js`)) {
            cpToCwd(configDir, `webpack.config.js`);
        }
    }

    let tsConfigFile = `${process.cwd()}/tsconfig.json`;
    if (!fs.existsSync(tsConfigFile)) {
        let tsConfig = require(`${configDir}/tsconfig.json`);
        tsConfig.compilerOptions.baseUrl = ".";
        let includes = tsConfig.include;
        let newIncludes = [];
        for (let item of includes) {
            newIncludes.push(item.replace("../../../", "./"));
        }

        tsConfig.include = newIncludes;

        tsConfig.files[0] = "./node_modules/@types/webpack-env/index.d.ts";

        writeFile(tsConfigFile, JSON.stringify(tsConfig, null, 2));
    }
}

export function projectCommand(appName: string, version: string,
                               noMod: boolean, noStyles: boolean,
                               noView: boolean, noTypes: boolean): void {
    if (!appName) {
        console.error("No app name provided.");
        return;
    }

    createProject(appName, version, noMod);

    if (!noMod) {
        let moduleName = appName.replace(/ /g, "");
        if (isJsIdentifier(moduleName)) {
            createComponent(moduleName, "", moduleName, noView, noTypes, noStyles, true, false, true);
        } else {
            console.log("Initial module could not be created. App name could not be turned into valid JavaScript identifier.");
        }
    }
}

export function moduleCommand(moduleName: string, noStyles: boolean,
                              noTypes: boolean, noView: boolean): void {
    if (isJsIdentifier(moduleName)) {
        createComponent(moduleName, "", moduleName, noTypes, noView, noStyles, true, false, true);
    }
}

export function componentCommand(componentId: string, noView: boolean, noTypes: boolean, noStyles: boolean, makeFlare: boolean = false): void {
    let parts = componentId.split(":");
    if (parts.length !== 2) {
        throw "Invalid component id: " + componentId;
    }
    let moduleName = parts[0];
    let componentParts = parts[1].split("/");
    if (componentParts.length < 1) {
        throw "Invalid component id: " + componentId;
    }
    let componentName = componentParts.pop();
    for (let part of componentParts) {
        if (!isJsIdentifier(part)) {
            throw `Invalid identifier: ${componentName}. All parts of component path must be valid JavaScript identifiers.`;
        }
    }

    let componentPath = componentParts.join("/");
    if (isJsIdentifier(componentName)) {
        createComponent(componentName, componentPath, moduleName, noView, noTypes, noStyles, makeFlare, true, false);
    } else {
        console.error("Invalid identifier: " + componentName);
    }
}

export function createComponent(componentName: string,
                                componentPath: string,
                                moduleName: string,
                                noView: boolean,
                                noTypes: boolean,
                                noStyles: boolean,
                                makeFlare: boolean,
                                placeInComponentsFolder: boolean = true,
                                moduleRoot: boolean = false) {
    let componentData = Templates.makeComponentFile(componentName, noTypes, noView, noStyles, makeFlare);
    let viewData = Templates.makeViewFile(componentName, noTypes);
    let typesData = Templates.makeTypesFile(componentName);
    componentPath = componentPath ? componentPath + "/" : "";
    let localDir;
    if (moduleName === "~") {
        localDir = `/app/components/${componentPath}${componentName}/${componentName}`;
    } else {
        localDir = `/app/modules/${moduleName}/`;
        if (placeInComponentsFolder) {
            localDir += `${componentPath}${componentName}/`;
        }
        localDir += componentName;
    }
    ensureDir(localDir);
    let basePath = process.cwd() + localDir;
    let componentFileType = moduleRoot ? "module" : "component";
    let componentFilePath = `${basePath}.${componentFileType}.ts${noView ? "x" : ""}`;
    if (fs.existsSync(componentFilePath)) {
        throw "Component already exists.";
    }
    writeFile(componentFilePath, componentData);

    if (!noView) {
        writeFile(`${basePath}.view.tsx`, viewData);
    }

    if (!noTypes) {
        writeFile(`${basePath}.types.ts`, typesData);
    }

    if (!noStyles) {
        writeFile(`${basePath}.scss`, `/* ${moduleName} Styles */`);
    }
}

export function createProject(appName: string, version: string, noMod: boolean): void {
    let localDir = `/app/`;
    ensureDir(localDir);
    let basePath = process.cwd() + localDir;

    if (fs.existsSync(`${basePath}/index.tsx`)) {
        throw "Project already exists in current directory.";
    }

    let indexTsxData = Templates.makeIndexTSXFile(appName, noMod);
    let prodIndexTsxData = Templates.makeProdIndexTsxFile(appName, noMod);
    let indexHtmlData = Templates.makeIndexHTMLFile(appName);
    let pkgJsonData = Templates.makePackageJSONFile(appName, version);

    let pkgJsonPath = `${process.cwd()}/package.json`;
    if (fs.existsSync(pkgJsonPath)) {
        let pkgJson = require(pkgJsonPath);
        if (!pkgJson.dependencies) {
            pkgJson.dependencies = {};
        }

        if (!pkgJson.dependencies.xliv) {
            pkgJson.dependencies.xliv = version;
        }

        pkgJsonData = JSON.stringify(pkgJson, null, 2);
    }

    writeFile(`${process.cwd()}/package.json`, pkgJsonData);
    writeFile(`${basePath}/index.html`, indexHtmlData);
    writeFile(`${basePath}/index.tsx`, indexTsxData);
    writeFile(`${basePath}/index.production.tsx`, prodIndexTsxData);
}