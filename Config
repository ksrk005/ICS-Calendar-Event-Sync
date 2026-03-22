var eventsGroup = new Map();
var offsetsGroup = new Map();

const config = {
	"version" : "1.0.0",
	"env" : "PROD",
	"calendar" : {
		"rangeDay" : { "delete" : 15, "copy" : 15 },
		"keyword" : { "default" : "WORK", "symbol" : " === ", "cancel" : "cancel", "decline" : "decline", "begin" : "BEGIN:VEVENT", "until" : "UNTIL", "rrule" : "RRULE", "dtStart" : "DTSTART", "dtEnd" : "DTEND", "recID" : "RECURRENCE-ID", "uID" : "UID", "summary" : "SUMMARY", "description" : "DESCRIPTION", "freq" : "FREQ", "daily" : "DAILY", "weekly" : "WEEKLY", "monthly" : "MONTHLY", "yearly" : "YEARLY", "interval" : "INTERVAL", "byDay" : "BYDAY", "byMonth" : "BYMONTH", "standard" : "STANDARD", "daylight" : "DAYLIGHT" },
		"regex" : {
			"byDay" : { "expression" : "^(?<g1>[+-])?(?<g2>\\d+)?(?<g3>MO|TU|WE|TH|FR|SA|SU)$", "group" : { "sign" : "g1", "ordinal" : "g2", "weekDay" : "g3" } },
			"eventsMultipleLine" : { "expression": "(\\r\\n)+", "flag" : "g", "replace" : "\n" },
			"eventsLineStart" : { "expression": "\\n[ \\t]", "flag" : "g", "replace" : "" },
			"eventHeading" : { "expression": "[;:]", "group" : 0 },
			"eventContent" : { "expression": ":(?<g1>.+)", "group" : "g1" },
			"timeZone" : { "expression": ";", "group" : { "heading" : 0, "content" : 1 } },
			"timeZoneData" : { "expression": "BEGIN:VTIMEZONE(?<g1>[\\s\\S]*?)END:VTIMEZONE", "group" : "g1", "flags" : "g" },
			"timeZoneID" : { "expression": "TZID:(?<g1>[^\\r\\n]+)", "group" : "g1" },
			"timeZoneOffsetTo" : { "expression": "TZOFFSETTO:(?<g1>[+-]\\d{4})", "group" : "g1" },
			"rrule" : { "expression": "RRULE:(?<g1>[^\\r\\n]+)", "group" : "g1" },
			"time" : { "expression": "BEGIN:(?<g1>STANDARD|DAYLIGHT)?(?<g2>[\\s\\S]*?)END:(?:\\1|VTIMEZONE)", "group" : { "mode" : "g1", "content" : "g2" }, "flags" : "g" } },
		"destination" : { "id" : "GIVE EMAIL ID WHERE YOU WANT TO ADD EVENTS" },
		"source" : [ {
			"keyword" : "GIVE KEYWORD FOR EVENT WHICH WILL BE APPEND AT START OF EVENT NAME", "icsURL" : "GIVE ICS URL OF EVENT TO BE COPIED" } ] },
	"dateTime" : {
		"weekDayMap" : {  "SU" : 0, "MO" : 1, "TU" : 2, "WE" : 3, "TH" : 4, "FR" : 5, "SA" : 6 },
		"zone" : { "local" : "Asia/Kolkata", "global" : "UTC", "Z" : "UTC", "Indian Standard Time" : "Asia/Kolkata", "Central Standard Time" : "America/Chicago" },
		"format" : { "log" : "yyyy-MM-dd HH:mm:ss" },
		"regex" : {
			"calendarAPITimeZone" : { "expression" : "TZID=(?<g1>.+?)[:;,]|(?<g1>[^0-9T])", "group" : "g1" },
			"calendarAPIDateTime" : { "expression" : "(?<g1>\\d{8}T\\d{6})|(?<g1>\\d{8})", "group" : "g1" } } },
	"delay" : { "sleep" : 2000 },
	"locale" : { "us" : "en-US", "ca" : "en-CA" },
	"log" : {
		"level" : {
			"info" : { "keyword" : "INFO", "icon" : "ℹ️" },
			"warn" : { "keyword" : "WARN", "icon" : "⚠️" },
			"error" : { "keyword" : "ERROR", "icon" : "❌" },
			"debug" : { "keyword" : "DEBUG", "icon" : "🐛" } },
		"phase" : { "start" : "START", "success" : "SUCCESS", "end" : "END", "failure" : "FAILURE", "stop" : "TERMINATION" },
		"regex" : {
			"lineNumber" : { "expression" : ":(?<g1>\\d+:\\d+)\\)", "result" : -1, "group" : "g1" },
			"taskName" : { "expression" : "at\\s+(?<g1>.*?)\\(", "result" : -1, "group" : "g1" } } } };
