import { MyContext } from "../bot";
import parseDateString from "../utils/dateParser";

const spreadsheetId = "1LjUp9pNod7bcG01XhRQsC0lLLSYRyMJrNSg9-4PnULM";
const sheetName = "По датам";

export const scheduleCommand = async (ctx: MyContext) => {
  if (!ctx.session.name) {
    await ctx.reply("Сначала зарегистрируйтесь командой /start");
    return;
  }
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    const jsonText = text.match(
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

    // формируем сообщение
    let reply = `🗓 Расписание для ${ctx.session.name}:\n\n`;

    const userName = ctx.session.name.trim().toLowerCase();

    rows.forEach((row: any) => {
      const date = row[1]?.name || "";

      // ищем имя в ячейках (начиная с 3-й колонки)
      const cell = row.slice(2).find(
        (c: any) => c.name?.trim().toLowerCase() === userName, // убираем пробелы и приводим к нижнему регистру
      );
      const shift = cell?.label || "Выходной";

      if (!date) return;

      reply += `${parseDateString(date)}: ${shift}\n`;
    });

    await ctx.reply(reply);
  } catch (err) {
    console.error(err);
    await ctx.reply("Произошла ошибка при получении расписания");
  }
};
