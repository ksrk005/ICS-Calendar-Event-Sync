function main() {
	Logger.log(`Time, TaskName, Level, Message`);
	const func = main;
	try {
		log(config.log.phase.start, func);
		const calendarSources = config.calendar.source.map(s => ({desCalID: config.calendar.destination.id, sourceCalICSURL: s.icsURL, sourceCalKey: s.keyword + config.calendar.keyword.symbol}));
		calendarSources.forEach(obj => { 
			eventsGroup.clear();
			log(`desCalID: '${obj.desCalID}'; sourceCalICSURL: '${obj.sourceCalICSURL}'; sourceCalKey: '${obj.sourceCalKey}'`, func);
			deleteAllEventsFromInputCalendar(CalendarApp.getCalendarById(obj.desCalID),obj.sourceCalKey);
			fetchByURL(obj.sourceCalICSURL);
			copyEventsToCalendar(CalendarApp.getCalendarById(obj.desCalID), obj.sourceCalKey); });
		log(config.log.phase.success, func); }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); }
	finally { log(config.log.phase.end, func); } }
