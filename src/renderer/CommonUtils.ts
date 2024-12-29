export function getSuffix(path: string): string {
    return path.substring(path.lastIndexOf('.') + 1)
}