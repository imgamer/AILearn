//# sourceMappingURL=micro_python_util.js.map
var process = process || {
    env: {
        NODE_ENV: "development"
    }
};
class MicroPythonUtil {
    constructor() {}
    static resolveCommandOutput(c, a) {
        const d = a.findIndex(b => 0 < b.indexOf(c));
        a = a.slice(d + 1).filter(b => ">>>" !== b.trim());
        console.log(a);
        return a.join("")
    } 
}
;