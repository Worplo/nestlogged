export const notIncludedSymbol = Symbol("notIncluded");

export function includeOrExcludeObjectSync(
  ocv: any,
  paths: string[],
  currentPath: string[] = [],
  include: boolean // or exclude
) {
  if (Array.isArray(ocv)) {
    return (
      ocv.map(
        (v, i) =>
          includeOrExcludeObjectSync(
            v,
            paths,
            [...currentPath, i.toString()],
            include
          )
      )
    ).filter((e) => e !== notIncludedSymbol);
  }

  if (typeof ocv === "object") {
    return Object.fromEntries(
      Object.entries(ocv).map(([key, value]) => [
        key,
        includeOrExcludeObjectSync(
          value,
          paths,
          [...currentPath, key],
          include
        ),
      ]).filter((e) => e[1] !== notIncludedSymbol)
    );
  }

  const isIncluded = paths.includes(currentPath.join("."));

  return include
    ? isIncluded // include mode, path is in list
      ? ocv
      : notIncludedSymbol
    : isIncluded // exclude mode, path is in list
    ? notIncludedSymbol
    : ocv;
}


export function objectContainedLoggedSync(
  ocv: any,
  options?: { include?: string[]; exclude: string[] }
): string {
  if (options && typeof ocv === "object") {
    if (options.include && options.include.length > 0) {
      return JSON.stringify(
        includeOrExcludeObjectSync(ocv, options.include, [], true)
      );
    }
    if (options.exclude && options.exclude.length > 0) {
      return JSON.stringify(
        includeOrExcludeObjectSync(ocv, options.exclude, [], false)
      );
    }
  }

  if (typeof ocv === "object") {
    return JSON.stringify(ocv);
  } else {
    return `${ocv}`;
  }
}

export function getItemByPathSync(obj: object, path: string | string[]) {
  const paths = Array.isArray(path) ? path : path.split(".");

  return Object.keys(obj).includes(paths[0])
    ? typeof obj[paths[0]] === "object"
      ? getItemByPathSync(obj[paths[0]], paths.slice(1))
      : obj[paths[0]]
    : undefined;
}