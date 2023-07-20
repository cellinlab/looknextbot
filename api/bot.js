import { Bot, webhookCallback, session } from "grammy";
import { Menu } from '@grammyjs/menu';
import { conversations, createConversation } from '@grammyjs/conversations';
import "dotenv/config";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("Bot token is not provided!");
}

const bot = new Bot(token);

const menu = new Menu('my-menu')
  .text("🔼 Add", async (ctx) => {
    await ctx.conversation.enter("add");
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
    name: "default name",
    address: "default address"
  };
}

bot.use(session({
  initial: initialSession,
}));

bot.use(conversations());
bot.use(createConversation(greeting));
bot.use(createConversation(handleAdd, "add"));

bot.use(menu);

bot.use(bot.callbackQuery());

bot.command("start", async (ctx) => {
  await ctx.conversation.enter("greeting");
});

bot.catch((err) => {
  console.log("Error: ", err);
});

async function greeting(conversation, ctx) {
  await ctx.reply("Hello, welcome to here, there is looknextbot", {
    reply_markup: menu
  });

  return;
}

async function handleAdd(conversation, ctx) {
  try {
    await ctx.reply("Please enter the name you want to add（name must be letters and length 1-8）");

    let resName = await conversation.wait();

    console.log("resName: ", resName);

    let name = resName.update.message.text;

    while (!/^[a-zA-Z]{1,8}$/.test(name)) {
      await ctx.reply("name must be letters and length 1-8");

      resName = await conversation.wait();
      name = resName.update.message.text;
    }

    ctx.session.name = name;

    // 地址必须是长度为42位，0x开头，由数字和字母组成的字符串
    await ctx.reply("Please enter the address you want to add（address must be 42 characters long, start with 0x, and consist of numbers and letters）");

    let resAddress = await conversation.wait();

    console.log("resAddress: ", resAddress);

    let address = resAddress.update.message.text;

    while (!/^0x[a-zA-Z0-9]{40}$/.test(address)) {
      await ctx.reply("address must be 42 characters long, start with 0x, and consist of numbers and letters");

      resAddress = await conversation.wait();
      address = resAddress.update.message.text;
    }

    ctx.session.address = address;

    menu
      .row()
      .text(
        (ctx) => {
          return ctx.session.name;
        },
        (ctx) => { }
      )
      .text(
        (ctx) => {
          return ctx.session.address;
        },
        (ctx) => { }
      );

    await ctx.reply("Add success", {
      reply_markup: menu
    });

    return await conversation.end();
  } catch (error) {
    console.log("error: ", error);
    await ctx.reply("Add failed");
  }
}

export default webhookCallback(bot, 'http');
