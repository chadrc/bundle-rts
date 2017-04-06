
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

export function makeViewFile(componentName: string, noTypes: boolean): string {
    let typesBase = noTypes ? "" : componentName;
    let dataName = noTypes ? `Data, ` : "";
    let dataImport = noTypes ? "" : `\nimport {${componentName}Data} from "./${componentName}.types";`;
    return `\
import * as React from "react";
import {${dataName}View} from "react-flares";${dataImport}

export default class ${componentName}View implements View {
    make(component: ${typesBase}Data): JSX.Element {
        return (
            <section>
                {component.props.children}
            </section>
        );
    }
}
`;
}

export function makeComponentFlareFile(componentName: string, moduleName: string, noTypes: boolean, rootModuleComp: boolean): string {
    let extraImport = rootModuleComp ? "" : `components/${componentName}/`;
    let typesImport = noTypes ? "" : `\nimport {${componentName}Props} from "modules/${moduleName}/${extraImport}${componentName}.types";`;
    let componentProps = noTypes ? "" : ` & ${componentName}Props`;
    return `\
import * as ReactFlares from 'react-flares';${typesImport}

export default class ${componentName}Flare extends ReactFlares.ComponentFlare<ReactFlares.ComponentFlareProps${componentProps}> {
    get componentId(): string {return "${moduleName}:${componentName}";}
}
`;
}

export function makeComponentFile(componentName: string,
                                  noTypes: boolean,
                                  noView: boolean,
                                  noStyles: boolean,
                                  makeFlare: boolean): string {
    let flareImport = makeFlare ? `\nimport * as ReactFlares from "react-flares";` : "";
    let flareRegister = makeFlare ? `\n\nReactFlares.registerComponent("${componentName}", ${componentName});` : "";
    let styleImport = noStyles ? "" : `\n\nimport "./${componentName}.scss";`;
    let typesBase = noTypes ? "" : componentName;
    let typesImport = noTypes ?
        `"react-flares"`
        :
        `"./${componentName}.types"`;
    let viewImport = noView ? "" : `\nimport ${componentName}View from "./${componentName}.view";`;
    let viewComponent = noView ? `(
            <section>
                {this.props.children}
            </section>
        )` : `new ${componentName}View().make(this)`;

    return `\
import * as React from "react";${flareImport}
import {${typesBase}Data, ${typesBase}Props, ${typesBase}State} from ${typesImport};${viewImport}${styleImport}

export default class ${componentName} extends React.Component<${typesBase}Props, ${typesBase}State> implements ${typesBase}Data {

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

export function makeIndexTSXFile(appName: string, noComp: boolean): string {
    let flareImport = noComp ? "" : `\nimport ${appName}Flare from "flares/${appName}/${appName}.flare";`;
    let eleRender = noComp ? `\
        <section>
            {ENV.APP_NAME} - Ready
        </section>`
        :
        `\
        <${appName}Flare>
            {ENV.APP_NAME} - Ready
        </${appName}Flare>`;

    return `\
import * as React from "react";
import * as ReactDom from "react-dom";${flareImport}
import * as ENV from "env/base.env";

require("index.html");

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
        <script src="js/vendor.bundle.js"></script>
        
        <!-- Main -->
        <script src="js/app.bundle.js"></script>
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

export function makeEnvConfigFile(exportBase: boolean, appName: string, initialValues: {[name: string]: string}): string {
    let initialText = "";
    for (let key of Object.keys(initialValues)) {
        initialText += `export const ${key}: string = "${initialValues[key]}";\n`
    }
    initialText = initialText.trim();
    let baseImport = exportBase ? `export * from "./base.env";` : `export const APP_NAME: string = "${appName}";`;
    if (initialText === "" && exportBase) {
        initialText = `// export const MY_CONST: string = "My constant value";`;
    }

    if (initialText !== "") {
        initialText = `\n\n${initialText}`;
    }

    return `\
${baseImport}${initialText}
`;
}