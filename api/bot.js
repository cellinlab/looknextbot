import { Bot, webhookCallback } from "grammy";
import "dotenv/config";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("Bot token is not provided!");
}

const bot = new Bot(token);

bot.command("start", (ctx) => ctx.reply("Hello World!"));

export default webhookCallback(bot, 'http');
