"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = require("./Utils");
function ModuleCommand(args) {
    var moduleName = args.next();
    var noComp = args.noComponent;
    var noStyles = args.noStyles;
    var noTypes = args.noTypes;
    var noView = args.noView;
    if (Utils_1.isJsIdentifier(moduleName)) {
        Utils_1.createModule(moduleName, noComp, noStyles);
        if (!noComp) {
            Utils_1.createComponent(moduleName, moduleName + "/" + moduleName, noTypes, noView);
        }
    }
}
exports.ModuleCommand = ModuleCommand;
