import * as fs from "fs-extra";

let originalCwd = process.cwd();
let workingDir = originalCwd + "/tmp/react-flares/test";

export function fileExists(path: string): boolean {
    return fs.existsSync(process.cwd() + path);
}

export function getFileData(path: string): string {
    return fs.readFileSync(process.cwd() + path, "utf-8");
}

beforeEach(() => {
    fs.mkdirsSync(workingDir);
    process.chdir(workingDir);
});

afterEach(() => {
    process.chdir(originalCwd);
    fs.removeSync(workingDir);
});