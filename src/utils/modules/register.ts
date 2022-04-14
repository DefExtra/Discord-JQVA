import { Client } from "discord.js";
import fs from "fs";
import { EventEmitter } from "events";
import yaml from "js-yaml";
import { Manager, Track } from "erela.js";
import chalk from "chalk";

const config: any = yaml.load(
  fs.readFileSync(process.cwd() + "/config.yml", "utf8")
);

export class Register extends EventEmitter {
  constructor(
    public client?: Client,
    public dirname: string = process.cwd(),
    public commands: Map<
      string,
      {
        name: string;
        description: string;
        type?: "CHAT_INPUT";
        options?: {
          name: string;
          description: string;
          type: "NUMBER" | "STRING" | "CHANNEL" | "USER";
          required: boolean;
          choices: {
            name: string;
            value: string;
          }[];
        }[];
        run: Function;
      }
    > = new Map(),
    public manager?: Manager
  ) {
    super();
    this.client?.on("ready", () => {
      let manager = new Manager({
        nodes: [
          {
            host: "lavalink.houseofgamers.xyz",
            port: 2333,
            password: "lavalink",
            secure: false,
          },
        ],
        send: (id, payload) => {
          const guild = this.client?.guilds.cache.get(id);
          if (guild) guild.shard.send(payload);
        },
      });
      manager;
      manager
        .on("nodeConnect", (node) =>
          console.log(chalk.green.bold(`"${node.options.identifier}"`) + " is connected...")
        )
        .on("nodeError", (node, error) =>
          console.log(
            `Node "${node.options.identifier}" encountered an error: ${error.message}.`
          )
        )
      manager.init(this.client?.user?.id || "");
      this.client?.on("raw", (d) => manager.updateVoiceState(d));
      setTimeout(() => {
        this.manager = manager;
        const commandsArray: any = [];
        this.commands.forEach((command) => {
        //   let commandData = new SlashCommandBuilder()
        //     .setName(command.name)
        //     .setDescription(command.description);
        //   command.options?.forEach((option) => {
        //     if (option.type == "USER") {
        //       commandData.addUserOption((option) =>
        //         option
        //           .setName(option.name)
        //           .setDescription(option.description)
        //           .setRequired(option.required)
        //       );
        //     } else if (option.type == "STRING") {
        //       commandData.addStringOption((option) =>
        //         option
        //           .setName(option.name)
        //           .setDescription(option.description)
        //           .setRequired(option.required)
        //       );
        //     } else if (option.type == "CHANNEL") {
        //       commandData.addChannelOption((option) =>
        //         option
        //           .setName(option.name)
        //           .setDescription(option.description)
        //           .setRequired(option.required)
        //       );
        //     } else if (option.type == "NUMBER") {
        //       commandData.addNumberOption((option) =>
        //         option
        //           .setName(option.name)
        //           .setDescription(option.description)
        //           .setRequired(option.required)
        //       );
        //     }
        //   });
          // commandsArray.push(commandData.toJSON());
          commandsArray.push(command);
        });

        (async () => {
          try {
            await this.client?.application?.commands.set(commandsArray)
          } catch (error) {
            console.error(error);
          }
        })();
      }, 2000);
    });
    this.client
      ?.on("interactionCreate", async (interaction) => {
        if (interaction.isCommand()) {
          await interaction.deferReply({ ephemeral: true }).catch(() => {});
          if (interaction.user.bot) return;
          if (interaction.guildId == null) return;
          let command = commands.get(interaction.commandName);
          if (command)
            command.run(client, interaction, null, [], true, interaction.user, interaction.guild, interaction.channel);
        }
      })
      .on("messageCreate", (message) => {
        if (message.author.bot) return;
        if (message.guildId == null) return;
        let [commandNameS, ...args] = message.content.split(" ");
        let commandName = commandNameS.split(config.BOT.PREFIX)[1];
        let command = commands.get(commandName);
        if (command)
          command.run(client, null, message, args, false, message.author, message.guild, message.channel);
      });
  }
  registerCommands(commandDir: string = "/") {
    fs.readdirSync(this.dirname + commandDir).map((category) => {
      fs.readdirSync(this.dirname + commandDir + "/" + category)
        .filter((commandFile) => commandFile.endsWith(".ts"))
        .map(async (commandFile) => {
          let command: {
            default: {
              name: string;
              description: string;
              type?: "CHAT_INPUT";
              options?: {
                name: string;
                description: string;
                type: "NUMBER" | "STRING" | "CHANNEL" | "USER";
                required: boolean;
                choices: {
                  name: string;
                  value: string;
                }[];
              }[];
              run: Function;
            };
          } = await await import(
            this.dirname + commandDir + "/" + category + "/" + commandFile
          );
          if (command.default) {
            this.commands.set(command.default.name, command.default);
          }
        });
    });
    setTimeout(() => this.emit("commandsLoaded", this.commands), 2002);
  }
}
