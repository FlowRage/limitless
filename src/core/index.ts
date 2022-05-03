import { createFlow } from "@flowrage/core";
import { Accounts } from "./accounts";
import { Server } from "./server";
import { MongoDB } from "./mongodb";
import { Log } from "./logger";
import commands from "./commands";

const flow = createFlow({
  name: "Limitless RP",
})
  .use(Log, Log.config())
  .use(Server, Server.config())
  .use(
    MongoDB,
    MongoDB.config({
      host: "localhost",
      port: 27017,
      database: "Limitless",
    })
  )
  .use(Accounts, Accounts.config());

commands(flow);

export default flow;
