import {componentCommand} from "../commands";
import * as fs from "fs-extra";

function fileExists(path: string): boolean {
    return fs.existsSync(process.cwd() + path);
}

afterEach(() => {
    fs.remove(process.cwd() + "/app");
});

test('creates a component with component, view and types files', () => {
    componentCommand("MyComponent", false, false);

    expect(fileExists("/app/modules/MyComponent.component.ts")).toBeTruthy();
    expect(fileExists("/app/modules/MyComponent.view.tsx")).toBeTruthy();
    expect(fileExists("/app/modules/MyComponent.types.ts")).toBeTruthy();
});