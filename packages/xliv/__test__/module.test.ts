import {moduleCommand} from "../src/commands";
import {fileExists, getFileData} from "./setup";

const moduleFilePath =      "/app/modules/MyModule/MyModule.module.ts";
const stylesFilePath =      "/app/modules/MyModule/MyModule.scss";
const componentFilePath =   "/app/modules/MyModule/MyModule.component.ts";
const viewFilePath =        "/app/modules/MyModule/MyModule.view.tsx";
const typesFilePath =       "/app/modules/MyModule/MyModule.types.ts";
const flareFilePath =       "/app/flares/MyModule/MyModule.flare.ts";

test("creates a module with styles and a component with it's component, view and types files", () => {
    moduleCommand("MyModule", false, false, false, false);

    expect(fileExists(moduleFilePath)).toBeTruthy();
    expect(fileExists(stylesFilePath)).toBeTruthy();
    expect(fileExists(componentFilePath)).toBeTruthy();
    expect(fileExists(viewFilePath)).toBeTruthy();
    expect(fileExists(typesFilePath)).toBeTruthy();
});

test("creates a module with styles and no component", () => {
    moduleCommand("MyModule", true, false, false, false);

    expect(fileExists(moduleFilePath)).toBeTruthy();
    expect(fileExists(stylesFilePath)).toBeTruthy();
    expect(fileExists(componentFilePath)).toBeFalsy();
    expect(fileExists(viewFilePath)).toBeFalsy();
    expect(fileExists(typesFilePath)).toBeFalsy();
});

test("creates a module with no component and no styles", () => {
    moduleCommand("MyModule", true, true, false, false);

    expect(fileExists(moduleFilePath)).toBeTruthy();
    expect(fileExists(stylesFilePath)).toBeFalsy();
    expect(fileExists(componentFilePath)).toBeFalsy();
    expect(fileExists(viewFilePath)).toBeFalsy();
    expect(fileExists(typesFilePath)).toBeFalsy();
});

test('created module with styles and component should have expected output', () => {
    moduleCommand("MyModule", false, false, false, false);

    let data = getFileData(moduleFilePath);

    let expectedComponentText = `\
import * as ReactFlares from "react-flares"
import {MyModule} from "./MyModule.component";

import "./MyModule.scss";

export class MyModuleModule implements ReactFlares.Module {
    private _components: {[name:string]: any};
    constructor() {
        this._components = {};
        this._components["MyModule"] = MyModule;
    }

    get components(): {[name:string]: any} {
        return this._components;
    }

    get name(): string {
        return "MyModule";
    }
}

ReactFlares.modules.MyModule = new MyModuleModule();
`;
    expect(data).toBe(expectedComponentText);
});

test('created component flare for root module component should have expected output', () => {
    moduleCommand("MyModule", false, false, false, false);

    let data = getFileData(flareFilePath);

    let expectedComponentText = `\
import * as ReactFlares from 'react-flares';
import {MyModuleProps} from "../../modules/MyModule/MyModule.types";

export class MyModuleFlare extends ReactFlares.ComponentFlare<ReactFlares.ComponentFlareProps & MyModuleProps> {
    get componentId(): string {return "MyModule:MyModule";}
}
`;
    expect(data).toBe(expectedComponentText);
});

test('created module with styles and no component should have expected output', () => {
    moduleCommand("MyModule", true, false, false, false);

    let data = getFileData(moduleFilePath);

    let expectedComponentText = `\
import * as ReactFlares from "react-flares"

import "./MyModule.scss";

export class MyModuleModule implements ReactFlares.Module {
    private _components: {[name:string]: any};
    constructor() {
        this._components = {};
    }

    get components(): {[name:string]: any} {
        return this._components;
    }

    get name(): string {
        return "MyModule";
    }
}

ReactFlares.modules.MyModule = new MyModuleModule();
`;
    expect(data).toBe(expectedComponentText);
});

test('created module with component and no styles should have expected output', () => {
    moduleCommand("MyModule", false, true, false, false);

    let data = getFileData(moduleFilePath);

    let expectedComponentText = `\
import * as ReactFlares from "react-flares"
import {MyModule} from "./MyModule.component";

export class MyModuleModule implements ReactFlares.Module {
    private _components: {[name:string]: any};
    constructor() {
        this._components = {};
        this._components["MyModule"] = MyModule;
    }

    get components(): {[name:string]: any} {
        return this._components;
    }

    get name(): string {
        return "MyModule";
    }
}

ReactFlares.modules.MyModule = new MyModuleModule();
`;
    expect(data).toBe(expectedComponentText);
});

test('created module with no component and no styles should have expected output', () => {
    moduleCommand("MyModule", true, true, false, false);

    let data = getFileData(moduleFilePath);

    let expectedComponentText = `\
import * as ReactFlares from "react-flares"

export class MyModuleModule implements ReactFlares.Module {
    private _components: {[name:string]: any};
    constructor() {
        this._components = {};
    }

    get components(): {[name:string]: any} {
        return this._components;
    }

    get name(): string {
        return "MyModule";
    }
}

ReactFlares.modules.MyModule = new MyModuleModule();
`;
    expect(data).toBe(expectedComponentText);
});