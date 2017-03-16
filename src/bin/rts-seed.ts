#!/usr/bin/env node

import * as path from "path";
import * as fs from "fs";
import * as glob from "glob";
import {Arguments} from "./Arguments";
import {createComponent, createModule, createProject, ensureDir, isJsIdentifier, writeFile} from "./Utils";
import {makeIndexHTMLFile, makeIndexTSXFile, makeModuleManifestFile, makePackageJSONFile} from "./templates";
import {manifestCommand} from "./commands";

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

            createProject(appName, basePath, settings.version);

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
            manifestCommand(basePath);
            break;
    }
}