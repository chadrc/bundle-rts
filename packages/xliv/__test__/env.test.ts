import {envCommand} from "../src/commands";
import {getFileData} from "./setup";

let baseEnvFile = "/app/env/base.env.ts";
let developmentEnvFile = "/app/env/development.env.ts";

test("env command with no args should create base.js and generate typings.d.ts", () => {
    envCommand("base", "My App");

    expect(getFileData(baseEnvFile)).toBeTruthy();
});

test("create env file for development", () => {
    envCommand("development", "My App");

    expect(getFileData(developmentEnvFile)).toBeTruthy();
});

test("duplicate env creation should fail", () => {
    envCommand("development", "My App");

    expect(() => envCommand("development", "My App")).toThrow();
});

test('created env config should match', () => {
    envCommand("base", "My App");

    let data = getFileData(baseEnvFile);

    // Lower case project name because npm requires it
    let expectedComponentText = `\
export const APP_NAME: string = "My App";
`;
    expect(data).toBe(expectedComponentText);
});

test('create env config with initial values should match output', () => {
    envCommand("development", "My App", {
        VERSION: "1.0.0",
    });

    let data = getFileData(developmentEnvFile);

    // Lower case project name because npm requires it
    let expectedComponentText = `\
export * from "./base.env";

export const VERSION: string = "1.0.0";
`;
    expect(data).toBe(expectedComponentText);
});