import colors from "colors/safe";

const theme = {
  silly: "rainbow",
  input: "grey",
  verbose: "cyan",
  prompt: "grey",
  info: "green",
  data: "grey",
  help: "cyan",
  warn: "yellow",
  debug: "blue",
  error: "red"
};

type Logger = {
  [K in keyof typeof theme]: (...text: string[]) => void;
};

colors.setTheme(theme);

// hack the colors as logger according to theme.
export const logger = new Proxy(colors, {
  get(target: any, prop: string) {
    if (!(prop in theme)) {
      return;
    }

    return (...text: string[]) => console.info(target[prop](...text));
  }
}) as Logger;
