import {
  CommandInteraction,
  InteractionReplyOptions,
  Message,
} from "discord.js";

/**
 * @returns {Message}
 */

export async function respond(
  base: CommandInteraction,
  base2: Message,
  options: InteractionReplyOptions,
  isSlash: boolean
) {
  let dataS: any = new Promise((resolve, reject) => {
    if (isSlash)
      base
        .followUp(options)
        .catch((d) => reject(d))
        .then((m) => {
          resolve(m);
        });
    else
      base2
        .reply(options)
        .catch((d) => reject(d))
        .then((m) => {
          resolve(m);
        });
  });
  let data: Message = dataS;
  return data;
}

export async function editRespond(
  base: CommandInteraction,
  base2: Message,
  options: InteractionReplyOptions,
  isSlash: boolean,
  messageId: string
) {
  if (isSlash)
    base
      .editReply(options)
      .catch((d) => console.log(d))
      .then((m) => {
        return m;
      });
  else
    (await base2.channel.messages.fetch(messageId)).edit(options).then((m) => {
      return m;
    });
}
