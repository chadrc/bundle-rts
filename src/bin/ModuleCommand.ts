import {Arguments} from "./Arguments";
import {createComponent, createModule, isJsIdentifier} from "./Utils";

export function ModuleCommand(args: Arguments) {
    let moduleName = args.next();
    let noComp = args.noComponent;
    let noStyles = args.noStyles;
    let noTypes = args.noTypes;
    let noView = args.noView;

    if (isJsIdentifier(moduleName)) {
        createModule(moduleName, noComp, noStyles);
        if (!noComp) {
            createComponent(moduleName, `${moduleName}/${moduleName}`, noTypes, noView);
        }
    }
}