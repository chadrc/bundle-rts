import {manifestCommand, projectCommand} from "../commands";
import {fileExists, getFileData} from "./setup";

const manifestFilePath = "/app/module.manifest.ts";

test("creates project with all default files", () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);
    manifestCommand();

    expect(fileExists(manifestFilePath)).toBeTruthy();
});

test('created package.json file should match output', () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);
    manifestCommand();


    let data = getFileData(manifestFilePath);

    // Lower case project name because npm requires it
    let expectedComponentText = `\
import {ModuleDetails} from "rts-fw";

let ModuleManifest: ModuleDetails[] = [
    {
        name: "MyProject",
        hasStyles: true
    }
];

export default ModuleManifest;  
`;
    expect(data).toBe(expectedComponentText);
});
