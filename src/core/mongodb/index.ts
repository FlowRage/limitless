import { APlugin, Flow } from "@flowrage/core";
import { MongoClient } from "mongodb";
import type { MongoClientOptions } from "mongodb";

declare module "@flowrage/core" {
  namespace Flow {
    namespace Custom {
      interface Properties {
        MongoDB: MongoDB;
      }

      namespace Plugin {
        interface Options {}
      }
    }
  }
}

declare namespace Mongo {
  interface Options {
    host: string;
    port: string | number;
    database: string;
    username?: string;
    password?: string;
    clientOptions?: MongoClientOptions;
  }
}

export class MongoDB extends APlugin {
  static config(
    options: Mongo.Options
  ): Flow.Plugin.External.Options & Mongo.Options {
    return {
      name: "MongoDB",
      package: "@flowrage/mongodb",
      dependencies: [],
      host: options.host,
      port: options.port,
      database: options.database,
      password: options.password,
      username: options.username,
      clientOptions: options.clientOptions,
    };
  }

  private host: string;
  private port: string | number;
  private username: string | undefined;
  private password: string | undefined;
  public database: string;

  private uri: string;

  public client: MongoClient;

  constructor(options: Flow.Plugin.Internal.Options & Mongo.Options) {
    super({
      context: options.context,
      name: options.name,
      dependencies: options.dependencies,
      package: options.package,
    });

    this.host = options.host;
    this.port = options.port;
    this.database = options.database;

    this.username = options.username;
    this.password = options.password;

    if (this.username && this.password) {
      this.uri = `mongodb://${this.username}:${this.password}@${this.host}:${this.port}/`;
    } else {
      this.uri = `mongodb://${this.host}:${this.port}/`;
    }

    this.client = new MongoClient(this.uri, options.clientOptions);
  }
  async connect(): Promise<MongoClient> {
    return new Promise<MongoClient>((resolve, reject) => {
      this.client
        .connect()
        .then((client) => resolve(client))
        .catch((err) => reject(err));
    });
  }
}
