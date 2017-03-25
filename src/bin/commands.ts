import * as path from "path";
import * as fs from "fs";
import * as glob from "glob";
import * as Templates from './templates'
import {ensureDir, isJsIdentifier, writeFile} from "./Utils";

export function manifestCommand(): void {
    let localDir = `/app/`;
    ensureDir(localDir);
    let basePath = process.cwd() + localDir;
    
    let pattern = process.cwd() + "/app/modules/**/*.module.ts";
    let moduleFiles = glob.sync(pattern);
    let details = [];
    for (let m of moduleFiles) {
        let name = path.basename(m).replace(".module.ts", "");
        let stylePath = path.dirname(m) + `/${name}.scss`;
        let hasStyles = fs.existsSync(stylePath);
        details.push({
            name: name,
            hasStyles: hasStyles
        });
    }
    let text = Templates.makeModuleManifestFile(details);
    writeFile(`${basePath}module.manifest.ts`, text);
}

export function projectCommand(appName: string, version: string,
                               noMod: boolean, noComp: boolean, noStyles: boolean,
                               noView: boolean, noTypes: boolean): void {
    if (!appName) {
        console.error("No app name provided.");
        return;
    }

    createProject(appName, version);

    if (!noMod) {
        let moduleName = appName.replace(/ /g, "");
        if (isJsIdentifier(moduleName)) {
            createModule(moduleName, noComp, noStyles);
            if (!noComp) {
                createComponent(moduleName, moduleName, noView, noTypes, false);
            }
        } else {
            console.log("Initial module could not be created. App name could not be turned into valid JavaScript identifier.");
        }
    }
}

export function moduleCommand(moduleName: string, noComp: boolean, noStyles: boolean,
                              noTypes: boolean, noView: boolean): void {
    if (isJsIdentifier(moduleName)) {
        createModule(moduleName, noComp, noStyles);
        if (!noComp) {
            createComponent(moduleName, moduleName, noTypes, noView, false);
        }
    }
}

export function componentCommand(componentId: string, noView: boolean, noTypes: boolean): void {
    let parts = componentId.split(":");
    if (parts.length !== 2) {
        throw "Invalid component id: " + componentId;
    }
    let moduleName = parts[0];
    let componentName = parts[1];
    if (isJsIdentifier(componentName)) {
        createComponent(componentName, moduleName, noView, noTypes);
    } else {
        console.error("Invalid identifier: " + componentName);
    }
}

export function createComponent(componentName: string, moduleName: string, noView: boolean, noTypes: boolean, placeInComponentsFolder: boolean = true) {
    let componentData = Templates.makeComponentFile(componentName, noTypes, noView);
    let viewData = Templates.makeViewFile(componentName, noTypes);
    let typesData = Templates.makeTypesFile(componentName);
    let localDir;
    if (moduleName === "~") {
        localDir = `/app/components/${componentName}`;
    } else {
        localDir = `/app/modules/${moduleName}/`;
        if (placeInComponentsFolder) {
            localDir += `components/${componentName}/`;
        }
        localDir += componentName;
    }
    ensureDir(localDir);
    let basePath = process.cwd() + localDir;
    let componentFilePath = `${basePath}.component.ts${noView ? "x": ""}`;
    if (fs.existsSync(componentFilePath)) {
        console.error("Component already exists.");
        return;
    }
    writeFile(componentFilePath, componentData);

    if (moduleName !== "~") {
        let flarePath = `/app/flares/${componentName}.flare.ts`;
        ensureDir(flarePath);
        writeFile(process.cwd() + flarePath, Templates.makeComponentFlareFile(componentName, moduleName, noTypes));
    }

    if (!noView) {
        writeFile(`${basePath}.view.tsx`, viewData);
    }
    if (!noTypes) {
        writeFile(`${basePath}.types.ts`, typesData);
    }
}

export function createModule(moduleName: string, noComp: boolean, noStyles: boolean): void {
    let moduleDetails = Templates.makeModuleFile(moduleName, noComp, noStyles);
    let localDir = `/app/modules/${moduleName}/`;
    ensureDir(localDir);
    let basePath = process.cwd() + localDir;
    let moduleFilePath = `${basePath}/${moduleName}.module.ts`;
    if (fs.existsSync(moduleFilePath)) {
        console.error("Module already exists.");
        return;
    }
    writeFile(moduleFilePath, moduleDetails);
    if (!noStyles) {
        writeFile(`${basePath}/${moduleName}.scss`, "");
    }
}

export function createProject(appName: string, version: string): void {

    let filesToCopy: string[] = [
        "webpack.config.js",
        "tsconfig.json"
    ];

    let localDir = `/app/`;
    ensureDir(localDir);
    let basePath = process.cwd() + localDir;

    // Go up __dirname path until we find our package root folder
    // To work with tests better
    let pathAry = __dirname.split("/");
    let i = pathAry.length-1;
    while (i > 0) {
        if (pathAry[i] === "react-flares") {
            break;
        }
        pathAry.pop();
        i--;
    }
    let pkgPath = pathAry.join("/");
    
    for (let filename of filesToCopy) {
        let file = fs.readFileSync(`${pkgPath.replace("/bin", "")}/seed/${filename}`, "utf-8");
        writeFile(`${process.cwd()}/${filename}`, file);
    }
    
    let indexTsxData = Templates.makeIndexTSXFile(appName);
    let indexHtmlData = Templates.makeIndexHTMLFile(appName);
    let pkgJsonData = Templates.makePackageJSONFile(appName, version);

    writeFile(`${process.cwd()}/package.json`, pkgJsonData);
    writeFile(`${basePath}/index.html`, indexHtmlData);
    writeFile(`${basePath}/index.tsx`, indexTsxData);
}