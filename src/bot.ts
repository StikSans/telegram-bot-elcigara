import {
  Bot,
  session,
  MemorySessionStorage,
  Context,
  SessionFlavor,
} from "grammy";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error("BOT_TOKEN не найден в .env");
}

// описываем, что хранится в сессии
export interface SessionData {
  name?: string;
  step?: "askName" | "done";
  username?: string;
  city?: string;
}

// создаём расширенный контекст с сессией
export type MyContext = Context & SessionFlavor<SessionData>;

const storage = new MemorySessionStorage<SessionData>();

// создаём бота с этим контекстом
export const bot = new Bot<MyContext>(process.env.BOT_TOKEN);
bot.use(session({ initial: (): SessionData => ({}), storage }));
