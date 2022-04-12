import { CommandInteraction, Message } from "discord.js";
import { Discord, SimpleCommand, SimpleCommandMessage, Slash } from "discordx";

@Discord()
abstract class Example {
  @SimpleCommand("kappa")
  private async kappa(command: SimpleCommandMessage) {
    const message = await command.message.channel.send(command.argString);
    await Promise.all([message.react("1️⃣"), message.react("2️⃣")])
    message
      .awaitReactions({ max: 1, time: 60000, errors: ["time"] })
      .then((collected) => {
        const reaction = collected.first();

        if (reaction?.emoji.name == "1️⃣") {
          message.reply("Youre numba 1");
        } else if (reaction?.emoji.name == "2️⃣") {
          message.reply("Youre numba 2");
        }
      });
  }
}
