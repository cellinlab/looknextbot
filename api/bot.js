import { Bot, webhookCallback, session } from "grammy";
import { Menu } from '@grammyjs/menu';
import "dotenv/config";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("Bot token is not provided!");
}

const bot = new Bot(token);

const menu = new Menu('my-menu')
  .text("🔼 Add", handleAdd)
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
  ).row()
  .dynamic((ctx, range) => {
    if (ctx.session.name !== "default name" && ctx.session.address !== "default address") {
      range
        .text(ctx.session.name, (ctx) => { })
        .text(ctx.session.address, (ctx) => { })
        .row();
    }
  });

function initialSession() {
  return {
    isBuy: true,
    name: "default name",
    address: "default address",
    conversation: null,
  };
}

bot.use(session({
  initial: initialSession,
}));

bot.use(menu);

bot.command("start", async (ctx) => {
  await ctx.reply("Hello, welcome to here, there is looknextbot", {
    reply_markup: menu
  });
});

bot.on('message', async (ctx) => {
  console.log("ctx: ", ctx);

  const conversation = ctx.session.conversation;

  switch (conversation) {
    case 'add_name':
      const name = ctx.message.text;

      if (!/^[a-zA-Z]{1,8}$/.test(name)) {
        await ctx.reply("name must be letters and length 1-8");
      } else {
        ctx.session.name = name;
        ctx.session.conversation = 'add_address';

        await ctx.reply("Please enter the address you want to add（address must be 42 characters long, start with 0x, and consist of numbers and letters）");
      }
      break;
    case 'add_address':
      const address = ctx.message.text;

      if (!/^0x[a-zA-Z0-9]{40}$/.test(address)) {
        ctx.reply("address must be 42 characters long, start with 0x, and consist of numbers and letters");
      } else {
        ctx.session.address = address;
        ctx.session.conversation = null;

        ctx.reply("Add success", {
          reply_markup: menu
        });
      }
      break;
    default:
      ctx.reply("Please enter the command");
      break;
  }
});

bot.catch((err) => {
  console.log("Error: ", err);
});

async function handleAdd(ctx) {
  try {
    await ctx.reply("Please enter the name you want to add（name must be letters and length 1-8）");

    ctx.session.conversation = 'add_name';


    // let name = resName.update.message.text;

    // while (!/^[a-zA-Z]{1,8}$/.test(name)) {
    //   await ctx.reply("name must be letters and length 1-8");

    //   resName = await conversation.wait();
    //   name = resName.update.message.text;
    // }

    // ctx.session.name = name;

    // // 地址必须是长度为42位，0x开头，由数字和字母组成的字符串
    // await ctx.reply("Please enter the address you want to add（address must be 42 characters long, start with 0x, and consist of numbers and letters）");

    // let resAddress = await conversation.wait();

    // let address = resAddress.update.message.text;

    // while (!/^0x[a-zA-Z0-9]{40}$/.test(address)) {
    //   await ctx.reply("address must be 42 characters long, start with 0x, and consist of numbers and letters");

    //   resAddress = await conversation.wait();
    //   address = resAddress.update.message.text;
    // }

    // ctx.session.address = address;
  } catch (error) {
    console.log("error: ", error);
    await ctx.reply("Add failed");
  }
}

export default webhookCallback(bot, 'http');
