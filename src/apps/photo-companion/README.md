# Illumination Schedule for Saint-Petersburg

## Motivation

Being passionate about the cityscape photography, I often have to wait for the city lights to turn on, sometimes I need the exact time to plan photos. The schedule of city lighting is published annually on the state budgetary institution website [LenSvet][lensvet].

To look at a relatively small table, find the right date and to check the time is not a particulary difficult task. Nevertheless, I had an urge to simplify the task for myself and my collegues by creating a minimalistic web-application to display the city lighting schedule.

## The input

The published [schedule document][schedule] represents a table broken down by month. Entries are grouped by dates, as the schedule changes every few days. Some of the columns have no value for the application, such as *total burning time*. The application nees such columns as *month*, *date range*, *activation time*, and *deactivation time*.

The necessary data is written out manually as an array of integers. Such structure makes it compact and easy to work with. At the moment it is not, it has been decided not to waste time on implementing schedule document data parsing, since the document structure may change; also the dataset is not that big to get it by hand.

There are written some basic input validation tests. For example, the values of months cannot be outside of 1...12 range. Same logic is applied to dates and time.

## Functionality

### Countdown

While waiting for the lights to turn on (or being in a hurry before the lights turns off), I would like to know not just the time to constantly check the clock, but to see the remaining time before the event. For this reason, the countdown timer for the next event has become the primarily functionality for this web-applixation. In addition, the current state of the city lighting is displayed.

#### Implementation

As for the implementation, the schedule data is transformed into an array of [epoch time][epoch] for each time the city lights are switched. Thus the schedule data turns out into a time segment broken down into smaller segments:

- ...
- *turning on*: 1622505600000
- *turning off*: 1622592000000
- ...

Each such a segment represents a time between the same state. By comparing the current epoch time within each time segment we can find the current city lights state. Calculating the difference we get the data to setup the countdown. After the countdown finishes the next state is calculated, so there are no unnecessary calculations are performed until the event occurs.

### Displaying data by date

The countdown feature is fine when the planned shout takes time within 24 hours. The main reason the lighting schedule are so useful that it allows to better plan future shots. That's why displaying the schedule data by date is necessary.

#### Implementation

To display data for an arbitrary date there is no need to transform the input, as that was necessary for the countdown feature. The simple iteration using the data requested by the user allows to display the schedule time quite fast, so no optimisations were needed here.

### Progressive Web-Application

As the web-application will be used frequently, using the browser may be not convenient. It was a good idea to add the <abbr title="Progressive Web Apps">PWA</abbr> functionality; now the web-application can be installed and used more comfortably.

As the application is minimalistic and completely static it was decided to implement the [*network first, falling back to cache strategy*][service-worker-strategy]. Now the application can be used offline and it makes sense a lot.

## What I learned

Thanks to the project I implemented my first <abbr title="Progressive Web Apps">PWA</abbr>, wrote the first *service-worker*; I was extremely excited to learn about it's capabilities and see it in action.

[lensvet]: https://lensvet.spb.ru/grafik_raboty_naruzhnogo_osvescheni/
[schedule]: https://lensvet.spb.ru/d/26909/d/no-2023-gbu-utverzhden-1.pdf
[epoch]: https://www.epoch101.com/
[service-worker-strategy]: https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network-first-falling-back-to-cache
