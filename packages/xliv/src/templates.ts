
export function makeTypesFile(componentName: string): string {
    return `\
import {Data, Props, State} from "xliv/types";

export interface ${componentName}Props extends Props {
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
import {${dataName}View} from "xliv/types";${dataImport}

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

export function makeComponentFlareFile(componentName: string, componentPath: string, moduleName: string, noTypes: boolean, rootModuleComp: boolean): string {
    let extraImport = rootModuleComp ? "" : `${componentPath}/`;
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
        `"xliv/types"`
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
    let moduleName = appName.replace(/ /g, "");
    let flareImport = noComp ? "" : `\nimport ${moduleName} from "modules/${moduleName}/${moduleName}.module";`;
    let eleRender = noComp ? `\
            <section>
                {APP_NAME} - Ready
            </section>`
        :
        `\
            <Component>
                {APP_NAME} - Ready
            </Component>`;
    let commentMarks = noComp ? "// " : "";
    let instructions = noComp ? `\
// Uncomment when a module/component will be rendered
// Change all 'MyProject' occurrences to your module/component's name
` : "";
    return `\
import "react-hot-loader/patch";
import {AppContainer} from "react-hot-loader";

import * as React from "react";
import * as ReactDom from "react-dom";${flareImport}

import "index.html";

const APP_NAME: string = "${appName}";

const render = (Component: any) => {
    ReactDom.render(
        <AppContainer>
${eleRender}
        </AppContainer>
        , document.getElementById("content")
    );
};

render(${moduleName});

${instructions}${commentMarks}if (module.hot) {
${commentMarks}    module.hot.accept('./modules/${moduleName}/${moduleName}.module', () => {
${commentMarks}        const next: any = require('./modules/${moduleName}/${moduleName}.module');
${commentMarks}        render(next.default);
${commentMarks}    });
${commentMarks}}
`;
}

export function makeProdIndexTsxFile(appName: string, noComp: boolean): string {
    let flareImport = noComp ? "" : `\nimport ${appName} from "modules/${appName}/${appName}.module";`;
    let eleRender = noComp ? `\
    <section>
        {APP_NAME} - Ready
    </section>`
        :
        `\
    <${appName}>
        {APP_NAME} - Ready
    </${appName}>`;
    return `\
import * as React from "react";
import * as ReactDom from "react-dom";${flareImport}

import "index.html";

const APP_NAME: string = "${appName}";

ReactDom.render(
${eleRender}
    , document.getElementById("content")
);
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
