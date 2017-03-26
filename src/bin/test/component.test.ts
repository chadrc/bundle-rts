import {componentCommand} from "../commands";
import {fileExists, getFileData} from "./setup";

const componentName = "MyComponent";
const moduleName = "MyModule";

const rootComponentId = `~:${componentName}`;
const moduleComponentId = `${moduleName}:${componentName}`;

const componentFile = `${componentName}.component.ts`;
const viewFile = `${componentName}.view.tsx`;
const typesFile = `${componentName}.types.ts`;
const flareFile = `${componentName}.flare.ts`;

const componentFilePath =       `/app/components/${componentFile}`;
const noViewComponentFilePath = componentFilePath + "x";
const viewFilePath =            `/app/components/${viewFile}`;
const typesFilePath =           `/app/components/${typesFile}`;
const flareFilePath =           `/app/flares/${moduleName}/${flareFile}`;

const moduleComponentFilePath = `/app/modules/${moduleName}/components/${componentName}/${componentFile}`;
const moduleViewFilePath =      `/app/modules/${moduleName}/components/${componentName}/${viewFile}`;
const moduleTypesFilePath =     `/app/modules/${moduleName}/components/${componentName}/${typesFile}`;


test('creates a component with component, view and types files', () => {
    componentCommand(rootComponentId, false, false);

    expect(fileExists(componentFilePath)).toBeTruthy();
    expect(fileExists(viewFilePath)).toBeTruthy();
    expect(fileExists(typesFilePath)).toBeTruthy();
    expect(fileExists(flareFilePath)).toBeFalsy();
});

test('creates a component with component and view files', () => {
    componentCommand(rootComponentId, false, true);

    expect(fileExists(componentFilePath)).toBeTruthy();
    expect(fileExists(viewFilePath)).toBeTruthy();
    expect(fileExists(typesFilePath)).toBeFalsy();
    expect(fileExists(flareFilePath)).toBeFalsy();
});

test('creates a component with component and types files', () => {
    componentCommand(rootComponentId, true, false);

    expect(fileExists(noViewComponentFilePath)).toBeTruthy();
    expect(fileExists(viewFilePath)).toBeFalsy();
    expect(fileExists(typesFilePath)).toBeTruthy();
    expect(fileExists(flareFilePath)).toBeFalsy();
});

test('creates a component with component file only', () => {
    componentCommand(rootComponentId, true, true);

    expect(fileExists(noViewComponentFilePath)).toBeTruthy();
    expect(fileExists(viewFilePath)).toBeFalsy();
    expect(fileExists(typesFilePath)).toBeFalsy();
    expect(fileExists(flareFilePath)).toBeFalsy();
});

test('creates a module component', () => {
    componentCommand(moduleComponentId, false, false);

    expect(fileExists(moduleComponentFilePath)).toBeTruthy();
    expect(fileExists(moduleViewFilePath)).toBeTruthy();
    expect(fileExists(moduleTypesFilePath)).toBeTruthy();
    expect(fileExists(flareFilePath)).toBeTruthy();
});

test('created component with view and types should have expected output', () => {
    componentCommand(rootComponentId, false, false);
    
    let data = getFileData(componentFilePath);

    let expectedComponentText = `\
import * as React from "react";
import {MyComponentData, MyComponentProps, MyComponentState} from "./MyComponent.types";
import {MyComponentView} from "./MyComponent.view";

export class MyComponent extends React.Component<MyComponentProps, MyComponentState> implements MyComponentData {

    constructor(props: MyComponentProps) {
        super(props);
        this.state = {
        }
    }

    render() {
        return new MyComponentView().make(this);
    }
}
`;
    expect(data).toBe(expectedComponentText);
});

test('created component flare should have expected output', () => {
    // Need module and component to properly test
    componentCommand(moduleComponentId, false, false);

    let data = getFileData(flareFilePath);

    let expectedComponentText = `\
import * as ReactFlares from 'react-flares';
import {MyComponentProps} from "../../modules/MyModule/components/MyComponent/MyComponent.types";

export class MyComponentFlare extends ReactFlares.ComponentFlare<ReactFlares.ComponentFlareProps & MyComponentProps> {
    get componentId(): string {return "MyModule:MyComponent";}
}
`;
    expect(data).toBe(expectedComponentText);
});

test('created component flare without component types should have expected output', () => {
    // Need module and component to properly test
    componentCommand(moduleComponentId, false, true);

    let data = getFileData(flareFilePath);

    let expectedComponentText = `\
import * as ReactFlares from 'react-flares';

export class MyComponentFlare extends ReactFlares.ComponentFlare<ReactFlares.ComponentFlareProps> {
    get componentId(): string {return "MyModule:MyComponent";}
}
`;
    expect(data).toBe(expectedComponentText);
});

test('created component with view and without types should have expected output', () => {
    componentCommand(rootComponentId, false, true);

    let data = getFileData(componentFilePath);

    let expectedComponentText = `\
import * as React from "react";
import {Data, Props, State} from "react-flares";
import {MyComponentView} from "./MyComponent.view";

export class MyComponent extends React.Component<Props, State> implements Data {

    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return new MyComponentView().make(this);
    }
}
`;
    expect(data).toBe(expectedComponentText);
});

test("created component without view and with types should have expected output", () => {
    componentCommand(rootComponentId, true, false);

    let data = getFileData(noViewComponentFilePath);

    let expectedComponentText = `\
import * as React from "react";
import {MyComponentData, MyComponentProps, MyComponentState} from "./MyComponent.types";

export class MyComponent extends React.Component<MyComponentProps, MyComponentState> implements MyComponentData {

    constructor(props: MyComponentProps) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <section>
            </section>
        );
    }
}
`;
    expect(data).toBe(expectedComponentText);
});

test("created component without view and without types should have expected output", () => {
    componentCommand(rootComponentId, true, true);

    let data = getFileData(noViewComponentFilePath);

    let expectedComponentText = `\
import * as React from "react";
import {Data, Props, State} from "react-flares";

export class MyComponent extends React.Component<Props, State> implements Data {

    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <section>
            </section>
        );
    }
}
`;
    expect(data).toBe(expectedComponentText);
});

test("created component's view with types should have expected output", () => {
    componentCommand(rootComponentId, false, false);

    let data = getFileData(viewFilePath);

    let expectedComponentText = `\
import * as React from "react";
import {View} from "react-flares";
import {MyComponentData} from "./MyComponent.types";

export class MyComponentView implements View {
    make(self: MyComponentData): JSX.Element {
        return (
            <section>
            </section>
        );
    }
}
`;
    expect(data).toBe(expectedComponentText);
});

test("created component's view without types should have expected output", () => {
    componentCommand(rootComponentId, false, true);

    let data = getFileData(viewFilePath);

    let expectedComponentText = `\
import * as React from "react";
import {Data, View} from "react-flares";

export class MyComponentView implements View {
    make(self: Data): JSX.Element {
        return (
            <section>
            </section>
        );
    }
}
`;
    expect(data).toBe(expectedComponentText);
});

test("create component's types should have expected output", () => {
    componentCommand(rootComponentId, false, false);

    let data = getFileData(typesFilePath);

    let expectedComponentText = `\
import {Data, Props, State} from "react-flares";

export interface MyComponentProps extends Props{
}

export interface MyComponentState extends State {
}

export interface MyComponentData extends Data {
    props: MyComponentProps
    state: MyComponentState
}
`;
    expect(data).toBe(expectedComponentText);
});