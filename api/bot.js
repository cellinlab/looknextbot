import { Bot, webhookCallback, session } from "grammy";
import "dotenv/config";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("Bot token is not provided!");
}

const bot = new Bot(token);

function initialSession() {
  return {
    isBuy: true,
  };
}

bot.use(session({
  initial: initialSession,
}));

bot.use(bot.callbackQuery());


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

bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;


  switch (data) {
    case "btn_switch":
      ctx.session.isBuy = !ctx.session.isBuy;

      const isBuy = ctx.session.isBuy;

      return ctx.editMessageReplyMarkup({
        inline_keyboard: isBuy ? [...normalKeyboard, ...buyKeyboard] : [...normalKeyboard, ...sellKeyboard],
      });
    default:
      return ctx.reply("Unknown command");
  }
});

export default webhookCallback(bot, 'http');
