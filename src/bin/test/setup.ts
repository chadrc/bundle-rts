import * as fs from "fs";

let originalCwd = process.cwd();
let workingDir = originalCwd + "/tmp/react-flares/test";

export function fileExists(path: string): boolean {
    return fs.existsSync(process.cwd() + path);
}

export function getFileData(path: string): string {
    return fs.readFileSync(process.cwd() + path, "utf-8");
}

function checkMakeDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

function ensureDir(dir) {
    let subs = dir.split("/");
    if (subs.length === 1) {
        checkMakeDir(process.cwd() + "/" + subs[0]);
    } else {
        let current = process.cwd() + "/" + subs[0];
        for (let i=1; i<subs.length; i++) {
            checkMakeDir(current);
            current += "/" + subs[i];
        }
    }
}

function emptyDir(dir) {
    let children = fs.readdirSync(dir);
    for (let child of children) {
        let childPath = dir + "/" + child;
        let info = fs.statSync(childPath);
        if (info.isDirectory()) {
            emptyDir(childPath);
            fs.rmdirSync(childPath);
        } else {
            fs.unlinkSync(childPath);
        }
    }
}

function deleteDir(dir) {
    emptyDir(dir);
    fs.rmdirSync(dir);
}

beforeEach(() => {
    ensureDir("/tmp/react-flares/test/");
    process.chdir(workingDir);
});

afterEach(() => {
    process.chdir(originalCwd);
    deleteDir(workingDir);
});