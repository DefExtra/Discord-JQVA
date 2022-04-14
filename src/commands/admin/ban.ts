import { Channel, Client, CommandInteraction, Guild, Message, User } from "discord.js";
import { editRespond, respond } from "../../utils/modules/respond";
import index from "../../..";

export default {
  name: "ban",
  description: "ban members.",
  type: 1,
  options: [
    {
      name: "member",
      description: "the member you will ban.",
      type: 6,
      required: true,
    },
  ],

  run: (
    client: Client,
    interaction: CommandInteraction,
    message: Message,
    args: string[],
    isSlash: boolean,
    author: User,
    guild: Guild,
    channel: Channel
  ) => {
    const REPLYS = index.replys;
    let user =
      isSlash == true
        ? interaction.options.getUser("member", true)
        : message.mentions.members?.first();
    if (!user)
      return respond(
        interaction,
        message,
        {
          content: REPLYS.invaildUseg
            .replace("{do}", "mention someone")
            .replace("{ex}", "/ban member:<username>"),
        },
        isSlash
      );
    let member = guild?.members.cache.get(user.id || "");
    if (!member) return;
    if (member.bannable) {
      member
        .ban({
          reason: "هوا كده",
        })
        .then(() => {
          respond(
            interaction,
            message,
            {
              content: REPLYS.banDone.replace(
                "{user[id]}",
                `${user?.id || ""}`
              ),
            },
            isSlash
          );
        })
        .catch(() => {
          respond(
            interaction,
            message,
            {
              content: REPLYS.cantBanThisMember,
            },
            isSlash
          );
        });
    } else
      respond(
        interaction,
        message,
        {
          content: REPLYS.cantBanThisMember,
        },
        isSlash
      );
  },
};
