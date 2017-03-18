import * as fse from "fs-extra";

let originalCwd = process.cwd();
let workingDir = originalCwd + "/tmp/react-flares/test";

export function fileExists(path: string): boolean {
    return fse.existsSync(process.cwd() + path);
}

export function getFileData(path: string): string {
    return fse.readFileSync(process.cwd() + path, "utf-8");
}

beforeEach(() => {
    fse.mkdirsSync(workingDir);
    process.chdir(workingDir);
});

afterEach(() => {
    process.chdir(originalCwd);
    fse.removeSync(workingDir);
});