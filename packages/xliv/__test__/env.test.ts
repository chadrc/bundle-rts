import {envCommand} from "../src/commands";
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

test('created package.json file should match output', () => {
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

test('created package.json file should match output', () => {
    envCommand();

    let data = getFileData(typingsFile);

    // Lower case project name because npm requires it
    let expectedComponentText = `\
/* Generated File for Typescript compilation */

declare const BUILD_ENV: string;
`;
    expect(data).toBe(expectedComponentText);
});