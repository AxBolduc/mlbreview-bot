import {
  AnyChannel,
  CategoryChannel,
  Channel,
  Intents,
  Status,
  TextChannel,
} from "discord.js";
import { Client } from "discordx";
import "reflect-metadata";
import "dotenv/config";
import { ETwitterStreamEvent, TwitterApi } from "twitter-api-v2";

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
  const rules = await roClient.v2.streamRules();
  if (rules.data?.length) {
    await twitterClient.v2.updateStreamRules({
      delete: { ids: rules.data.map((rule) => rule.id) },
    });
  }

  await twitterClient.v2.updateStreamRules({
    add: [{ value: "from:MLBReplays" }],
  });

  const stream = await twitterClient.v2.searchStream({
      'tweet.fields': ["id", "text", "attachments", "created_at", "entities"]
  })
  stream.autoReconnect = true;

  stream.on(ETwitterStreamEvent.Data,async (tweet) => {
      console.log("Tweet found");
      console.log(tweet.data.entities?.urls[0].url);
  })


  await client.initApplicationCommands();
  await client.initApplicationPermissions();
});

client.login(process.env.BOT_TOKEN!);