## `-` Discord JQVA.

#### **Discord Jqva** is a simple project how handle [discord.js@13](https://discord.js.org) commands, so you can easly create _**`normal commands or slash commands`**_ in easy way

### `-` Features

- easy a quick
- works like any discord.js handler
- replys system to make mutil language easy
- bult in erela.js system

### `-` Explain

`index.ts` is the main file every thimg start from here

here is the load for the `config.yml` file

```ts
const config: any = yaml.load(
  fs.readFileSync(__dirname + "/config.yml", "utf8")
);
```

here is the creation of the bot

```ts
const bot = new Bot();
```

here is the main function

```ts
(() => {
  bot.registerCommands("/src/commands"); // select the commands dir
  bot.on("commandsLoaded", (commands) =>
    console.log(chalk.red.bold(commands.size) + " Loadad commands...")
  ); // event emit when the commands loaded (commands) is a JSMap of all the loaded commands
  bot.client.on("ready", (client) =>
    console.log(chalk.red.bold(client.user.username) + " is ready to use...")
  ); // when the discord.js client is ready
  bot.login(config.BOT?.TOKEN); // login in to the client [you can also login with bot.client.login]
})();

// export the bot constructor and the replys from "config.yml" file
export default {
  bot: bot,
  replys: config.REPLYS,
};
```

`src/utils/bot.ts` here is the main constructor of the project [just do not touch it]
`src/utils/modules/register.ts` here is the register/load/run/employment of all the command
`src/utils/modules/respond` here is the replies respond and edit replies system

### `-` Useg

`src/commands` here is the commands directory

there is some categories in there like admin/music you can create any folder and name it any thing to make your own category

```ts
import {
  Channel,
  Client,
  CommandInteraction,
  Guild,
  Message,
  User,
} from "discord.js";
import index from "../../..";
import { respond, editRespond } from "../../utils/modules/respond";

export default {
  name: "<command name>",
  description: "<command discription>",
  type: 1, // command type, know more: https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types
  options: [
    // if you dont need options in your command just remove the options property
    {
      name: "<option name>",
      description: "<option description>",
      type: 3, // option type, know more: https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
      required: true, // you know :)
    },
  ],
  run: async (
    client: Client, // the discord.js clinet
    interaction: CommandInteraction, // the discord.js interaction
    message: Message, // the discord.js message
    args: string[], // the message args, if you are useing slash command this will me null
    isSlash: boolean, // if you are using slash commands this will be true else this will be false
    author: User, // the author of the command
    guild: Guild, // the command guild
    channel: Channel // the command channel
  ) => {
    const REPLYS = index.replys; // your replys from "config.yml/REPLYS"
    let playersManager = index.bot.getManager(); // get the erela.js manager

    // reply to commands
    respond(
      interaction,
      message,
      {
        content: "but you discord.js reply options",
      },
      isSlash
    ).then((d) => {
      // d is a message but it has not all the message propertys
      editRespond(
        interaction,
        message,
        {
          content: "just a normal discord.js reply options",
          embeds: [
            {
              description: ":)",
            },
          ],
        },
        isSlash,
        d.id
      );
      // you also can get the erela.js manager by this
      index.bot.getManager()
    });
  },
};
```

if this project helped you just leave a star in github repo

# made by: [@def.](https://discord.com/users/933856726770413578)
