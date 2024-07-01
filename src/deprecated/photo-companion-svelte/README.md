---
{
	"cover": {
		alt: "Photo Companion project logo",
		height: 500,
		src: "https://storage.yandexcloud.net/escapist-marginalia/covers/project-photo-companion.png",
		width: 500
	},
	"dateUpdated": "2023-10-29T22:40:00.000Z",
	"description": "Minimalistic photography toolkit progressive web application.",
	"featured": true,
	"keywords": [
		"web application",
		"PWA",
		"Svelte",
		"TypeScript"
	],
	"lang": "en",
	"maintained": true,
	"repository": "EricRovell/photo-companion",
	"slug": "/ru/projects/photo-companion",
	"title": "Photo Companion",
	"website": "https://photo-companion.vercel.app/"
}
---

## Motivation

Being passionate about the cityscape photography, I often have to wait for the city lights to turn on, sometimes I need the to know the exact time to plan the photos. The schedule of the city lights I am living in is published annually as document.

To look at a relatively small table, find the right date and to check the time is not a particularly difficult task. Nevertheless, I had an urge to simplify the task for myself and my colleagues by creating a minimalistic web-application to display the city lighting schedule in more meaningful way.

After some time I have got an idea to add more information, collect everything I need in one particular place. That's how the project was born in it's current state (v2.0 and above).

I could not just get the data and display it within the app. The curiosity pushed me to understand how data I needed could be calculated, how it actually works under the hood. Every data I needed I learned how to get it myself without using the libraries and services. The goal was to learn something new, implement it the way to and make the web-application standalone, lightweight and performant.

## Sections

The application view is broken into sections that user can activate and put in specific order.

### City Lights

This section renders the information about the city lights schedule for a given date and time.

The following cities schedule are supported:

- Saint-Petersburg, Russia — [source][lights-schedule-spb];
- Moscow, Russia — [source][lights-schedule-moscow];

The section contains the following data:

- The city schedule name;
- The schedule times for current datetime;
- State of city lights;
- Duration of city lights;
- Countdown until the city lights switches (for the current day);

In addition, the lights events are displayed in a timeline along with the times of sunrise and sunset, since these events are really interconnected with each other. Usually you have to wait for the lights after the sunset or you may try to catch the lights just before they are turned off before the sunrise.

### The Sun

This section displays all the necessary information regarding the Sun:

- Sunrise and sunset times;
- Time intervals that are important for photographing — the gold and the blue hours;
- Duration of a sun light;
- Azimuth, declination and zenith of the Sun;

All types sun times (twilight, zenith, nadir, and more) are displayed withing the timeline.

### The Moon

This section displays all the necessary information regarding the Moon:

- Moonrise and moonset times;
- Zenith, altitude, azimuth and parallax angle of the Moon;
- Duration of the lunar day;
- Distance from the Earth to the Moon;
- Current phase and the lunar surface illumination fraction;

A moon altitude chart can be especially helpful. It displays the position of the Moon relative to the horizon during the day. The height of the Sun is also displayed here for more convenient planning, since photographing the Moon is not always possible at a certain position of the Sun above the horizon.

For convenience, the Moon times along with the Sun times are presented within a timeline.

### St. Petersburg Drawbridges

This section is not enabled by default, as it makes little sense if the user is not located in St. Petersburg.

The status of drawbridges in St. Petersburg is displayed here according to the *permanent* schedule.

**Important**: sometimes short-term adjustments are made to the schedule in the event of holidays or repair work. Such changes in the application are not taken into account.

In addition, even when active, the tab may not appear in the navigation menu — it will only be active during the **navigation period** when bridges are actually operating. This behavior can also be customized, more on that a little later.

The section displays:

- Schedule for all drawbridges in the form of diagrams;
- Current condition of drawbridges;
- Countdown to the nearest bridge draw or alignment;
- Countdown to the nearest alignment or draw among all the bridges;
- Time until the end or beginning of the navigation period;

### Timeline

This section aggregates various events into a single timeline. Events from the selected datetime until the end of the next day are displayed simultaneously. This makes it convenient to see events taking place at the turn of the day.

Certain events can be disabled completely.

### Settings

In this section, the user has access to parameters to customize the application for himself.

User settings are stored locally on the device. When you clear the cache, they will disappear. In case of incompatible future updates, settings may be erased to prevent incompatibility errors. In such cases, this will be mentioned in the change logs page.

**Important:** In order for the settings to take effect, you must use the "Save" button.

### Geolocation

Geolocation data is necessary for the calculations accuracy of ephemeris data (Moon and Sun). Geolocation data can be entered manually or requested from the device. The data is stored directly on the device and is not used except for ephemeris calculations.

### Application Sections

Application sections can be deactivated (at least 2 sections must be active) and their order can be changed.

**Important**: the drawbridge section may still not appear if navigation has not yet started.

### St. Petersburg drawbridges

Here you can change the activation behavior of the section dedicated to drawbridges. By default, the tab appears during navigation. If necessary, the tab can be forcibly activated.

### City lights

Here you can select a city for which the city lighting schedule is available.

### Event filters

Here you can filter events either individually or as a whole group.

**Important**: Drawbridge events are *only* available while navigation is open. They cannot be forcibly activated.

## Features

### Versioning `localStorage`

`localStorage` is used to store application settings and the settings schema may change. It was necessary to provide versioning for the application to work correctly when schema is going to change.

### Service worker

As all the data is calculated withing the device without using any network connection, the web-application should work standalone. For this purpose, *service-worker* was written with the strategy [*network priority, default cache*][service-worker-strategy].

### View Transitions API

The project used [`View Transitions API`][view-transitions-api] for smoother transitions between sections (currently only on devices with touch input when using gestures). It was an extremely interesting experience overall, the API looks promising.

## Notes

### Gauge chart

The **city lights**, **the Moon**, and **the Sun** sections use a gauge chart to visualize the data. It is important to understand that it displays events for a specific day. Sometimes, certain events span over a several days, for example, the Moon rose today and will set below the horizon only tomorrow. In such cases, a vertical divider appears on the diagram, cutting the scale; this makes it clear that events go beyond the day in question.

### Ephemeris calculations

Calculations take place entirely on the device and do not require a connection. It is important to understand that calculations may have a certain level of error to simplify the calculations complexity and memory consumption, but quite sufficient for usage and planning.

[lights-schedule-spb]: https://lensvet.spb.ru/grafik_raboty_naruzhnogo_osvescheni/
[lights-schedule-moscow]: https://domdata.ru/osveschenie-v-moskve
[service-worker-strategy]: https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network-first-falling-back-to-cache
[view-transitions-api]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
