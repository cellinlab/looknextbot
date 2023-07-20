import { Bot, webhookCallback } from "grammy";
import "dotenv/config";

const token = process.env.BOT_TOKEN;

const bot = new Bot(token);

bot.command("start", (ctx) => ctx.reply("Hello World!"));

webhookCallback(bot, 'https');
