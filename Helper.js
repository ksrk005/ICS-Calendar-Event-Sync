function convertDateTime(sourceDateTime, sourceZone) {
	const func = convertDateTime;
	try {
		const zone = config.dateTime.zone[sourceZone] ?? config.dateTime.zone.local;
		const [y, m, d] = sourceDateTime.split("T")[0].split("-").map(Number), [hh, mm, ss] = sourceDateTime.split("T")[1].split(":").map(Number);
		let date = new Date(Date.UTC(y, m-1, d, hh, mm, ss));
		date.setTime( date.getTime() + new Date(date.toLocaleString(config.locale.us, { timeZone: config.dateTime.zone.global })).getTime() - new Date(date.toLocaleString(config.locale.us, { timeZone: zone })).getTime() );
		return date; }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); } }
function getOffsetStartDate(date, rRule) {
	const func = getOffsetStartDate;
	try {
		let result;
		const rRuleParts = Object.fromEntries( rRule.split(";").map(p => p.split("=")) );
		const month = Number(rRuleParts[config.calendar.keyword.byMonth]), wdStr = rRuleParts[config.calendar.keyword.byDay].slice(-2), wdnth = rRuleParts[config.calendar.keyword.byDay].slice(0, -2), wdSign = rRuleParts[config.calendar.keyword.byDay].slice(0, -3) === "-" ? 0 : 1;
		result = new Date(date.getFullYear(), month - wdSign, 1);
		const wdNum= config.dateTime.weekDayMap[wdStr], firstDay = result.getDay(), delta = (wdNum- firstDay + 7) % 7;
		result.setDate(1 + delta + (wdnth - wdSign) * 7);
		result.setHours(2, 0, 0, 0);
		return result; }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); } }
function getOffset(date, zoneID) {
	const func = getOffset;
	try {
		const zone = offsetsGroup[zoneID]; if (!zone || !zone.daylight || !zone.daylight.rRule) return zone?.standard?.offsetHours ?? 0;
		if (date >= getOffsetStartDate(date, zone.daylight.rRule) && date < getOffsetStartDate(date, zone.standard.rRule)) return zone.daylight.offsetHours;
		return zone.standard.offsetHours; }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); } }
