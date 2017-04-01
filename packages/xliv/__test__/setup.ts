import * as fse from "fs-extra";
const fs = require("fs");
const path = require("path");

let originalCwd = process.cwd();

export function getFileData(path: string): string {
    return fse.readFileSync(process.cwd() + path, "utf-8").replace("\r\n", "\n");
}

beforeEach(() => {
    let workingDir = originalCwd + "/tmp/xliv/test-";
    fse.mkdirsSync("tmp/xliv/");
    let tmpDir = fse.mkdtempSync(workingDir);
    process.chdir(tmpDir);
});

afterEach(() => {
    process.chdir(originalCwd);
});