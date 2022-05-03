import { APlugin, Flow } from "@flowrage/core";

declare module "@flowrage/core" {
  namespace Flow {
    namespace Custom {
      interface Properties {
        Log: Log;
      }
    }
  }
}

type Colors =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white";

type LogLevel = {
  name: string;
  color: Colors;
};

type LoggerExternalOptions = {
  levels?: Array<LogLevel>;
};

type LoggerInternalOptions = {
  levels: Array<LogLevel>;
};

type LogOptions = {
  level?: string;
  message: string;
  timestamp?: boolean;
  [key: string]: any;
};

export class Log extends APlugin {
  static config(
    options?: LoggerExternalOptions
  ): Flow.Plugin.External.Options & LoggerInternalOptions {
    const conf: Flow.Plugin.External.Options & LoggerInternalOptions = {
      name: "Logger",
      package: "@flowrage/logger",
      dependencies: [],
      levels: [
        { name: "info", color: "white" },
        { name: "warn", color: "yellow" },
        { name: "error", color: "red" },
      ],
    };

    if (options) {
      if (
        options.levels &&
        Array.isArray(options.levels) &&
        options.levels.every((el) => typeof el === "object") &&
        Object.keys(options.levels).some(
          (el) => el === "name" || el === "color"
        )
      ) {
        conf.levels = options.levels;
      }
    }

    return conf;
  }

  private readonly colors: {
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
    reset: string;
  } = {
    black: "\u001b[30m",
    red: "\u001b[31m",
    green: "\u001b[32m",
    yellow: "\u001b[33m",
    blue: "\u001b[34m",
    magenta: "\u001b[35m",
    cyan: "\u001b[36m",
    white: "\u001b[37m",
    reset: "\u001b[0m",
  };

  private levels: Array<LogLevel>;

  constructor(options: Flow.Plugin.Internal.Options & LoggerInternalOptions) {
    super(options);

    this.levels = options.levels;
  }
  private timestamp(): string {
    let date = new Date();
    let dateFormat =
      [
        date.getMonth() + 1 < 10
          ? "0" + date.getMonth() + 1
          : date.getMonth() + 1,
        date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
        date.getFullYear(),
      ].join("/") +
      " " +
      [
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(),
      ].join(":");

    return dateFormat;
  }
  console(options: LogOptions) {
    if (options.timestamp === undefined) options.timestamp = true;

    if (options.level) {
      let level = this.levels.find((el) => el.name === options.level);

      if (level) {
        if (options.timestamp) {
          console.log(
            this.colors[level.color] + options.message + " " + this.timestamp()
          );
        } else {
          console.log(this.colors[level.color] + options.message);
        }
      } else {
        if (options.timestamp) {
          console.log(options.message + " " + this.timestamp());
        } else {
          console.log(options.message);
        }
      }
    } else {
      if (options.timestamp) {
        console.log(options.message + " " + this.timestamp());
      } else {
        console.log(options.message);
      }
    }
  }
}
