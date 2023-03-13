const BOT_REGREX = {
  config: /config/,
  weekDays: /^(?:sun(?:day)?|mon(?:day)?|tue(?:sday)?|wed(?:nesday)?|thu(?:rsday)?|fri(?:day)?|sat(?:urday)?)$/i,
  weekOptions: /^(?:[A-D][1-9]?|No sabe?|Vacaciones?|Presencial?|Teletrabajo?|Remove?)$/,
  writeSheet: /write/,
  enableCron: /Cron on/,
  disableCron: /Cron off/,
  cronStatus: /Cron info/,
};

export default Object.freeze(BOT_REGREX);
