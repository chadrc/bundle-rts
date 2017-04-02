import {envCommand, exposeCommand} from "../src/commands";
import {getFileData} from "./setup";

let baseEnvFile = "/environments/base.js";
let developmentEnvFile = "/environments/development.js";
let typingsFile = "/environments/typings.d.ts";

test("env command with no args should create base.js and generate typings.d.ts", () => {
    envCommand();

    expect(getFileData(baseEnvFile)).toBeTruthy();
    expect(getFileData(typingsFile)).toBeTruthy();
});

test("create env file for development", () => {
    envCommand("development");

    expect(getFileData(developmentEnvFile)).toBeTruthy();
    expect(getFileData(typingsFile)).toBeTruthy();
});

test('created env config should match', () => {
    envCommand();

    let data = getFileData(baseEnvFile);

    // Lower case project name because npm requires it
    let expectedComponentText = `\
module.exports = {
    defines: {
        
    }
};  
`;
    expect(data).toBe(expectedComponentText);
});

test('created env typings should match', () => {
    envCommand();

    let data = getFileData(typingsFile);

    // Lower case project name because npm requires it
    let expectedComponentText = `\
/* Generated File for Typescript compilation */

declare const BUILD_ENV: string;

`;
    expect(data).toBe(expectedComponentText);
});

test('create env config with initial values should match output', () => {
    envCommand("development", {
        VERSION: "1.0.0",
    });

    let data = getFileData(developmentEnvFile);

    // Lower case project name because npm requires it
    let expectedComponentText = `\
module.exports = {
    defines: {
        VERSION: "1.0.0"
    }
};  
`;
    expect(data).toBe(expectedComponentText);
});

test('create env typings with initial values should match output', () => {
    // Expose tsconfig.json because jest is looking for it when using require()
    exposeCommand(true);

    envCommand("development", {
        VERSION: "1.0.0",
    });

    let data = getFileData(typingsFile);

    // Lower case project name because npm requires it
    let expectedComponentText = `\
/* Generated File for Typescript compilation */

declare const BUILD_ENV: string;
declare const VERSION: string;
`;
    expect(data).toBe(expectedComponentText);
});