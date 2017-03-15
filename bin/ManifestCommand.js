"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glob = require("glob");
var path = require("path");
var fs = require("fs");
var Utils_1 = require("./Utils");
var templates_1 = require("./templates");
function ManifestCommand(args) {
    var pattern = process.cwd() + "/app/modules/**/*.module.ts";
    var moduleFiles = glob.sync(pattern);
    var details = [];
    for (var _i = 0, moduleFiles_1 = moduleFiles; _i < moduleFiles_1.length; _i++) {
        var m = moduleFiles_1[_i];
        var name_1 = path.basename(m).replace(".module.ts", "");
        var stylePath = path.dirname(m) + "/styles.scss";
        var hasStyles = fs.existsSync(stylePath);
        details.push({
            name: name_1,
            hasStyles: hasStyles
        });
    }
    var text = templates_1.makeModuleManifestFile(details);
    var dir = "/app/";
    Utils_1.ensureDir(dir);
    var basePath = process.cwd() + dir;
    Utils_1.writeFile(basePath + "module.manifest.ts", text);
}
exports.ManifestCommand = ManifestCommand;
