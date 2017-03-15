import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";
import {Arguments} from "./Arguments";
import {ensureDir, writeFile} from "./Utils";
import {makeModuleManifestFile} from "./templates";

export function ManifestCommand(args: Arguments): void {
    let pattern = process.cwd() + "/app/modules/**/*.module.ts";
    let moduleFiles = glob.sync(pattern);
    let details = [];
    for (let m of moduleFiles) {
        let name = path.basename(m).replace(".module.ts", "");
        let stylePath = path.dirname(m) + "/styles.scss";
        let hasStyles = fs.existsSync(stylePath);
        details.push({
            name: name,
            hasStyles: hasStyles
        });
    }
    let text = makeModuleManifestFile(details);
    let dir = "/app/";
    ensureDir(dir);
    let basePath = process.cwd() + dir;
    writeFile(`${basePath}module.manifest.ts`, text);
}