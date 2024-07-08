export function truncateString(str: string, len: number) {
  if (str.length <= len) return str;
  return [str.slice(0, len / 2), "...", str.slice(-(len / 2))].join("");
}

export function errorToString(e: unknown) {
  if (e instanceof Error) {
    return e.message;
  } else if (typeof e === "string") {
    return e;
  } else {
    return "unknown error";
  }
}
