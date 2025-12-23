import { MyContext } from "../bot";
import { InlineKeyboard } from "grammy";
import dotenv from "dotenv";
dotenv.config();

const spreadsheetId = process.env.SCHEDULE_ID;
const sheetName = "По датам";

export const getTochCommand = async (ctx: MyContext) => {
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
    const headers = data.table.cols.map((col: any) => col.label).filter(Boolean);

    // убираем первые две колонки (День недели, Дата)
    const points = headers.slice(2).filter((h: string) => h.trim() !== "");

    if (!points.length) {
      await ctx.reply("Точки не найдены");
      return;
    }

    // создаём клавиатуру с кнопками
    const keyboard = new InlineKeyboard();

    points.forEach((point: string) => {
      keyboard.row().text(point, `get_point:${point}`);
    });

    await ctx.reply("Выбери точку:", { reply_markup: keyboard });
  } catch (err) {
    console.error(err);
    await ctx.reply("Произошла ошибка при получении данных");
  }
};
