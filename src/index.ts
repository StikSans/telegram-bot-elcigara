import { bot } from "./bot";
import { getPoint, getPointsCommand } from "./commands/get_points";
import { getTochCommand } from "./commands/get_toch";
import { regCommand } from "./commands/reg";
import { removeCommand } from "./commands/remove";
import { startCommand } from "./commands/start";
import { scheduleCommand } from "./commands/sсhedule";
import { loggerMiddleware } from "./middlewares/logger";
import { sequelize } from "./models";

bot.use(loggerMiddleware);

bot.command("start", startCommand);
bot.command("reg", regCommand);
bot.command("schedule", scheduleCommand);
bot.command("get_points", getPointsCommand);
bot.command("remove", removeCommand);
bot.command("get_toch", getTochCommand);
bot.callbackQuery(/^get_point:(.+)$/, async (ctx) => {
  const pointName = ctx.match[1];
  await getPoint(ctx, pointName); // передаём название точки напрямую
  await ctx.answerCallbackQuery();
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Соединение с БД установлено");

    // синхронизируем все модели (создаёт таблицы, если нет)
    await sequelize.sync({ alter: true });
    console.log("Таблицы созданы или обновлены");
  } catch (err) {
    console.error("Ошибка при подключении к БД:", err);
  }
})();

bot.start();
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Ошибка у пользователя ${ctx.from?.username}:`, err.error);

  // Игнорируем 403 ошибку (бот заблокирован)
  if ((err.error as any).error_code === 403) {
    console.warn(`Пользователь ${ctx.from?.id} заблокировал бота`);
    return;
  }

  // Остальные ошибки просто логируем
  console.error("Ошибка:", err);
});

console.log("🤖 Бот запущен!");
