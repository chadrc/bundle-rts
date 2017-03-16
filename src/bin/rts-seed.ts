#!/usr/bin/env node

import * as path from "path";
import * as fs from "fs";
import * as glob from "glob";
import {Arguments} from "./Arguments";
import {createComponent, createModule, ensureDir, isJsIdentifier, writeFile} from "./Utils";
import {makeIndexHTMLFile, makeIndexTSXFile, makeModuleManifestFile, makePackageJSONFile} from "./templates";

const settings = require('../package.json');

let args = new Arguments(process.argv);
args.skip(2); // skip node executable and command name

if (args.isEmpty) {
    console.log('No Arguments Given');
} else {

    let noMod = args.noModule;
    let noComp = args.noComponent;
    let noStyles = args.noStyles;
    let noTypes = args.noTypes;
    let noView = args.noView;

    let command = args.next();

    let appDir = "/app/";
    ensureDir(appDir);
    let basePath = process.cwd() + appDir;

    switch (command) {
        case "component":
            let componentPath = args.next();
            let componentName = path.basename(componentPath);
            if (isJsIdentifier(componentName)) {
                createComponent(componentName, componentPath, noView, noTypes);
            } else {
                console.error("Invalid identifier: " + componentName);
            }
            break;

        case "module":
            let moduleName = args.next();
            if (isJsIdentifier(moduleName)) {
                createModule(moduleName, noComp, noStyles);
                if (!noComp) {
                    createComponent(moduleName, `${moduleName}/${moduleName}`, noTypes, noView);
                }
            }
            break;

        case "project":
            let appName = args.next();
            if (!appName) {
                console.error("No app name provided.");
                break;
            }

            let filesToCopy: string[] = [
                "webpack.config.js",
                "tsconfig.json"
            ];
            for (let filename of filesToCopy) {
                fs.createReadStream(`${__dirname.replace("/bin", "")}/seed/${filename}`).pipe(fs.createWriteStream(`${process.cwd()}/${filename}`));
            }

            let indexTsxData = makeIndexTSXFile(appName);
            let indexHtmlData = makeIndexHTMLFile(appName);
            let pkgJsonData = makePackageJSONFile(appName, settings.version);

            writeFile(`${process.cwd()}/package.json`, pkgJsonData);
            writeFile(`${basePath}/index.html`, indexHtmlData);
            writeFile(`${basePath}/index.tsx`, indexTsxData);

            if (!noMod) {
                let moduleName = appName.replace(/ /g, "");
                if (isJsIdentifier(moduleName)) {
                    createModule(moduleName, noComp, noStyles);
                    if (!noComp) {
                        createComponent(moduleName, `${moduleName}/${moduleName}`, noView, noTypes);
                    }
                } else {
                    console.log("Initial module could not be created. App name could not be turned into valid JavaScript identifier.");
                }
            }
            break;

        case "manifest":
            let pattern = process.cwd() + "/app/modules/**/*.module.ts";
            let moduleFiles = glob.sync(pattern);
            let details = [];
            for (let m of moduleFiles) {
                let name = path.basename(m).replace(".module.ts", "");
                let stylePath = path.dirname(m) + "/styles.scss";
                let hasStyles = fs.existsSync(stylePath);
                details.push({
                    name: name,
                    hasStyles: hasStyles
                });
            }
            let text = makeModuleManifestFile(details);
            writeFile(`${basePath}module.manifest.ts`, text);
            break;
    }
}