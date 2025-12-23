import { MyContext } from "../bot";
import { User } from "../models/user.model";

export const removeCommand = async (ctx: MyContext) => {
  if (ctx.session.name) {
    ctx.session.name = undefined;
    ctx.session.step = undefined;
    ctx.session.username = undefined;
    await User.destroy({ where: { telegramId: ctx.from!.id } });
    await ctx.reply("Вы успешно вышли");

    return;
  }
  await ctx.reply("Вы не зарегистрированы");
};
