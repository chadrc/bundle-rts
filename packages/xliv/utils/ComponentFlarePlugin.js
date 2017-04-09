
exports = module.exports = class FlareComponentResolverPlugin {
    apply(compiler) {
        let componentRegex = /.(module|component)(.tsx?)?$/;
        let relativeImportRegex = /\.\.?\//;
        let resolve = (result, fs, cb) => {
            try {
                // Not a request for a component/module
                // And issued by a file that user created
                // Or is a relative import
                if (!componentRegex.test(result.request)
                    || !result.contextInfo.issuer || result.contextInfo.issuer === "") {
                    cb(result.request);
                    return;
                }
                if (relativeImportRegex.test(result.request)) {
                    cb(result.request);
                    return;
                }

                let pathParts = result.request.split(path.sep);

                // Can't do anything with path
                if (pathParts.length < 2) {
                    cb(result.request);
                    return;
                }

                let modIndex = pathParts.indexOf("modules") + 1;
                if (modIndex === -1 || modIndex >= pathParts.length) {
                    cb(result.request);
                    return;
                }

                let moduleName = pathParts[modIndex];

                // minus 2 to target the folder
                let compIndex = pathParts.length - 2;
                let componentName = pathParts[compIndex];

                let modComp = componentName === moduleName;

                let componentPath = pathParts.slice(modIndex+1, pathParts.length-1).join(path.sep);

                let newRequest = `gen/flares/${componentName}.flare.ts`;
                fs.mkdirp("app/gen/flares", () => {
                    fs.writeFile(`app/gen/flares/${componentName}.flare.ts`,
                        makeComponentFlareFile(componentName, componentPath, moduleName, false, modComp),
                        {},
                        () => {
                            cb(newRequest);
                        });
                });
            } catch (e) {
                console.error(e);
                cb(result.request, e);
            }
        };

        compiler.plugin("normal-module-factory", (nmf) => {
            nmf.plugin("before-resolve", (result, callback) => {
                if (!result) return callback();
                resolve(result, compiler.outputFileSystem, (newRequest, e) => {
                    result.request = newRequest;
                    callback(e, result);
                });
            });
        });

        compiler.plugin("context-module-factory", (cmf) => {
            cmf.plugin("before-resolve", (result, callback) => {
                if (!result) return callback();
                resolve(result, compiler.outputFileSystem, (newRequest, e) => {
                    result.request = newRequest;
                    callback(e, result);
                });
            });
        });
    }
};