export type Token = { type: string; value: string };

const KEYWORDS = new Set([
  "put", "in", "get", "delete", "register", "user", "with", "and", "is",
  "update", "set", "true", "false", "none", "active", "list"
]);

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i] as string;

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (char === '"' || char === "'") {
      const quote = char;
      let j = i + 1;
      let value = "";
      while (j < input.length && input[j] !== quote) {
        value += input[j++];
      }
      if (input[j] !== quote) throw new Error(`Unterminated string at position ${i}`);
      tokens.push({ type: "STRING", value });
      i = j + 1;
      continue;
    }

    const numberMatch = input.slice(i).match(/^\d+(\.\d+)?/);
    if (numberMatch) {
      const num = numberMatch[0];
      tokens.push({
        type: num.includes(".") ? "FLOAT" : "INT",
        value: num,
      });
      i += num.length;
      continue;
    }

    const identMatch = input.slice(i).match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
    if (identMatch) {
      const word = identMatch[0];
      if (KEYWORDS.has(word.toLowerCase())) {
        tokens.push({ type: word.toUpperCase(), value: word.toLowerCase() });
      } else {
        tokens.push({ type: "IDENT", value: word });
      }
      i += word.length;
      continue;
    }

    if (char === ",") {
      tokens.push({ type: "COMMA", value: "," });
      i++;
      continue;
    }

    throw new Error(`Illegal character '${char}' at position ${i}`);
  }

  return tokens;
}
