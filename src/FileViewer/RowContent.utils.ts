import { truncateString } from "../utils";

  export function jsonSummary(data: unknown, max = 100) {
    if (!data || typeof data !== "object") return null;
   
    const content: string[] = [];
    const len = ()=> content.reduce((p,c)=> p+c.length, 0);
   
    for (const key in data) {
      let value = data[key as keyof typeof data] as unknown;
      if (typeof value === "string" && value.length > 50) {
        value = truncateString(value, 50)
      }
      content.push(`"${key}": ${JSON.stringify(value)}`);
    
      if (len() > max) {
        break;
      }
    }
  
    return `${content.join(", ").slice(0, max)}${len() > max?'...':''}`;
  }