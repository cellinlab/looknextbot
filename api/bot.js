import { Bot, webhookCallback, session } from "grammy";
import { Menu } from '@grammyjs/menu';
import "dotenv/config";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("Bot token is not provided!");
}

const bot = new Bot(token);

const menu = new Menu('my-menu')
  .text("🔼 Add", (ctx) => {
    return ctx.reply("Add");
  })
  .text("🔀 Switch", (ctx) => {
    ctx.session.isBuy = !ctx.session.isBuy;
    ctx.menu.update();
  }).row()
  .text(
    (ctx) => {
      const type = ctx.session.isBuy ? "🛒 Buy" : "💰 Sell";
      return `${type} 0.01`;
    },
    (ctx) => { }
  )
  .text(
    (ctx) => {
      const type = ctx.session.isBuy ? "🛒 Buy" : "💰 Sell";
      return `${type} 0.5`;
    },
    (ctx) => { }
  ).row();

function initialSession() {
  return {
    isBuy: true,
  };
}

bot.use(session({
  initial: initialSession,
}));

bot.use(menu);

bot.use(bot.callbackQuery());

bot.command("start", async (ctx) => {
  await ctx.reply("Hello, welcome to here, there is looknextbot", {
    reply_markup: menu
  });
});

bot.catch((err) => {
  console.log("Error: ", err);
});

export default webhookCallback(bot, 'http');
