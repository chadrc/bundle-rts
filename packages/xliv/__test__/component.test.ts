
import {componentCommand} from "../src/commands";
import {getFileData} from "./setup";

const componentName = "MyComponent";
const moduleName = "MyModule";
const subComponentName = "MySubComponent";

const rootComponentId = `~:${componentName}`;
const moduleComponentId = `${moduleName}:${componentName}`;
const subComponentId = `~:${componentName}/${subComponentName}`;
const moduleSubComponentId = `${moduleName}:${componentName}/${subComponentName}`;

const componentFile = `${componentName}.component.ts`;
const viewFile = `${componentName}.view.tsx`;
const typesFile = `${componentName}.types.ts`;
const stylesFile = `${componentName}.scss`;

const componentFilePath =           `/app/components/${componentName}/${componentFile}`;
const noViewComponentFilePath =     componentFilePath + "x";
const viewFilePath =                `/app/components/${componentName}/${viewFile}`;
const typesFilePath =               `/app/components/${componentName}/${typesFile}`;
const stylesFilePath =              `/app/components/${componentName}/${stylesFile}`;

const moduleComponentFilePath =     `/app/modules/${moduleName}/${componentName}/${componentFile}`;
const moduleViewFilePath =          `/app/modules/${moduleName}/${componentName}/${viewFile}`;
const moduleTypesFilePath =         `/app/modules/${moduleName}/${componentName}/${typesFile}`;
const moduleStylesFilePath =        `/app/modules/${moduleName}/${componentName}/${stylesFile}`;

const subComponentFilePath =        `/app/components/${componentName}/${subComponentName}/${subComponentName}.component.ts`;
const subViewFilePath =             `/app/components/${componentName}/${subComponentName}/${subComponentName}.view.tsx`;
const subTypesFilePath =            `/app/components/${componentName}/${subComponentName}/${subComponentName}.types.ts`;
const subStylesFilePath =           `/app/components/${componentName}/${subComponentName}/${subComponentName}.scss`;

const moduleSubComponentFilePath =  `/app/modules/${moduleName}/${componentName}/${subComponentName}/${subComponentName}.component.ts`;
const moduleSubViewFilePath =       `/app/modules/${moduleName}/${componentName}/${subComponentName}/${subComponentName}.view.tsx`;
const moduleSubTypesFilePath =      `/app/modules/${moduleName}/${componentName}/${subComponentName}/${subComponentName}.types.ts`;
const moduleSubStylesFilePath =     `/app/modules/${moduleName}/${componentName}/${subComponentName}/${subComponentName}.scss`;


test('creates a component with component, view and types files', () => {
    componentCommand(rootComponentId, false, false, false);

    expect(getFileData(componentFilePath)).toBeTruthy();
    expect(getFileData(viewFilePath)).toBeTruthy();
    expect(getFileData(typesFilePath)).toBeTruthy();
    expect(getFileData(stylesFilePath)).toBeTruthy();
});

test("component id without module and component parts should fail", () => {
    expect(() => componentCommand("MyComponent", false, false, false)).toThrow();
});

test("component id with bad path should fail", () => {
    expect(() => componentCommand("MyModule:/", false, false, false)).toThrow();
});

test('creates a component with component and view files', () => {
    componentCommand(rootComponentId, false, true, false);

    expect(getFileData(componentFilePath)).toBeTruthy();
    expect(getFileData(viewFilePath)).toBeTruthy();
    expect(() => getFileData(typesFilePath)).toThrow();
});

test('creates a component with component and types files', () => {
    componentCommand(rootComponentId, true, false, false);

    expect(getFileData(noViewComponentFilePath)).toBeTruthy();
    expect(() => getFileData(viewFilePath)).toThrow();
    expect(getFileData(typesFilePath)).toBeTruthy();
    expect(getFileData(stylesFilePath)).toBeTruthy();
});

test('creates a component with component file only', () => {
    componentCommand(rootComponentId, true, true, true);

    expect(getFileData(noViewComponentFilePath)).toBeTruthy();
    expect(() => getFileData(viewFilePath)).toThrow();
    expect(() => getFileData(typesFilePath)).toThrow();
    expect(() => getFileData(stylesFilePath)).toThrow();
});

test('creates a module component without flare', () => {
    componentCommand(moduleComponentId, false, false, false);

    expect(getFileData(moduleComponentFilePath)).toBeTruthy();
    expect(getFileData(moduleViewFilePath)).toBeTruthy();
    expect(getFileData(moduleTypesFilePath)).toBeTruthy();
    expect(getFileData(moduleStylesFilePath)).toBeTruthy();
});

test('creates a module component with flare', () => {
    componentCommand(moduleComponentId, false, false, false, true);

    expect(getFileData(moduleComponentFilePath)).toBeTruthy();
    expect(getFileData(moduleViewFilePath)).toBeTruthy();
    expect(getFileData(moduleTypesFilePath)).toBeTruthy();
    expect(getFileData(moduleStylesFilePath)).toBeTruthy();
});

test('creates sub component', () => {
    componentCommand(subComponentId, false, false, false);

    expect(getFileData(subComponentFilePath)).toBeTruthy();
    expect(getFileData(subViewFilePath)).toBeTruthy();
    expect(getFileData(subTypesFilePath)).toBeTruthy();
    expect(getFileData(subStylesFilePath)).toBeTruthy();
});

test('creates module sub component with flare', () => {
    componentCommand(moduleSubComponentId, false, false, false, true);

    expect(getFileData(moduleSubComponentFilePath)).toBeTruthy();
    expect(getFileData(moduleSubViewFilePath)).toBeTruthy();
    expect(getFileData(moduleSubTypesFilePath)).toBeTruthy();
    expect(getFileData(moduleSubStylesFilePath)).toBeTruthy();
});

test('created component with view and types should have expected output', () => {
    componentCommand(rootComponentId, false, false, false);
    
    let data = getFileData(componentFilePath);

    let expectedComponentText = `\
import * as React from "react";
import {MyComponentData, MyComponentProps, MyComponentState} from "./MyComponent.types";
import MyComponentView from "./MyComponent.view";

import "./MyComponent.scss";

export default class MyComponent extends React.Component<MyComponentProps, MyComponentState> implements MyComponentData {

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

test('fail to create same component twice', () => {
    componentCommand(rootComponentId, false, false, false);
    expect(() => componentCommand(rootComponentId, false, false, false)).toThrow();
});

test('created component with view, types and flare should have expected output', () => {
    componentCommand(rootComponentId, false, false, false, true);

    let data = getFileData(componentFilePath);

    let expectedComponentText = `\
import * as React from "react";
import * as ReactFlares from "react-flares";
import {MyComponentData, MyComponentProps, MyComponentState} from "./MyComponent.types";
import MyComponentView from "./MyComponent.view";

import "./MyComponent.scss";

export default class MyComponent extends React.Component<MyComponentProps, MyComponentState> implements MyComponentData {

    constructor(props: MyComponentProps) {
        super(props);
        this.state = {
        }
    }

    render() {
        return new MyComponentView().make(this);
    }
}

ReactFlares.registerComponent("MyComponent", MyComponent);
`;
    expect(data).toBe(expectedComponentText);
});

test('created component with view and without types should have expected output', () => {
    componentCommand(rootComponentId, false, true, false);

    let data = getFileData(componentFilePath);

    let expectedComponentText = `\
import * as React from "react";
import {Data, Props, State} from "react-flares";
import MyComponentView from "./MyComponent.view";

import "./MyComponent.scss";

export default class MyComponent extends React.Component<Props, State> implements Data {

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
    componentCommand(rootComponentId, true, false, false);

    let data = getFileData(noViewComponentFilePath);

    let expectedComponentText = `\
import * as React from "react";
import {MyComponentData, MyComponentProps, MyComponentState} from "./MyComponent.types";

import "./MyComponent.scss";

export default class MyComponent extends React.Component<MyComponentProps, MyComponentState> implements MyComponentData {

    constructor(props: MyComponentProps) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <section>
                {this.props.children}
            </section>
        );
    }
}
`;
    expect(data).toBe(expectedComponentText);
});

test("created component without view and without types should have expected output", () => {
    componentCommand(rootComponentId, true, true, false, false);

    let data = getFileData(noViewComponentFilePath);

    let expectedComponentText = `\
import * as React from "react";
import {Data, Props, State} from "react-flares";

import "./MyComponent.scss";

export default class MyComponent extends React.Component<Props, State> implements Data {

    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <section>
                {this.props.children}
            </section>
        );
    }
}
`;
    expect(data).toBe(expectedComponentText);
});

test("created component without view, types, nor styles should have expected output", () => {
    componentCommand(rootComponentId, true, true, true, false);

    let data = getFileData(noViewComponentFilePath);

    let expectedComponentText = `\
import * as React from "react";
import {Data, Props, State} from "react-flares";

export default class MyComponent extends React.Component<Props, State> implements Data {

    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <section>
                {this.props.children}
            </section>
        );
    }
}
`;
    expect(data).toBe(expectedComponentText);
});

test("created component's view with types should have expected output", () => {
    componentCommand(rootComponentId, false, false, false, true);

    let data = getFileData(viewFilePath);

    let expectedComponentText = `\
import * as React from "react";
import {View} from "react-flares";
import {MyComponentData} from "./MyComponent.types";

export default class MyComponentView implements View {
    make(component: MyComponentData): JSX.Element {
        return (
            <section>
                {component.props.children}
            </section>
        );
    }
}
`;
    expect(data).toBe(expectedComponentText);
});

test("created component's view without types should have expected output", () => {
    componentCommand(rootComponentId, false, true, false, true);

    let data = getFileData(viewFilePath);

    let expectedComponentText = `\
import * as React from "react";
import {Data, View} from "react-flares";

export default class MyComponentView implements View {
    make(component: Data): JSX.Element {
        return (
            <section>
                {component.props.children}
            </section>
        );
    }
}
`;
    expect(data).toBe(expectedComponentText);
});

test("create component's types should have expected output", () => {
    componentCommand(rootComponentId, false, false, false);

    let data = getFileData(typesFilePath);

    let expectedComponentText = `\
import {Data, Props, State} from "react-flares";

export interface MyComponentProps extends Props {
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