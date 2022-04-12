import {
  AnyChannel,
  Intents,
  Interaction,
  Message,
  TextChannel,
} from "discord.js";
import { Client } from "discordx";
import "reflect-metadata";
import "dotenv/config";
import {
  ETwitterStreamEvent,
  TweetSearchAllV2Paginator,
  TwitterApi,
} from "twitter-api-v2";
import { dirname, importx } from "@discordx/importer";
import { Replay } from "./replay.js";

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!);
const roClient = twitterClient.readOnly;

const client: Client = new Client({
  botId: "replay",
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  silent: false,
});

client.once("ready", async () => {
  const generalChannel: TextChannel = (await client.channels.fetch(
      process.env.DISCORD_CHANNEL_ID!
  )) as TextChannel;
  // const rules = await roClient.v2.streamRules();
  // if (rules.data?.length) {
  //   await twitterClient.v2.updateStreamRules({
  //     delete: { ids: rules.data.map((rule) => rule.id) },
  //   });
  // }

  // await twitterClient.v2.updateStreamRules({
  //   add: [{ value: "from:MLBReplays" }],
  //   // add: [{ value: "from:MLBReplays" }, { value: "TalkinBaseball_" }],
  // });

  // const stream = await twitterClient.v2.searchStream({
  //   "tweet.fields": ["id", "text", "attachments", "created_at", "entities"],
  // });
  // stream.autoReconnect = true;

  // stream.on(ETwitterStreamEvent.Data, async (tweet) => {
  //   console.log("Tweet found");
  //   if (tweet.data.entities?.urls != null) {
  //     const replay = new Replay(tweet.data.entities?.urls[0].url.toString()!);

  //     replay.sendReplayMessage(generalChannel);
  //   }
  // });

  await client.initApplicationCommands({});
  await client.initApplicationPermissions();
});

client.on("interactionCreate", (interaction: Interaction) => {
  client.executeInteraction(interaction);
});

client.on("messageCreate", async (message: Message) => {
  client.executeCommand(message);
});

async function start() {
  await importx(dirname(import.meta.url) + "/commands/**/*.{ts,js}");

  await client.login(process.env.BOT_TOKEN!);
}

start();
