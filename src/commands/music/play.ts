import { Channel, Client, CommandInteraction, Guild, Message, User } from "discord.js";
import  index from "../../..";
import { respond } from "../../utils/modules/respond";

export default {
  name: "play",
  description: "play muisc.",
  type: 1,
  options: [
    {
      name: "song",
      description: "the song you wont to play.",
      type: 3,
      required: true,
    },
  ],
  run: async (
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
    let playersManager = index.bot.getManager();
    if (!playersManager) return;
    let player = await playersManager.players.get(guild.id || "");
    let voiceChannel = await guild.members.cache.get(author.id || "")?.voice
      .channel;
    let searchQuery =
      isSlash == true
        ? interaction.options.getString("song", true)
        : args.join(" ");
    if (!searchQuery)
      return await respond(
        interaction,
        message,
        {
          content:
            REPLYS.invaildUseg.replace("{do}", "type the song name/url").replace("{ex}", "/play song:<name/url>"),
        },
        isSlash
      );
    const searchQueryResponse = await playersManager.search(
      searchQuery,
      author
    );
    if (!voiceChannel)
      return await respond(
        interaction,
        message,
        {
          content: REPLYS.notInVoiceChannel,
        },
        isSlash
      );
    let textChannel = isSlash == true ? interaction.channel : message.channel;
    if (!textChannel) return;
    if (!player)
      player = await playersManager.create({
        guild: guild.id || "",
        textChannel: textChannel.id || "",
        voiceChannel: voiceChannel.id || "",
        selfDeafen: true,
        selfMute: false,
        volume: 50,
      });
    if (player.state !== "CONNECTED") await player.connect();
    player.queue.add(searchQueryResponse.tracks[0]);
    respond(
      interaction,
      message,
      {
        content: REPLYS.trackENQ.replace("{song[title]}", `${searchQueryResponse.tracks[0].title}`),
      },
      isSlash
    );
    if (!player.playing && !player.paused && !player.queue.size) player.play();
    if (
      !player.playing &&
      !player.paused &&
      player.queue.totalSize === searchQueryResponse.tracks.length
    )
      player.play();
  },
};
