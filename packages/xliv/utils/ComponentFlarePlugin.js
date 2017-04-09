
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
                let moduleName = "";
                let pathParts =result.request.split(path.sep);
                let modIndex = pathParts.indexOf("modules") + 1;
                if (modIndex !== -1 && modIndex < pathParts.length) {
                    moduleName = pathParts[modIndex];
                }

                let noComp = result.request.replace(/\.(module|component)/, "");
                let componentName = path.basename(noComp, path.extname(noComp));

                let newRequest = `gen/flares/${componentName}.flare.ts`;
                fs.mkdirp("app/gen/flares", () => {
                    fs.writeFile(`app/gen/flares/${componentName}.flare.ts`,
                        makeComponentFlareFile(componentName, moduleName, false, false),
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