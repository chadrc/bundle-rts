import {Arguments} from "./Arguments";
import {createComponent, isJsIdentifier} from "./Utils";
import * as path from "path";

export function ComponentCommand(args: Arguments): void {
    let componentPath = args.next();
    let noView = args.noView;
    let noTypes = args.noTypes;
    let componentName = path.basename(componentPath);
    if (isJsIdentifier(componentName)) {
        createComponent(componentName, componentPath, noView, noTypes);
    } else {
        console.error("Invalid identifier: " + componentName);
    }
}