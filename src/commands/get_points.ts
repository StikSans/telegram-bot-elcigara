import { MyContext } from "../bot";
import { User } from "../models/user.model";
import parseDateString from "../utils/dateParser";

const spreadsheetId = "1LjUp9pNod7bcG01XhRQsC0lLLSYRyMJrNSg9-4PnULM";
const sheetName = "По датам";

export const getPoint = async (ctx: MyContext, pointName: string) => {
  const lowerName = pointName.trim().toLowerCase();

  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  try {
    const res = await fetch(url);
    const rawText = await res.text();
    const jsonText = rawText.match(
      /google\.visualization\.Query\.setResponse\((.*)\);/s,
    )?.[1];

    if (!jsonText) {
      await ctx.reply("Не удалось получить данные таблицы");
      return;
    }

    const data = JSON.parse(jsonText);
    const headers = data.table.cols.map((col: any) => col.label);
    const rows = data.table.rows.map((row: any) =>
      row.c.map((cell: any, idx: number) => ({
        name: cell?.v || null,
        label: headers[idx],
      })),
    );

    // ищем колонку с точкой
    const colIndex = headers.findIndex(
      (h: string) => h.toLowerCase() === lowerName,
    );
    if (colIndex === -1) {
      await ctx.reply(`Точка "${pointName}" не найдена`);
      return;
    }

    // формируем список по датам
    const schedule: string[] = [];

    for (const row of rows) {
      const dateStr = row[1]?.name; // дата в 2-й колонке
      if (!dateStr) continue;

      const personName = row[colIndex]?.name?.trim();
      if (!personName) continue;

      // ищем username в базе
      const user = await User.findOne({ where: { name: personName } });
      // console.log(user);

      const displayName = user
        ? `${user.name} (@${user.username ?? "без username"})`
        : personName;

      schedule.push(`${parseDateString(dateStr)}: ${displayName}`);
    }

    if (!schedule.length) {
      await ctx.reply(`На точке "${pointName}" никто не работает`);
      return;
    }

    await ctx.reply(
      `Сотрудники на точке "${pointName}":\n` + schedule.join("\n"),
    );
  } catch (err) {
    console.error(err);
    await ctx.reply("Произошла ошибка при получении данных");
  }
};

export const getPointsCommand = async (ctx: MyContext) => {
  const args = ctx.message!.text!.split(" ").slice(1);
  if (!args.length) {
    await ctx.reply("Используй: /get_points <название точки>");
    return;
  }
  const pointName = args.join(" ").toLowerCase();
  await getPoint(ctx, pointName);
};
