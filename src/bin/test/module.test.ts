import {moduleCommand} from "../commands";
import * as fs from "fs-extra";

let workingDir = process.cwd() + "/tmp/rts-seed-tests/";
fs.mkdirsSync(workingDir);
process.chdir(workingDir);

function fileExists(path: string): boolean {
    return fs.existsSync(process.cwd() + path);
}

function getFileData(path: string): string {
    return fs.readFileSync(process.cwd() + path, "utf-8");
}

const moduleFilePath = "/app/modules/MyModule/MyModule.module.ts";
const stylesFilePath = "/app/modules/MyModule/MyModule.scss";
const componentFilePath = "/app/modules/MyModule/MyModule.component.ts";
const viewFilePath = "/app/modules/MyModule/MyModule.view.tsx";
const typesFilePath = "/app/modules/MyModule/MyModule.types.ts";

afterEach(() => {
    fs.removeSync(process.cwd() + "/app");
});

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
import {Module} from "rts-fw"
import {MyModule} from "./MyModule.component";

import "./MyModule.scss";

export class MyModuleModule implements Module {
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

(<any>window).MyModule = new MyModuleModule();
`;
    expect(data).toBe(expectedComponentText);
});

test('created module with styles and no component should have expected output', () => {
    moduleCommand("MyModule", true, false, false, false);

    let data = getFileData(moduleFilePath);

    let expectedComponentText = `\
import {Module} from "rts-fw"

import "./MyModule.scss";

export class MyModuleModule implements Module {
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

(<any>window).MyModule = new MyModuleModule();
`;
    expect(data).toBe(expectedComponentText);
});

test('created module with component and no styles should have expected output', () => {
    moduleCommand("MyModule", false, true, false, false);

    let data = getFileData(moduleFilePath);

    let expectedComponentText = `\
import {Module} from "rts-fw"
import {MyModule} from "./MyModule.component";

export class MyModuleModule implements Module {
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

(<any>window).MyModule = new MyModuleModule();
`;
    expect(data).toBe(expectedComponentText);
});