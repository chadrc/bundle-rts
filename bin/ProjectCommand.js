"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Utils_1 = require("./Utils");
var templates_1 = require("./templates");
var settings = require('../package.json');
function ProjectCommand(args) {
    var appName = args.next();
    if (!appName) {
        console.error("No app name provided.");
        return;
    }
    var noMod = args.noModule;
    var noComp = args.noComponent;
    var noStyles = args.noStyles;
    var noTypes = args.noTypes;
    var noView = args.noView;
    var filesToCopy = [
        "webpack.config.js",
        "tsconfig.json"
    ];
    for (var _i = 0, filesToCopy_1 = filesToCopy; _i < filesToCopy_1.length; _i++) {
        var filename = filesToCopy_1[_i];
        fs.createReadStream(__dirname.replace("/bin", "") + "/seed/" + filename).pipe(fs.createWriteStream(process.cwd() + "/" + filename));
    }
    var indexTsxData = templates_1.makeIndexTSXFile(appName);
    var indexHtmlData = templates_1.makeIndexHTMLFile(appName);
    var pkgJsonData = templates_1.makePackageJSONFile(appName, settings.version);
    Utils_1.writeFile(process.cwd() + "/package.json", pkgJsonData);
    var dir = "/app/";
    Utils_1.ensureDir(dir);
    var basePath = process.cwd() + dir;
    Utils_1.writeFile(basePath + "/index.html", indexHtmlData);
    Utils_1.writeFile(basePath + "/index.tsx", indexTsxData);
    if (!noMod) {
        var moduleName = appName.replace(/ /g, "");
        if (Utils_1.isJsIdentifier(moduleName)) {
            Utils_1.createModule(moduleName, noComp, noStyles);
            if (!noComp) {
                Utils_1.createComponent(moduleName, moduleName + "/" + moduleName, noView, noTypes);
            }
        }
        else {
            console.log("Initial module could not be created. App name could not be turned into valid JavaScript identifier.");
        }
    }
}
exports.ProjectCommand = ProjectCommand;
