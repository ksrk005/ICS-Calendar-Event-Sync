function log(mess, func, lvl = config.log.level.info) {
	try {
		const logFuncName = func.name;
		const logDateTimeFormat = config.dateTime.format.log?.trim() ? Utilities.formatDate(new Date(), Session.getScriptTimeZone(), config.dateTime.format.log): "";
		let logMess = mess; if(lvl.keyword == config.log.level.error.keyword) logMess = `${config.log.phase.failure} - ${logMess}`;
		Logger.log(`${lvl.icon}, ${lvl.keyword}, ${logFuncName}, ${logDateTimeFormat}, ${logMess}`); }
	catch(exp) { Logger.log(`${config.log.level.error.icon}, ${config.log.level.error.keyword}, ${logFuncName}, ${logDateTimeFormat}, ${exp.stack ?? exp}`); throw new Error(config.log.phase.stop); } }
