"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeOrExcludeObject = exports.notIncludedSymbol = void 0;
exports.notIncludedSymbol = Symbol('notIncluded');
async function includeOrExcludeObject(ocv, paths, currentPath = [], include) {
    if (Array.isArray(ocv)) {
        return (await Promise.all(ocv.map(async (v, i) => await includeOrExcludeObject(v, paths, [...currentPath, i.toString()], include)))).filter((e) => e !== exports.notIncludedSymbol);
    }
    if (typeof ocv === 'object') {
        return Object.fromEntries((await Promise.all(Object.entries(ocv).map(async ([key, value]) => [
            key,
            await includeOrExcludeObject(value, paths, [...currentPath, key], include),
        ]))).filter((e) => e[1] !== exports.notIncludedSymbol));
    }
    const isIncluded = paths.includes(currentPath.join('.'));
    return include
        ? isIncluded // include mode, path is in list
            ? ocv
            : exports.notIncludedSymbol
        : isIncluded // exclude mode, path is in list
            ? exports.notIncludedSymbol
            : ocv;
}
exports.includeOrExcludeObject = includeOrExcludeObject;
async function objectContainedLogged(ocv, options) {
    if (options && typeof ocv === 'object') {
        if (options.include && options.include.length > 0) {
            return JSON.stringify(await includeOrExcludeObject(ocv, options.include, [], true));
        }
        if (options.exclude && options.exclude.length > 0) {
            return JSON.stringify(await includeOrExcludeObject(ocv, options.exclude, [], false));
        }
    }
    if (typeof ocv === 'object') {
        return JSON.stringify(ocv);
    }
    else {
        return `${ocv}`;
    }
}
exports.default = objectContainedLogged;
//# sourceMappingURL=functions.js.map