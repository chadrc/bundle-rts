"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = require("./Utils");
var path = require("path");
function ComponentCommand(args) {
    var componentPath = args.next();
    var noView = args.noView;
    var noTypes = args.noTypes;
    var componentName = path.basename(componentPath);
    if (Utils_1.isJsIdentifier(componentName)) {
        Utils_1.createComponent(componentName, componentPath, noView, noTypes);
    }
    else {
        console.error("Invalid identifier: " + componentName);
    }
}
exports.ComponentCommand = ComponentCommand;
