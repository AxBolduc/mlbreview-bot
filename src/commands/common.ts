import { CommandInteraction, Message, TextChannel } from "discord.js";
import { Discord, SimpleCommand, SimpleCommandMessage, Slash } from "discordx";
import { Replay } from "../replay.js";

@Discord()
abstract class Example {
  @SimpleCommand("testTweet")
  private async testTweet(command: SimpleCommandMessage) {
    const tweetURL = command.argString;

    const replay: Replay = new Replay(tweetURL);
    replay.sendReplayMessage(command.message.channel as TextChannel);

  }
}
