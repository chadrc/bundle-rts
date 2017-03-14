"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function makeTypesFile(componentName) {
    return "import {Data, Props, State} from \"rts-fw\";\n\nexport interface " + componentName + "Props extends Props{\n}\n\nexport interface " + componentName + "State extends State {\n}\n\nexport interface " + componentName + "Data extends Data {\n}\n";
}
exports.makeTypesFile = makeTypesFile;
function makeViewFile(componentName, noTypes) {
    var typesBase = noTypes ? "" : componentName;
    var dataName = noTypes ? "Data, " : "";
    var dataImport = noTypes ? "" : "\nimport {" + componentName + "Data} from \"./" + componentName + ".types\";";
    return "import * as React from \"react\";\nimport {" + dataName + "View} from \"rts-fw\";" + dataImport + "\n\nexport class " + componentName + "View implements View {\n    make(self: " + typesBase + "Data): JSX.Element {\n        return (\n            <section>\n            </section>\n        );\n    }\n}\n";
}
exports.makeViewFile = makeViewFile;
function makeComponentFile(componentName, noTypes, noView) {
    var typesBase = noTypes ? "" : componentName;
    var typesImport = noTypes ?
        "\"rts-fw\""
        :
            "\"./" + componentName + ".types\"";
    var viewImport = noView ? "" : "\nimport {" + componentName + "View} from \"./" + componentName + ".view\";";
    var viewComponent = noView ? "(\n            <section>\n            </section>\n        )" : "new " + componentName + "View().make(this)";
    return "import * as React from \"react\";\nimport {" + typesBase + "Data, " + typesBase + "Props, " + typesBase + "State} from " + typesImport + ";" + viewImport + "\n\nexport class " + componentName + " extends React.Component<" + typesBase + "Props, " + typesBase + "State> implements " + typesBase + "Data {\n\n    constructor(props: " + typesBase + "Props) {\n        super(props);\n        this.state = {\n        }\n    }\n\n    render() {\n        return " + viewComponent + ";\n    }\n}\n";
}
exports.makeComponentFile = makeComponentFile;
function makeModuleFile(moduleName, noComp, noStyles) {
    var styleImport = noStyles ? "" : "\n\nimport \"./styles.scss\";";
    var compImport = noComp ? "" : "\nimport {" + moduleName + "} from \"./" + moduleName + ".component\";";
    var compRegister = noComp ? "" : "\n\t\tthis._components[\"" + moduleName + "\"] = " + moduleName + ";";
    return "import {Module} from \"rts-fw\"" + compImport + styleImport + "\n\nexport class " + moduleName + "Module implements Module {\n    private _components: {[name:string]: any};\n    constructor() {\n        this._components = {};" + compRegister + "\n    }\n\n    get components(): {[name:string]: any} {\n        return this._components;\n    }\n\n    get name(): string {\n        return \"" + moduleName + "\";\n    }\n}\n\n(<any>window)." + moduleName + " = new " + moduleName + "Module();\n    ";
}
exports.makeModuleFile = makeModuleFile;
function makeIndexTSXFile(appName) {
    return "import * as React from \"react\";\nimport * as ReactDom from \"react-dom\";\nimport {App} from \"rts-fw\";\nimport Manifest from \"./module.manifest\";\n\nconst " + appName + " = new App(Manifest); \n";
}
exports.makeIndexTSXFile = makeIndexTSXFile;
function makeModuleManifestFile(modDetails) {
    var mods = "";
    var count = 0;
    for (var _i = 0, modDetails_1 = modDetails; _i < modDetails_1.length; _i++) {
        var mod = modDetails_1[_i];
        mods += "    {\n        name: \"" + mod.name + "\",\n        hasStyles: " + mod.hasStyles + "\n    }" + (count !== modDetails.length - 1 ? ",\n" : "");
        count++;
    }
    return "import {ModuleDetails} from \"rts-fw\";\n\nlet ModuleManifest: ModuleDetails[] = [\n" + mods + "\n];\n\nexport default ModuleManifest;  \n";
}
exports.makeModuleManifestFile = makeModuleManifestFile;
function makeIndexHTMLFile(appName) {
    return "<!DOCTYPE html>\n    <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\">\n            <title>" + appName + "</title>\n        </head>\n    <body>\n        <main id=\"content\">\n            <p>Loading...</p>\n        </main>\n        \n        <!-- Dependencies -->\n        <script src=\"../node_modules/jquery/dist/jquery.js\"></script>\n        <script src=\"../node_modules/react/dist/react.js\"></script>\n        <script src=\"../node_modules/react-dom/dist/react-dom.js\"></script>\n        \n        <!-- Main -->\n        <script src=\"../dist/js/app.bundle.js\"></script>\n    </body>\n</html>\n";
}
exports.makeIndexHTMLFile = makeIndexHTMLFile;
function makePackageJSONFile(appName, libVersion) {
    var name = appName.toLowerCase().replace(" ", "-");
    return "{\n  \"name\": \"" + name + "\",\n  \"version\": \"1.0.0\",\n  \"description\": \"\",\n  \"main\": \"index.js\",\n  \"scripts\": {\n    \"build\": \"./node_modules/.bin/webpack\",\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\n  },\n  \"author\": \"\",\n  \"license\": \"ISC\",\n  \"dependencies\": {\n    \"jquery\": \"^3.1.1\",\n    \"react\": \"^15.4.2\",\n    \"react-dom\": \"^15.4.2\"\n  },\n  \"devDependencies\": {\n    \"@types/react\": \"^15.0.16\",\n    \"@types/react-dom\": \"^0.14.23\",\n    \"@types/jquery\": \"^2.0.41\",\n    \"awesome-typescript-loader\": \"^3.1.2\",\n    \"css-loader\": \"^0.27.1\",\n    \"extract-text-webpack-plugin\": \"^2.1.0\",\n    \"glob\": \"^7.1.1\",\n    \"node-sass\": \"^4.5.0\",\n    \"rts-fw\": \"" + libVersion + "\",\n    \"sass-loader\": \"^6.0.3\",\n    \"source-map-loader\": \"^0.2.0\",\n    \"style-loader\": \"^0.13.2\",\n    \"typescript\": \"^2.2.1\",\n    \"webpack\": \"^2.2.1\"\n  }\n}  \n";
}
exports.makePackageJSONFile = makePackageJSONFile;
