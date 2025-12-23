import { MyContext } from "../bot";
import { User } from "../models/user.model";

export const regCommand = async (ctx: MyContext) => {
  const messageText = ctx.message?.text;
  const from = ctx.from;

  if (!messageText || !from) {
    return;
  }
  const [command, ...nameParts] = messageText.split(/\s+/);
  const name = nameParts.join(" ").trim();

  if (!name) {
    await ctx.reply(
      "❌ Вы не ввели имя.\nПожалуйста, введите команду в формате: `/reg <Ваше имя из таблицы>`",
    );
    return;
  }

  const updateSession = (userName: string, botUsername: string | undefined) => {
    ctx.session.name = userName;
    ctx.session.username = botUsername;
    ctx.session.step = "done";
  };

  try {
    const existingUser = await User.findOne({
      where: { telegramId: from.id },
    });

    if (existingUser) {
      updateSession(existingUser.name, existingUser.username ?? from.username);
      await ctx.reply(
        `👋 Вы уже зарегистрированы как **${existingUser.name}**.`,
      );
      return;
    }
    await User.create({
      telegramId: from.id,
      username: from.username,
      name: name,
      city: "Ижевск",
    });

    updateSession(name, from.username);
    await ctx.reply(`✅ Вы успешно зарегистрировались как **${name}**!`);
  } catch (error) {
    console.error("Ошибка при регистрации нового пользователя:", error);
    await ctx.reply(
      "❌ Произошла ошибка при сохранении данных. Пожалуйста, попробуйте позже.",
    );
  }
};
