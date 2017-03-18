import {componentCommand} from "../commands";
import {fileExists, getFileData} from "./setup";

const componentFilePath =   "/app/modules/MyComponent.component.ts";
const viewFilePath =        "/app/modules/MyComponent.view.tsx";
const typesFilePath =       "/app/modules/MyComponent.types.ts";

test('creates a component with component, view and types files', () => {
    componentCommand("MyComponent", false, false);

    expect(fileExists(componentFilePath)).toBeTruthy();
    expect(fileExists(viewFilePath)).toBeTruthy();
    expect(fileExists(typesFilePath)).toBeTruthy();
});

test('creates a component with component and view files', () => {
    componentCommand("MyComponent", false, true);

    expect(fileExists(componentFilePath)).toBeTruthy();
    expect(fileExists(viewFilePath)).toBeTruthy();
    expect(fileExists(typesFilePath)).toBeFalsy();
});

test('creates a component with component and types files', () => {
    componentCommand("MyComponent", true, false);

    expect(fileExists(componentFilePath)).toBeTruthy();
    expect(fileExists(viewFilePath)).toBeFalsy();
    expect(fileExists(typesFilePath)).toBeTruthy();
});

test('creates a component with component file only', () => {
    componentCommand("MyComponent", true, true);

    expect(fileExists(componentFilePath)).toBeTruthy();
    expect(fileExists(viewFilePath)).toBeFalsy();
    expect(fileExists(typesFilePath)).toBeFalsy();
});

test('created component with view and types should have expected output', () => {
    componentCommand("MyComponent", false, false);
    
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

test('created component with view and without types should have expected output', () => {
    componentCommand("MyComponent", false, true);

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
    componentCommand("MyComponent", true, false);

    let data = getFileData(componentFilePath);

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
    componentCommand("MyComponent", true, true);

    let data = getFileData(componentFilePath);

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
    componentCommand("MyComponent", false, false);

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
    componentCommand("MyComponent", false, true);

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
    componentCommand("MyComponent", false, false);

    let data = getFileData(typesFilePath);

    let expectedComponentText = `\
import {Data, Props, State} from "react-flares";

export interface MyComponentProps extends Props{
}

export interface MyComponentState extends State {
}

export interface MyComponentData extends Data {
}
`;
    expect(data).toBe(expectedComponentText);
});