if (!process.env.TOKEN) {
    require(`dotenv`).load();
}

const {
    TOKEN,
    USERNAME = ``,
} = process.env;

const Telegraf = require(`telegraf`);
const session = require(`telegraf/session`);
const bot = new Telegraf(TOKEN, {
    username: USERNAME,
});

bot.use(session({
    property: `theme`,
    getSessionKey: ctx => {
        const message = ctx.callbackQuery &&
            ctx.callbackQuery.message.reply_to_message ||
            ctx.message;

        if (!ctx.chat || !ctx.from || !message) return;
        return `${ctx.chat.id}:${ctx.from.id}:${message.message_id}`;
    },
}));

require(`./middleware`)(bot);
require(`./handlers`)(bot);

bot.startPolling();
// eslint-disable-next-line no-console
console.log(`@${USERNAME} is running...`);
