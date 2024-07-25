## Motivation

Being passionate about the cityscape photography, I often have to wait for the city lights to turn on, sometimes I need the to know the exact time to plan the photos. The schedule of the city lights I am living in is published annually as document.

To look at a relatively small table, find the right date and to check the time is not a particularly difficult task. Nevertheless, I had an urge to simplify the task for myself and my colleagues by creating a minimalistic web-application to display the city lighting schedule in more meaningful way.

After some time I have got an idea to add more information, collect everything I need in one particular place. That's how the project was born in it's current state (v2.0 and above).

I could not just get the data and display it within the app. The curiosity pushed me to understand how data I needed could be calculated, how it actually works under the hood. Every data I needed I learned how to get it myself without using the libraries and services. The goal was to learn something new, implement it the way to and make the web-application standalone, lightweight and performant.

## Sections

The application view is broken into sections that user can activate and put in specific order. Some sections are available only for specific location.

### City Lights

This section renders the information about the city lights schedule for a given date and time.

The following cities schedule are supported:

- Saint-Petersburg, Russia — [source][lights-schedule-spb];
- Moscow, Russia — [source][lights-schedule-moscow];

**Important**: For another location the section and the data won't be available.

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

**Important**: This section is available only for Saint-Petersburg city location.

The status of drawbridges in St. Petersburg is displayed here according to the *permanent* schedule.

**Important**: sometimes short-term adjustments are made to the schedule in the event of holidays or repair work. Such changes in the application are not taken into account.

Using this section the **navigation period** should be taken into account. It is the period of time when bridges are actually operating.

The section displays:

- Schedule for all drawbridges in the form of diagrams;
- Current condition of drawbridges;
- Countdown to the nearest bridge draw or alignment;
- Countdown to the nearest alignment or draw among all the bridges;
- Time until the end or beginning of the navigation period;

### Timeline

This section aggregates various events into a single timeline. Events from the selected datetime until the end of the next day are displayed simultaneously. This makes it convenient to see events taking place at the turn of the day.

Certain events can be disabled completely.

**Important**: "City Lights" or "St. Petersburg Drawbridges" events may not be available depending on selected city location.

### Settings

In this section, the user has access to parameters to customize the application for himself.

User settings are stored locally on the device. When you clear the cache, they will disappear. In case of incompatible future updates, settings may be erased to prevent incompatibility errors. In such cases, this will be mentioned in the change logs page.

**Important:** In order for the settings to take effect, you must use the "Save" button.

#### Language

The language of the user interface can be specified. By default the system language is used.

#### City

The city of your location can be chosen. This option is crucial as it activates some functionality available only for specific location. By default St. Petersburg is chosen.

### Geoposition

Choosing city the geoposition data is being set up automatically. The city center is taken as default.

Geoposition data is necessary for the calculations accuracy of ephemeris data (Moon and Sun). Geoposition data can be entered manually or requested from the device. The data is stored directly on the device and is not used except for ephemeris calculations.

### Application Sections

Application sections can be deactivated (at least 1 section must be active) and their order can be changed.

### Event filters

Here you can filter events either individually or as a whole group.

## Notes

### Gauge chart

The **city lights**, **the Moon**, and **the Sun** sections use a gauge chart to visualize the data. It is important to understand that it displays events for a specific day. Sometimes, certain events span over a several days, for example, the Moon rose today and will set below the horizon only tomorrow. In such cases, a vertical divider appears on the diagram, cutting the scale; this makes it clear that events go beyond the day in question.

### Ephemeris calculations

Calculations take place entirely on the device and do not require a connection. It is important to understand that calculations may have a certain level of error to simplify the calculations complexity and memory consumption, but quite sufficient for usage and planning.

[lights-schedule-spb]: https://lensvet.spb.ru/grafik_raboty_naruzhnogo_osvescheni/
[lights-schedule-moscow]: https://domdata.ru/osveschenie-v-moskve
