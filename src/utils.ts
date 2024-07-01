export function truncateString(str: string, len: number) {
    if (str.length <= len) return str;
    return [str.slice(0, len / 2), "...", str.slice(-(len / 2))].join("");
  }