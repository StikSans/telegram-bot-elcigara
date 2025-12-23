import { MyContext } from "../bot";
import { User } from "../models/user.model";

export const startCommand = async (ctx: MyContext) => {
  const existingUser = await User.findOne({
    where: { telegramId: ctx.from!.id },
  });

  if (existingUser) {
    ctx.session.name = existingUser.name;
    ctx.session.username = existingUser.username ?? ctx.from?.username;
    ctx.session.step = "done";

    await ctx.reply(`Привет ${existingUser.name}`);
    return;
  }
  ctx.reply("Привет, скину график с таблицы Excel! \n Ведите /reg <имя ваше>");
};
