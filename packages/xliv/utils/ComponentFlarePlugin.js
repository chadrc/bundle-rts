
exports = module.exports = class ComponentFlarePlugin {
    apply(compiler) {
        let componentRegex = /.(module|component)(.tsx?)?$/;
        let relativeImportRegex = /\.\.?\//;
        let resolve = (result) => {
            // Not a request for a component/module
            // And issued by a file that user created
            // Or is a relative import
            if (!componentRegex.test(result.request)
                || !result.contextInfo.issuer || result.contextInfo.issuer === "") {
                return result.request;
            }
            console.log("before resolve: " + JSON.stringify({ issuer: result.issuer, request: result.request, context: result.context}, null, 2));
            if (relativeImportRegex.test(result.request)) {
                console.log("relative - ignoring");
                return result.request;
            }
            return result.request.replace(/^modules/, "flares").replace(/(module|component)$/, "flare");
        };

        compiler.plugin("normal-module-factory", (nmf) => {
            nmf.plugin("before-resolve", (result, callback) => {
                if (!result) return callback();
                result.request = resolve(result);
                return callback(null, result);
            })
        });

        compiler.plugin("context-module-factory", (cmf) => {
            cmf.plugin("before-resolve", (result, callback) => {
                if (!result) return callback();
                result.request = resolve(result);
                return callback(null, result);
            })
        });
    }
};