function extract(lineData, expression, grp) {
	const func = extract;
	try { return lineData.match(new RegExp(expression))?.groups?.[grp] ?? 0; }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); } }
function extractCommon(lineData, event) {
	const func = extractCommon;
	try { event[lineData.split(new RegExp(config.calendar.regex.eventHeading.expression))[config.calendar.regex.eventHeading.group]] = lineData.match(new RegExp(config.calendar.regex.eventContent.expression))?.groups[config.calendar.regex.eventContent.group] ?? "" }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); } }
function extractDateTimeZone(lineData, event) {
	const func = extractDateTimeZone;
	try {
		let dt = extract(lineData, config.dateTime.regex.calendarAPIDateTime.expression, config.dateTime.regex.calendarAPIDateTime.group);
		dt = `${dt.substring(0, 4)}-${dt.substring(4, 6)}-${dt.substring(6, 8)}T${dt.substring(9, 11) || "00"}:${dt.substring(11, 13) || "00"}:${dt.substring(13, 15) || "00"}`;
		const z = extract(lineData.split(config.calendar.regex.timeZone.expression)[config.calendar.regex.timeZone.group.content], config.dateTime.regex.calendarAPITimeZone.expression, config.dateTime.regex.calendarAPITimeZone.group);
		event[lineData.split(config.calendar.regex.timeZone.expression)[config.calendar.regex.timeZone.group.heading]] = {datetimeReceived: dt, zoneReceived: z, datetimeLocal: convertDateTime(dt,z)}}
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); } }
function extractRRule(lineData, event) {
	const func = extractRRule;
	try {
		if (!lineData) return null;
		lineData.substring(lineData.indexOf(":")+1).trim().split(";").forEach(p => {
				let [k, v] = p.split("="); if (!k) return;
				if(k == config.calendar.keyword.until) { 
					extractDateTimeZone(k+";"+v,event); return; }
				event[k] = v; }); }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); } }
function extractEvents(data) {
	const func = extractEvents;
	try {
		const events = [];
		data = data.replace(new RegExp(config.calendar.regex.eventsMultipleLine.expression, config.calendar.regex.eventsMultipleLine.flag), config.calendar.regex.eventsMultipleLine.replace).replace(new RegExp(config.calendar.regex.eventsLineStart.expression, config.calendar.regex.eventsLineStart.flag), config.calendar.regex.eventsLineStart.replace).split(config.calendar.keyword.begin).slice(1);
		data.forEach(oneData => {
			let event = {};
			oneData.split("\n").forEach(oneLine => {
				switch (oneLine.split(new RegExp(config.calendar.regex.eventHeading.expression))[config.calendar.regex.eventHeading.group].trim()) {
					case "": return;
					case config.calendar.keyword.rrule:
						extractRRule(oneLine, event); return;
					case config.calendar.keyword.dtStart: case config.calendar.keyword.dtEnd: case config.calendar.keyword.recID:
						extractDateTimeZone(oneLine, event); return;
					case config.calendar.keyword.uID: case config.calendar.keyword.summary: case config.calendar.keyword.description:
						extractCommon(oneLine, event); return;
					default: return; } });
			if (Object.keys(event).length) events.push(event); });
		return events; }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); } }
function extractTimeZoneMap(data) {
	const func = extractTimeZoneMap;
	try {
		function parseOffset(str) {
			const sign = str[0] === "-" ? -1 : 1, hh = Number(str.slice(1, 3)), mm = Number(str.slice(3, 5));
			return ((sign * (hh + (mm / 60)) * -1) - (new Date().getTimezoneOffset() / 60)); }
		function extractRRuleOffset(str) {
			const offset = str.match(config.calendar.regex.timeZoneOffsetTo.expression), rRule = str.match(config.calendar.regex.rrule.expression);
			return { offsetHours: offset ? parseOffset(offset.groups[config.calendar.regex.timeZoneOffsetTo.group]) : null, rRule: rRule ? rRule.groups[config.calendar.regex.rrule.group].trim() : null }; }
		for (const part of [...data.matchAll(new RegExp(config.calendar.regex.timeZoneData.expression, config.calendar.regex.timeZoneData.flags))]) {
			const zoneIDMatch = part.groups[config.calendar.regex.timeZoneData.group].match(config.calendar.regex.timeZoneID.expression); if (!zoneIDMatch) continue;
			const zoneID = zoneIDMatch.groups[config.calendar.regex.timeZoneID.group].trim().toLowerCase().replace(/\s+/g, "");
			const zone = { standard: null, daylight: null};
			for (const block of [...part.groups[config.calendar.regex.timeZoneData.group].matchAll(new RegExp(config.calendar.regex.time.expression, config.calendar.regex.time.flags))]) 
				if (block.groups[config.calendar.regex.time.group.mode] === config.calendar.keyword.standard || !block.groups[config.calendar.regex.time.group.mode]) zone.standard = extractRRuleOffset(block.groups[config.calendar.regex.time.group.content]);
				else if (block.groups[config.calendar.regex.time.group.mode] === config.calendar.keyword.daylight) zone.daylight = extractRRuleOffset(block.groups[config.calendar.regex.time.group.content]);
			offsetsGroup[zoneID] = zone; } }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); } }
