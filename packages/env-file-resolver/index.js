const path = require("path");

exports = module.exports = class EnvFileResolverPlugin {
    apply(resolver) {
        resolver.plugin("before-file", function (request, callback) {
            let ext = path.extname(request.path);
            let base = path.basename(request.path, ext);
            let dir = path.dirname(request.path);
            let envPath = `${dir}/${base}.${process.env.NODE_ENV}${ext}`;
            let fs = resolver.fileSystem;

            fs.stat(envPath, function(err, stat) {
                if(!err && stat && stat.isFile()) {
                    let oldPath = request.path;
                    request.path = envPath;
                    resolver.doResolve("file", request, `Replacing ${oldPath} with ${envPath}`, callback, true);
                } else {
                    if(callback.missing) callback.missing.push(request.path);
                    if(callback.log) callback.log(request.path + " has no env file.");
                    return callback();
                }
            });
        });
    }
};