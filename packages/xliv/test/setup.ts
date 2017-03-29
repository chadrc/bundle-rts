import * as fse from "fs-extra";

let originalCwd = process.cwd();

export function fileExists(path: string): boolean {
    return fse.existsSync(process.cwd() + path);
}

export function getFileData(path: string): string {
    return fse.readFileSync(process.cwd() + path, "utf-8");
}

beforeEach(() => {
    let workingDir = originalCwd + "/tmp/react-flares/test-";
    fse.mkdirsSync("tmp/react-flares/");
    let tmpDir = fse.mkdtempSync(workingDir);
    process.chdir(tmpDir);
});

afterEach(() => {
    process.chdir(originalCwd);
});