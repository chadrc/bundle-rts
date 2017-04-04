import {moduleCommand} from "../src/commands";
import {getFileData} from "./setup";

const moduleFilePath =      "/app/modules/MyModule/MyModule.module.ts";
const stylesFilePath =      "/app/modules/MyModule/MyModule.scss";
const componentFilePath =   "/app/modules/MyModule/MyModule.component.ts";
const viewFilePath =        "/app/modules/MyModule/MyModule.view.tsx";
const typesFilePath =       "/app/modules/MyModule/MyModule.types.ts";
const flareFilePath =       "/app/flares/MyModule/MyModule.flare.ts";

test("creates a module with styles and a component with it's component, view and types files", () => {
    moduleCommand("MyModule", false, false, false);

    expect(getFileData(moduleFilePath)).toBeTruthy();
    expect(getFileData(stylesFilePath)).toBeTruthy();
    expect(() => getFileData(componentFilePath)).toThrow();
    expect(getFileData(viewFilePath)).toBeTruthy();
    expect(getFileData(typesFilePath)).toBeTruthy();
});

test("creates a module with  no styles", () => {
    moduleCommand("MyModule", true, false, false);

    expect(getFileData(moduleFilePath)).toBeTruthy();
    expect(() => getFileData(stylesFilePath)).toThrow();
});

test('created module with styles and component should have expected output', () => {
    moduleCommand("MyModule", false, false, false);

    let data = getFileData(moduleFilePath);

    let expectedComponentText = `\
import * as React from "react";
import * as ReactFlares from "react-flares";
import {MyModuleData, MyModuleProps, MyModuleState} from "./MyModule.types";
import MyModuleView from "./MyModule.view";

import "./MyModule.scss";

export default class MyModule extends React.Component<MyModuleProps, MyModuleState> implements MyModuleData {

    constructor(props: MyModuleProps) {
        super(props);
        this.state = {
        }
    }

    render() {
        return new MyModuleView().make(this);
    }
}

ReactFlares.registerComponent("MyModule", MyModule);
`;
    expect(data).toBe(expectedComponentText);
});

test('created component flare for root module component should have expected output', () => {
    moduleCommand("MyModule", false, false, false);

    let data = getFileData(flareFilePath);

    let expectedComponentText = `\
import * as ReactFlares from 'react-flares';
import {MyModuleProps} from "modules/MyModule/MyModule.types";

export default class MyModuleFlare extends ReactFlares.ComponentFlare<ReactFlares.ComponentFlareProps & MyModuleProps> {
    get componentId(): string {return "MyModule:MyModule";}
}
`;
    expect(data).toBe(expectedComponentText);
});

test('created module with component and no styles should have expected output', () => {
    moduleCommand("MyModule", true, false, false);

    let data = getFileData(moduleFilePath);

    let expectedComponentText = `\
import * as React from "react";
import * as ReactFlares from "react-flares";
import {MyModuleData, MyModuleProps, MyModuleState} from "./MyModule.types";
import MyModuleView from "./MyModule.view";

export default class MyModule extends React.Component<MyModuleProps, MyModuleState> implements MyModuleData {

    constructor(props: MyModuleProps) {
        super(props);
        this.state = {
        }
    }

    render() {
        return new MyModuleView().make(this);
    }
}

ReactFlares.registerComponent("MyModule", MyModule);
`;
    expect(data).toBe(expectedComponentText);
});