import { Bot, webhookCallback } from "grammy";
import "dotenv/config";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("Bot token is not provided!");
}

const bot = new Bot(token);

const normalKeyboard = [
  [
    { text: "🔼 Add", callback_data: "btn_add" },
    { text: "🔀 Switch", callback_data: "btn_switch" },
  ],
];

const buyKeyboard = [
  [
    { text: "🛒 Buy 0.01 ", callback_data: "btn_buy_1" },
    { text: "🛒 Buy 0.05 ", callback_data: "btn_buy_2" },
  ],
];

const sellKeyboard = [
  [
    { text: "💰 Sell 0.01 ", callback_data: "btn_sell_1" },
    { text: "💰 Sell 0.05 ", callback_data: "btn_sell_2" },
  ],
];

bot.command("start", async (ctx) => {
  await ctx.reply("Hello, welcome to here, there is looknextbot");

  ctx.session.isBuy = true;

  return ctx.reply('Select a service', {
    reply_markup: {
      inline_keyboard: [
        ...normalKeyboard,
        ...buyKeyboard,
      ],
    },
  });
});

bot.actions(/btn_switch/, async (ctx) => {
  ctx.session.isBuy = !ctx.session.isBuy;

  const isBuy = ctx.session.isBuy;

  return ctx.editMessageReplyMarkup({
    inline_keyboard: isBuy ? [...normalKeyboard, ...buyKeyboard] : [...normalKeyboard, ...sellKeyboard],
  });
});

export default webhookCallback(bot, 'http');
