import {componentCommand} from "../commands";
import * as fs from "fs-extra";

let workingDir = process.cwd() + "/tmp/rts-seed-tests/";
fs.mkdirsSync(workingDir);
process.chdir(workingDir);

function fileExists(path: string): boolean {
    return fs.existsSync(process.cwd() + path);
}

afterEach(() => {
    fs.removeSync(process.cwd() + "/app");
});

test('creates a component with component, view and types files', () => {
    componentCommand("MyComponent", false, false);

    expect(fileExists("/app/modules/MyComponent.component.ts")).toBeTruthy();
    expect(fileExists("/app/modules/MyComponent.view.tsx")).toBeTruthy();
    expect(fileExists("/app/modules/MyComponent.types.ts")).toBeTruthy();
});

test('created component with view and types should have expected contents', () => {
    componentCommand("MyComponent", false, false);
    
    let data = fs.readFileSync(process.cwd() + "/app/modules/MyComponent.component.ts", "utf-8");

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

test('created view and without types should have expected content', () => {
    componentCommand("MyComponent", false, false);

    let data = fs.readFileSync(process.cwd() + "/app/modules/MyComponent.view.tsx", "utf-8");

    let expectedComponentText = `\
import * as React from "react";
import {View} from "rts-fw";
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
