export function makeTypesFile(componentName: string): string {
    return `\
import {Data, Props, State} from "rts-fw";

export interface ${componentName}Props extends Props{
}

export interface ${componentName}State extends State {
}

export interface ${componentName}Data extends Data {
}
`;
}

export function makeViewFile(componentName: string, noTypes: boolean): string {
    let typesBase = noTypes ? "" : componentName;
    let dataName = noTypes ? `Data, ` : "";
    let dataImport = noTypes ? "" : `\nimport {${componentName}Data} from "./${componentName}.types";`;
    return `\
import * as React from "react";
import {${dataName}View} from "rts-fw";${dataImport}

export class ${componentName}View implements View {
    make(self: ${typesBase}Data): JSX.Element {
        return (
            <section>
            </section>
        );
    }
}
`;
}

export function makeComponentFile(componentName: string, noTypes: boolean, noView: boolean): string {
    let typesBase = noTypes ? "" : componentName;
    let typesImport = noTypes ?
        `"rts-fw"`
        :
        `"./${componentName}.types"`;
    let viewImport = noView ? "" : `\nimport {${componentName}View} from "./${componentName}.view";`;
    let viewComponent = noView ? `(
            <section>
            </section>
        )` : `new ${componentName}View().make(this)`;

    return `\
import * as React from "react";
import {${typesBase}Data, ${typesBase}Props, ${typesBase}State} from ${typesImport};${viewImport}

export class ${componentName} extends React.Component<${typesBase}Props, ${typesBase}State> implements ${typesBase}Data {

    constructor(props: ${typesBase}Props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return ${viewComponent};
    }
}
`;
}

export function makeModuleFile(moduleName: string, noComp: boolean, noStyles: boolean): string {
    let styleImport = noStyles ? "" : `\n\nimport "./styles.scss";`;
    let compImport = noComp ? "" : `\nimport {${moduleName}} from "./${moduleName}.component";`;
    let compRegister = noComp ? "" : `\n\t\tthis._components["${moduleName}"] = ${moduleName};`;
    return `\
import {Module} from "rts-fw"${compImport}${styleImport}

export class ${moduleName}Module implements Module {
    private _components: {[name:string]: any};
    constructor() {
        this._components = {};${compRegister}
    }

    get components(): {[name:string]: any} {
        return this._components;
    }

    get name(): string {
        return "${moduleName}";
    }
}

(<any>window).${moduleName} = new ${moduleName}Module();
    `;
}

export function makeIndexTSXFile(appName: string): string {
    return `\
import * as React from "react";
import * as ReactDom from "react-dom";
import {App} from "rts-fw";
import Manifest from "./module.manifest";

const ${appName} = new App(Manifest); 
`;
}

interface ModuleDetails {
    name: string,
    hasStyles: boolean
}

export function makeModuleManifestFile(modDetails: ModuleDetails[]): string {
    let mods = "";
    let count = 0;
    for (let mod of modDetails) {
        mods += `\
    {
        name: "${mod.name}",
        hasStyles: ${mod.hasStyles}
    }${count !== modDetails.length-1 ? ",\n" : ""}`;
        count++;
    }
    return `\
import {ModuleDetails} from "rts-fw";

let ModuleManifest: ModuleDetails[] = [
${mods}
];

export default ModuleManifest;  
`;
}

export function makeIndexHTMLFile(appName: string): string {
    return `\
<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>${appName}</title>
        </head>
    <body>
        <main id="content">
            <p>Loading...</p>
        </main>
        
        <!-- Dependencies -->
        <script src="../node_modules/jquery/dist/jquery.js"></script>
        <script src="../node_modules/react/dist/react.js"></script>
        <script src="../node_modules/react-dom/dist/react-dom.js"></script>
        
        <!-- Main -->
        <script src="../dist/js/app.bundle.js"></script>
    </body>
</html>
`;
}

export function makePackageJSONFile(appName: string, libVersion: string): string {
    let name = appName.toLowerCase().replace(" ", "-");
    return `\
{
  "name": "${name}",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "./node_modules/.bin/webpack",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "jquery": "^3.1.1",
    "react": "^15.4.2",
    "react-dom": "^15.4.2"
  },
  "devDependencies": {
    "@types/react": "^15.0.16",
    "@types/react-dom": "^0.14.23",
    "@types/jquery": "^2.0.41",
    "awesome-typescript-loader": "^3.1.2",
    "css-loader": "^0.27.1",
    "extract-text-webpack-plugin": "^2.1.0",
    "glob": "^7.1.1",
    "node-sass": "^4.5.0",
    "rts-fw": "${libVersion}",
    "sass-loader": "^6.0.3",
    "source-map-loader": "^0.2.0",
    "style-loader": "^0.13.2",
    "typescript": "^2.2.1",
    "webpack": "^2.2.1"
  }
}  
`;
}