#!/usr/bin/env node

import * as path from "path";
import * as fs from "fs";
import * as glob from "glob";
import {Arguments} from "./Arguments";
import {createComponent, createModule, createProject, ensureDir, isJsIdentifier, writeFile} from "./Utils";
import {makeIndexHTMLFile, makeIndexTSXFile, makeModuleManifestFile, makePackageJSONFile} from "./templates";
import {componentCommand, manifestCommand, moduleCommand, projectCommand} from "./commands";

const settings = require('../package.json');

let args = new Arguments(process.argv);
args.skip(2); // skip node executable and command name

if (args.isEmpty) {
    console.log('No Arguments Given');
} else {
    let command = args.next();

    let appDir = "/app/";
    ensureDir(appDir);
    let basePath = process.cwd() + appDir;

    switch (command) {
        case "component":
            let componentPath = args.next();
            componentCommand(componentPath, args.noView, args.noTypes);
            break;

        case "module":
            let moduleName = args.next();
            moduleCommand(moduleName, args.noComponent, args.noStyles, args.noTypes, args.noView);
            break;

        case "project":
            let appName = args.next();
            projectCommand(appName, settings.version, basePath,
                args.noModule, args.noComponent, args.noStyles, args.noView, args.noTypes);
            break;

        case "manifest":
            manifestCommand(basePath);
            break;

        default:
            console.error("No such command: " + command);
    }
}