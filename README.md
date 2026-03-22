# ICS-Calendar-Event-Sync

# Work Calendar Sync Automation using Google Apps Script (ICS → Google Calendar)

## Overview
This project automates syncing events from external ICS (iCalendar) sources into a target Google Calendar.

It was built to overcome limitations in syncing enterprise work calendars with personal tools like Alexa, enabling reliable event reminders.

---

## Problem Statement
- Enterprise Microsoft accounts cannot be directly integrated with Alexa  
- Native ICS sync in Google Calendar is:
  - One-way
  - Infrequent (~3–4 times/day)
- This leads to missed or delayed meeting reminders  

---

## Solution
Developed a Google Apps Script-based automation to:

- Fetch events from one or more ICS sources  
- Parse and filter event data  
- Create events in a personal Google Calendar  
- Improve sync frequency using scheduled triggers  

---

## Configuration

All user inputs are managed through a centralized configuration object.

```json
{
  "destination": {
    "id": "GIVE EMAIL ID WHERE YOU WANT TO ADD EVENTS"
  },
  "source": [
    {
      "keyword": "GIVE KEYWORD FOR EVENT WHICH WILL BE APPEND AT START OF EVENT NAME",
      "icsURL": "GIVE ICS URL OF EVENT TO BE COPIED"
    }
  ]
}
