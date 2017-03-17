import * as fs from "fs-extra";

let workingDir = process.cwd() + "/tmp/rts-seed-tests/";
fs.mkdirsSync(workingDir);
process.chdir(workingDir);

export function fileExists(path: string): boolean {
    return fs.existsSync(process.cwd() + path);
}

export function getFileData(path: string): string {
    return fs.readFileSync(process.cwd() + path, "utf-8");
}

afterEach(() => {
    fs.removeSync(process.cwd() + "/app");
});