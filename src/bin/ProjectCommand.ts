import * as fs from "fs";
import {Arguments} from "./Arguments";
import {createComponent, createModule, ensureDir, isJsIdentifier, writeFile} from "./Utils";
import {makeIndexHTMLFile, makeIndexTSXFile, makePackageJSONFile} from "./templates";
const settings = require('../package.json');

export function ProjectCommand(args: Arguments): void {
    let appName = args.next();
    if (!appName) {
        console.error("No app name provided.");
        return;
    }

    let noMod = args.noModule;
    let noComp = args.noComponent;
    let noStyles = args.noStyles;
    let noTypes = args.noTypes;
    let noView = args.noView;

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
    let dir = "/app/";
    ensureDir(dir);
    let basePath = process.cwd() + dir;
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
}