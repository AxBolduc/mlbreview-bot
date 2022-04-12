import { Client, TextChannel } from "discord.js";

export class Replay {
  tweetURL: String;

  constructor(tweetURL: string) {
    this.tweetURL = tweetURL;
  }

  /**
   * sendReplayMessage
   * Generates and sends the interactive message to the channel given
   * @param channel Channel to send the interactive message to
   */
  public async sendReplayMessage(channel: TextChannel) {
    const message = await channel.send(this.tweetURL.toString());

    Promise.all([message.react("1️⃣"), message.react("2️⃣")]).then(
      async (reactions) => {
        message
          .awaitReactions({
              filter(reaction, user) {
                return reaction.message == message && user.id != message.author.id;
              },
            max: 1,
            time: 60000,
            errors: ["time"],
          })
          .then((collection) => {
            const reaction = collection.first();

            if (reaction?.emoji.name == "1️⃣") {
              message.reply("One selected");
            } else {
              message.reply("Two selected");
            }
          });
      }
    );
  }
}
