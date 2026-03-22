const defaultKey = config.calendar.keyword.default + config.calendar.keyword.symbol;
function deleteAllEventsFromInputCalendar(cal, key = defaultKey) {
	const func = deleteAllEventsFromInputCalendar;
	try {
		log(config.log.phase.start, func);
		const now = new Date(), start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - config.calendar.rangeDay.delete), end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + config.calendar.rangeDay.delete); let counter = 0;
		for(const event of cal.getEvents(start, end, { search: key })) {
			if (!event.getTitle().startsWith(key)) continue;
			event.deleteEvent(); counter++; if (counter % 20 === 0) Utilities.sleep(config.delay.sleep); }
		log(config.log.phase.success, func); }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); }
	finally { log(config.log.phase.end, func); } }
function deleteAllEventsFromAllCalendars(key = defaultKey) {
	for (const cal of CalendarApp.getAllCalendars()) {
		const now = new Date(), start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - config.calendar.rangeDay.delete), end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + config.calendar.rangeDay.delete); let counter = 0;
		for(const e of cal.getEvents(start, end, { search: key })) {
			if (!e.getTitle().startsWith(key)) continue;
			e.deleteEvent(); counter++; if (counter % 20 === 0) Utilities.sleep(config.delay.sleep); } } }
function listAllEventsFromInputCalendar(cal, key = defaultKey) {
	const now = new Date(), start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - config.calendar.rangeDay.delete), end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + config.calendar.rangeDay.delete);
	for(const e of cal.getEvents(start, end, { search: key })) if (e.getTitle().startsWith(key)) Logger.log(`${e.getTitle()} | ${e.getStartTime()} → ${e.getEndTime()}`); }
function listAllEventsFromAllCalendars(key = defaultKey) {
	for (const cal of CalendarApp.getAllCalendars()) {
		const now = new Date(), start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - config.calendar.rangeDay.delete), end   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + config.calendar.rangeDay.delete);
		for(const e of cal.getEvents(start, end, { search: key })) if (e.getTitle().startsWith(key)) Logger.log(`${e.getTitle()} | ${e.getStartTime()} → ${e.getEndTime()}`); } }
function listAllCalendars() {
	for (const cal of CalendarApp.getAllCalendars()) Logger.log(`Name: ${cal.getName()}; ID: ${cal.getId()}`); }
function fetchByURL(url) {
	const func = fetchByURL;
	try {
		log(config.log.phase.start, func);
		const rawData = UrlFetchApp.fetch(url).getContentText();
		extractTimeZoneMap(rawData);
		for (const event of extractEvents(rawData)) {
			if (event[config.calendar.keyword.uID] == "") continue;
			if (!eventsGroup.has(event[config.calendar.keyword.uID])) eventsGroup.set(event[config.calendar.keyword.uID], []);
			eventsGroup.get(event[config.calendar.keyword.uID]).push(event); }
		log(config.log.phase.success, func); }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); }
	finally { log(config.log.phase.end, func); } }
function copyEventsToCalendar(cal, key = defaultKey) {
	const func = copyEventsToCalendar;
	try {
		log(config.log.phase.start, func);
		for (const [uid, events] of eventsGroup) {
			events.sort((a, b) => a[config.calendar.keyword.dtStart].datetimeLocal - b[config.calendar.keyword.dtStart].datetimeLocal);
			let rEvent = {}, skipDates = new Set(), freqDate = new Set(), counter = 0;
			for (const event of events) {
				const sum = event[config.calendar.keyword.summary], desc = event[config.calendar.keyword.description], dtEnd = event[config.calendar.keyword.dtEnd].datetimeLocal, dtStart = event[config.calendar.keyword.dtStart].datetimeLocal;
				if (!dtStart || !dtEnd) continue;
				if (event[config.calendar.keyword.freq]) { rEvent= event; continue; }
				skipDates.add(dtStart.toLocaleDateString(config.locale.ca));
				if (sum.toLowerCase().startsWith(config.calendar.keyword.cancel)||sum.toLowerCase().startsWith(config.calendar.keyword.decline)) continue;
				if (dtEnd < new Date ()) continue; 
				if (dtStart > new Date ().setDate(new Date().getDate()+config.calendar.rangeDay.copy)) break;
				cal.createEvent(key+sum, dtStart, dtEnd, {description : desc});
				counter++; if (counter % 20 === 0) Utilities.sleep(config.delay.sleep); }
			if (Object.keys(rEvent).length === 0) continue;
			const rsum = rEvent[config.calendar.keyword.summary], rdesc = rEvent[config.calendar.keyword.description], rdtEnd = rEvent[config.calendar.keyword.dtEnd].datetimeLocal, rdtStart = rEvent[config.calendar.keyword.dtStart].datetimeLocal, rdtUntil = rEvent[config.calendar.keyword.until].datetimeLocal;
			if (rsum.toLowerCase().startsWith(config.calendar.keyword.cancel)||rsum.toLowerCase().startsWith(config.calendar.keyword.decline)) continue;
			if (rdtUntil < new Date ()) continue;
			const current = ((d, n = new Date()) => d > n ? d : (d.toDateString() === n.toDateString() ? new Date(n.setDate(n.getDate() + 1)) : n))(rdtStart), upto = ((d, n = new Date(), m = new Date(n.setDate(n.getDate() + config.calendar.rangeDay.copy))) => d < m ? d : m)(rdtUntil);
			findFreqDate(freqDate, rEvent, rdtStart, current, upto);
			for (const curr of freqDate) {
				if (skipDates.has(curr)) continue;
				const rds = convertDateTime(curr+"T"+rEvent[config.calendar.keyword.dtStart].datetimeReceived.split("T")[1], rEvent[config.calendar.keyword.dtStart].zoneReceived), rdt = convertDateTime(curr+"T"+rEvent[config.calendar.keyword.dtEnd].datetimeReceived.split("T")[1], rEvent[config.calendar.keyword.dtEnd].zoneReceived);
				let meetStart = new Date(new Date(curr).setHours(rds.getHours(), rds.getMinutes(), rds.getSeconds(), 0)), meetEnd = new Date(new Date(curr).setHours(rdt.getHours(), rdt.getMinutes(), rdt.getSeconds(), 0));
				counter++; if (counter % 20 === 0) Utilities.sleep(config.delay.sleep);
				cal.createEvent(key+rsum, meetStart, meetEnd, {description : rdesc}); } }
		log(config.log.phase.success, func); }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); }
	finally { log(config.log.phase.end, func); } }
