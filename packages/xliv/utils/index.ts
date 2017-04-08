import * as fs from "fs";
import * as glob from "glob";

export function getTsConfig(baseDir: string) {
    let tsConfigPath = baseDir + "/tsconfig.json";
    try {
        let localConfigPath = process.cwd() + "/tsconfig.json";
        fs.readFileSync(localConfigPath);
        tsConfigPath = localConfigPath
    } catch (e) {}
    return tsConfigPath
}

export function addModuleEntries(baseEntries: {[name: string]: string | string[]}) {
    let locations = glob.sync("./app/modules/*/*.module.ts");
    for (let g of locations) {
        let name = g.replace("./app/modules/", "").replace(".module.tsx", "").split("/")[0];
        process.stdout.write("module: " + name + " @ " + g);
        baseEntries[name] = g.replace("./app", "./");
    }
    return baseEntries;
}
