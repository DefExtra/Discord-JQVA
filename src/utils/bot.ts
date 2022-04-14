import { Client, Intents } from "discord.js";
import { Register } from "./modules/register";

export class Bot extends Register {
  constructor(
    public client: Client = new Client({
      intents: new Intents(32767),
      allowedMentions: { repliedUser: false },
    }),
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
    > = new Map()
  ) {
    super(client, dirname, commands);
  }
  getCommands() {
    return this.commands;
  }
  login(token: string) {
    return new Promise((resolve, reject) => {
      this.client
        .login(token)
        .then(() => resolve(this.client))
        .catch((err) => reject(err));
    });
  }
  getManager() {
    return this.manager;
  }
}