const shiftDays = (d, offset) => (d.setDate(d.getDate() + offset), d);
const parseByDay = (byDay) => ( m = byDay.match(config.calendar.regex.byDay.expression), { ordinal: m[config.calendar.regex.byDay.group.ordinal] ? parseInt(m[config.calendar.regex.byDay.group.ordinal], 10) * (m[config.calendar.regex.byDay.group.sign] === '-' ? -1 : 1) : null, weekday: m[config.calendar.regex.byDay.group.weekDay] } );
function findFreqDaily(freqDate, start, current, upto, interval) {
	try {
		for (let i = new Date(start); i <= upto; i.setDate(i.getDate() + interval))
			if (i >= current && i <= upto)
				freqDate.add(i.toLocaleDateString(config.locale.ca));
		return freqDate; }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); } }
function findFreqWeekly(freqDate, start, current, upto, interval, byDays) {
	try {
		for (let i = shiftDays(new Date(start),-start.getDay()); i <= upto; shiftDays(i, interval * 7))
			for (let byDay of byDays) {
				let date = shiftDays(new Date(i), config.dateTime.weekDayMap[byDay]);
				if (date >= current && date <= upto)
					freqDate.add(date.toLocaleDateString(config.locale.ca)); }
		return freqDate; }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); } }
function findFreqMonthly(freqDate, start, current, upto, interval, byDays) {
	try {
		for (let year = start.getFullYear(), month = start.getMonth(); year < upto.getFullYear() || (year == upto.getFullYear() && month <= upto.getMonth()); month += interval) {
			if (!byDays || byDays.size == 0) {
				let date = new Date(year, month, start.getDate());
				if (date >= current && date <= upto)
					freqDate.add(date.toLocaleDateString(config.locale.ca)); }
			else
				for (let byDay of byDays) {
					let parsed = parseByDay(byDay), targetDow = config.dateTime.weekDayMap[parsed.weekday], days = [];
					for (let date = new Date(year, month, 1); date.getMonth() === month - 1; date.setDate(date.getDate() + 1)) if (date.getDay() === targetDow)
						days.push(new Date(date));
					if (days.length === 0) continue;
					let date = parsed.ordinal > 0 ? days[parsed.ordinal - 1] : parsed.ordinal < 0 ? days[days.length + parsed.ordinal] : days[0];
					if (date >= current && date <= upto)
						freqDate.add(date.toLocaleDateString(config.locale.ca)); }
			if (month > 11) (month = 0, year += 1); }
		return freqDate; }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); } }
function findFreqYearly(freqDate, start, current, upto, interval, byDays, byMonths) {
	try {
		for (let year = start.getFullYear(); year <= upto.getFullYear(); year += interval)
			if (!byDays || byDays.size == 0) {
				let date = new Date(year, Array.from(byMonths)[0] - 1, start.getDate());
				if (date >= current && date <= upto)
					freqDate.add(date.toLocaleDateString(config.locale.ca)); }
			else
				for (let byDay of byDays) {
					let parsed = parseByDay(byDay), targetDow = config.dateTime.weekDayMap[parsed.weekday], days = [];
					for (let date = new Date(year, Array.from(byMonths)[0] - 1, 1); date.getMonth() === Array.from(byMonths)[0] - 1; date.setDate(date.getDate() + 1)) if (date.getDay() === targetDow)
						days.push(new Date(date));
					if (days.length === 0) continue;
					let date = parsed.ordinal > 0 ? days[parsed.ordinal - 1] : parsed.ordinal < 0 ? days[days.length + parsed.ordinal] : days[0];
					if (date >= current && date <= upto)
						freqDate.add(date.toLocaleDateString(config.locale.ca)); }
		return freqDate; }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); } }
function findFreqDate(freqDate, rEvent, start, current, upto) {
	try {
		const freq = rEvent[config.calendar.keyword.freq] || config.calendar.keyword.weekly, interval =  Number(rEvent[config.calendar.keyword.interval]) || 1, byDays = rEvent[config.calendar.keyword.byDay] ? new Set(rEvent[config.calendar.keyword.byDay].split(",")) : new Set(), byMonths = rEvent[config.calendar.keyword.byMonth] ? new Set(rEvent[config.calendar.keyword.byMonth].split(",").map(Number)) : new Set();
		switch (freq) {
			case config.calendar.keyword.daily:
				findFreqDaily(freqDate, start, current, upto, interval); break;
			case config.calendar.keyword.weekly: default:
				findFreqWeekly(freqDate, start, current, upto, interval, byDays); break;
			case config.calendar.keyword.monthly:
				findFreqMonthly(freqDate, start, current, upto, interval, byDays); break;
			case config.calendar.keyword.yearly:
				findFreqYearly(freqDate, start, current, upto, interval, byDays, byMonths); break; } }
	catch(exp) { log(exp.stack ?? exp, func, config.log.level.error); throw(config.log.phase.stop); } }
