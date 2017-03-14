"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var templates_1 = require("./templates");
var Utils_1 = require("./Utils");
var fs = require("fs");
var path = require("path");
function ComponentCommand(args) {
    var componentPath = args.next();
    var noTypes = args.noTypes;
    var noView = args.noView;
    var componentName = path.basename(componentPath);
    if (Utils_1.isJsIdentifier(componentName)) {
        var componentData = templates_1.makeComponentFile(componentName, noTypes, noView);
        var viewData = templates_1.makeViewFile(componentName, noTypes);
        var typesData = templates_1.makeTypesFile(componentName);
        var localDir = "/app/modules/" + path;
        Utils_1.ensureDir(localDir);
        var basePath = process.cwd() + localDir;
        var componentFilePath = basePath + ".component.tsx";
        if (fs.existsSync(componentFilePath)) {
            console.error("Component already exists.");
            return;
        }
        Utils_1.writeFile(componentFilePath, componentData);
        if (!noView) {
            Utils_1.writeFile(basePath + ".view.tsx", viewData);
        }
        if (!noTypes) {
            Utils_1.writeFile(basePath + ".types.tsx", typesData);
        }
    }
    else {
        console.error("Invalid identifier: " + componentName);
    }
}
exports.ComponentCommand = ComponentCommand;
