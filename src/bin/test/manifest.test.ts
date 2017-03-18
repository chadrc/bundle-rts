import {manifestCommand, projectCommand} from "../commands";
import {fileExists, getFileData} from "./setup";

const manifestFilePath = "/app/module.manifest.ts";

test("creates project with all default files", () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);
    manifestCommand();

    expect(fileExists(manifestFilePath)).toBeTruthy();
});