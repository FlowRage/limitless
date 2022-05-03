import type { Flow } from "@flowrage/core";

export default function Commands(flow: Flow.Instance) {
  flow.Server.Events.add(RageEnums.EventKey.PLAYER_JOIN, (player: PlayerMp) => {
    player.outputChatBox("Welcome to the server");
    player.outputChatBox("use /signup or /signin command for auth");
  });

  flow.Server.Events.addCommand("accounts", (player) => {
    flow.Accounts.list().then((res) => {
      player.outputChatBox(JSON.stringify(res));
    });
  });

  flow.Server.Events.addCommand("signup", (player, _, ...args) => {
    let options = {
      username: "",
      password: "",
      email: "",
    };

    if (args[0]) options.username = args[0];
    if (args[1]) options.password = args[1];
    if (args[2]) options.email = args[2];

    flow.Accounts.signup(options).then((res) => {
      player.outputChatBox(res);
    });
  });
}
