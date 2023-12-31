export declare const notIncludedSymbol: unique symbol;
export declare function includeOrExcludeObject(ocv: any, paths: string[], currentPath: string[], include: boolean): any;
export default function objectContainedLogged(ocv: any, options?: {
    include?: string[];
    exclude: string[];
}): Promise<string>;
export declare function getItemByPath(obj: object, path: string | string[]): any;
