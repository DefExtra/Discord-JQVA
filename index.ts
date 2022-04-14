import { Bot } from "./src/utils/bot";
import yaml from "js-yaml";
import fs from "fs";
import chalk from "chalk";

const config: any = yaml.load(
  fs.readFileSync(__dirname + "/config.yml", "utf8")
);

const bot = new Bot();

(() => {
  bot.registerCommands("/src/commands");
  bot.on("commandsLoaded", (commands) =>
    console.log(chalk.red.bold(commands.size) + " Loadad commands...")
  );
  bot.client.on("ready", (client) =>
    console.log(chalk.red.bold(client.user.username) + " is ready to use...")
  );
  bot.login(config.BOT?.TOKEN);
})();

export default {
  bot: bot,
  replys: config.REPLYS
};