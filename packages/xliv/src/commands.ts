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
        cpToCwd(configDir, `webpack.config.js`);
    }

    let tsConfig = require(`${configDir}/tsconfig.json`);
    tsConfig.compilerOptions.baseUrl = ".";
    let includes = tsConfig.include;
    let newIncludes = [];
    for (let item of includes) {
        newIncludes.push(item.replace("../../../", "./"));
    }

    tsConfig.include = newIncludes;
    writeFile(`${process.cwd()}/tsconfig.json`, JSON.stringify(tsConfig, null, 2));

    //cpToCwd(configDir, `tsconfig.json`);
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
            createComponent(moduleName, "", moduleName, noView, noTypes, noStyles, true, false, true, `${appName} is ready`);
        } else {
            console.log("Initial module could not be created. App name could not be turned into valid JavaScript identifier.");
        }
    }
}

export function moduleCommand(moduleName: string, noStyles: boolean,
                              noTypes: boolean, noView: boolean): void {
    if (isJsIdentifier(moduleName)) {
        createComponent(moduleName, "", moduleName, noTypes, noView, noStyles, true, false, true, moduleName);
    }
}

export function componentCommand(componentId: string, noView: boolean, noTypes: boolean, noStyles: boolean, makeFlare: boolean = false, defaultText: string = ""): void {
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
        createComponent(componentName, componentPath, moduleName, noView, noTypes, noStyles, makeFlare, true, false, defaultText);
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
                                moduleRoot: boolean = false,
                                defaultText: string) {
    let componentData = Templates.makeComponentFile(componentName, noTypes, noView, noStyles, makeFlare, defaultText);
    let viewData = Templates.makeViewFile(componentName, noTypes, defaultText);
    let typesData = Templates.makeTypesFile(componentName);
    componentPath = componentPath ? componentPath + "/" : "";
    let localDir;
    if (moduleName === "~") {
        localDir = `/app/components/${componentPath}${componentName}/${componentName}`;
    } else {
        localDir = `/app/modules/${moduleName}/`;
        if (placeInComponentsFolder) {
            localDir += `components/${componentPath}${componentName}/`;
        }
        localDir += componentName;
    }
    ensureDir(localDir);
    let basePath = process.cwd() + localDir;
    let componentFileType = moduleRoot ? "module" : "component";
    let componentFilePath = `${basePath}.${componentFileType}.ts${noView ? "x" : ""}`;
    if (fs.existsSync(componentFilePath)) {
        console.error("Component already exists.");
        return;
    }
    writeFile(componentFilePath, componentData);

    if (moduleName !== "~" && makeFlare) {
        let flarePath = `/app/flares/${moduleName}/${componentPath}${componentName}.flare.ts`;
        ensureDir(flarePath);
        writeFile(process.cwd() + flarePath, Templates.makeComponentFlareFile(componentName, moduleName, noTypes, moduleRoot));
    }

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

    let indexTsxData = Templates.makeIndexTSXFile(appName, noMod);
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

        if (!pkgJson.scripts) {
            pkgJson.scripts = {};
        }

        if (!pkgJson.scripts.build) {
            pkgJson.scripts.build = "xliv build";
        }

        if (!pkgJson.scripts.start) {
            pkgJson.scripts.start = "xliv start --open";
        }

        pkgJsonData = JSON.stringify(pkgJson, null, 2);
    }

    writeFile(`${process.cwd()}/package.json`, pkgJsonData);
    writeFile(`${basePath}/index.html`, indexHtmlData);
    writeFile(`${basePath}/index.tsx`, indexTsxData);
}