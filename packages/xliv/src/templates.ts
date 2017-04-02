export function makeTypesFile(componentName: string): string {
    return `\
import {Data, Props, State} from "react-flares";

export interface ${componentName}Props extends Props {
}

export interface ${componentName}State extends State {
}

export interface ${componentName}Data extends Data {
    props: ${componentName}Props
    state: ${componentName}State
}
`;
}

export function makeViewFile(componentName: string, noTypes: boolean, defaultText: string): string {
    let typesBase = noTypes ? "" : componentName;
    let dataName = noTypes ? `Data, ` : "";
    let dataImport = noTypes ? "" : `\nimport {${componentName}Data} from "./${componentName}.types";`;
    let display = defaultText ? `\n                <p>${defaultText}</p>` : "";
    return `\
import * as React from "react";
import {${dataName}View} from "react-flares";${dataImport}

export class ${componentName}View implements View {
    make(component: ${typesBase}Data): JSX.Element {
        return (
            <section>${display}
            </section>
        );
    }
}
`;
}

export function makeComponentFlareFile(componentName: string, moduleName: string, noTypes: boolean, rootModuleComp: boolean): string {
    let extraImport = rootModuleComp ? "" : `components/${componentName}/`;
    let typesImport = noTypes ? "" : `\nimport {${componentName}Props} from "../../modules/${moduleName}/${extraImport}${componentName}.types";`;
    let componentProps = noTypes ? "" : ` & ${componentName}Props`;
    return `\
import * as ReactFlares from 'react-flares';${typesImport}

export class ${componentName}Flare extends ReactFlares.ComponentFlare<ReactFlares.ComponentFlareProps${componentProps}> {
    get componentId(): string {return "${moduleName}:${componentName}";}
}
`;
}

export function makeComponentFile(componentName: string,
                                  noTypes: boolean,
                                  noView: boolean,
                                  noStyles: boolean,
                                  makeFlare: boolean,
                                  defaultText: string): string {
    let flareImport = makeFlare ? `\nimport * as ReactFlares from "react-flares";` : "";
    let flareRegister = makeFlare ? `\n\nReactFlares.registerComponent("${componentName}", ${componentName});` : "";
    let styleImport = noStyles ? "" : `\n\nimport "./${componentName}.scss";`;
    let typesBase = noTypes ? "" : componentName;
    let typesImport = noTypes ?
        `"react-flares"`
        :
        `"./${componentName}.types"`;
    let viewImport = noView ? "" : `\nimport {${componentName}View} from "./${componentName}.view";`;
    let display = defaultText ? `\n                <p>${defaultText}</p>` : "";
    let viewComponent = noView ? `(
            <section>${display}
            </section>
        )` : `new ${componentName}View().make(this)`;

    return `\
import * as React from "react";${flareImport}
import {${typesBase}Data, ${typesBase}Props, ${typesBase}State} from ${typesImport};${viewImport}${styleImport}

export class ${componentName} extends React.Component<${typesBase}Props, ${typesBase}State> implements ${typesBase}Data {

    constructor(props: ${typesBase}Props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return ${viewComponent};
    }
}${flareRegister}
`;
}

export function makeModuleFile(moduleName: string, noComp: boolean, noStyles: boolean): string {
    let styleImport = noStyles ? "" : `\n\nimport "./${moduleName}.scss";`;
    let compImport = noComp ? "" : `\nimport {${moduleName}} from "./${moduleName}.component";`;
    let compRegister = noComp ? "" : `\n        this._components["${moduleName}"] = ${moduleName};`;
    return `\
import * as ReactFlares from "react-flares"${compImport}${styleImport}

export class ${moduleName}Module implements ReactFlares.Module {
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

ReactFlares.modules.${moduleName} = new ${moduleName}Module();
`;
}

export function makeIndexTSXFile(appName: string, noComp: boolean): string {
    let flareImport = noComp ? "" : `\nimport {${appName}Flare} from "flares/${appName}/${appName}.flare";`;
    let eleRender = noComp ? `\
        <section>
            <h1>${appName} - Ready</h1>
        </section>`
        :
        `\
        <${appName}Flare />`;

    return `\
import * as React from "react";
import * as ReactDom from "react-dom";${flareImport}

require("./index.html");

window.addEventListener("load", () => {
    ReactDom.render(
${eleRender}
        , document.getElementById("content")
    );
});
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
        <script src="../js/vendor.bundle.js"></script>
        
        <!-- Main -->
        <script src="../js/app.bundle.js"></script>
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
    "build": "xliv build --optimize-minimize",
    "start": "xliv start --open"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "xliv": "${libVersion}"
  },
  "devDependencies": {
  
  }
}  
`;
}