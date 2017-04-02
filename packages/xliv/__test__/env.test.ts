import {envCommand} from "../src/commands";
import {getFileData} from "./setup";

test("init command should create base.js and generate typings.d.ts", () => {
    envCommand();

    expect(getFileData("/environments/base.js")).toBeTruthy();
    expect(getFileData("/environments/typings.d.ts")).toBeTruthy();
});