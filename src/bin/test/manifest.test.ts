import {manifestCommand, projectCommand} from "../commands";
import {fileExists, getFileData} from "./setup";

const manifestFilePath = "/app/module.manifest.ts";

test("creates module manifest file with single module", () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);
    manifestCommand();

    expect(fileExists(manifestFilePath)).toBeTruthy();
});

test('created module.manifest.ts file should match output', () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);
    manifestCommand();


    let data = getFileData(manifestFilePath);

    // Lower case project name because npm requires it
    let expectedComponentText = `\
import * as ReactFlares from "react-flares";

let ModuleManifest: ReactFlares.ModuleDetails[] = [
    {
        name: "MyProject",
        hasStyles: true
    }
];

ReactFlares.setModuleManifest(ModuleManifest);
`;
    expect(data).toBe(expectedComponentText);
});
