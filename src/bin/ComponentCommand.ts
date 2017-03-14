import {Arguments} from "./Arguments";
import {makeComponentFile, makeTypesFile, makeViewFile} from "./templates";
import {ensureDir, isJsIdentifier, writeFile} from "./Utils";
import * as fs from "fs";
import * as path from "path";

export function ComponentCommand(args: Arguments): void {
    let componentPath = args.next();
    let noTypes = args.noTypes;
    let noView = args.noView;
    let componentName = path.basename(componentPath);
    if (isJsIdentifier(componentName)) {
        let componentData = makeComponentFile(componentName, noTypes, noView);
        let viewData = makeViewFile(componentName, noTypes);
        let typesData = makeTypesFile(componentName);
        let localDir = `/app/modules/${path}`;
        ensureDir(localDir);
        let basePath = process.cwd() + localDir;
        let componentFilePath = `${basePath}.component.tsx`;
        if (fs.existsSync(componentFilePath)) {
            console.error("Component already exists.");
            return;
        }
        writeFile(componentFilePath, componentData);
        if (!noView) {
            writeFile(`${basePath}.view.tsx`, viewData);
        }
        if (!noTypes) {
            writeFile(`${basePath}.types.tsx`, typesData);
        }
    } else {
        console.error("Invalid identifier: " + componentName);
    }
}