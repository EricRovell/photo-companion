## Changelog

### 2.25.2

- Fixed error within `service-worker` that prevented version upgrade;

### 2.25.1

- Fixed missing gauge separator (apparent in Moon section);

### 2.25.0

- Remove PWA quick actions;
- Load entire application assets in the background to provide full offline functionality after initial web application startup (previously assets loaded lazily upon navigation);
- Fixed an issue due to which the cache for older versions of the application was not cleared after the next update;

### 2.24.0

- Translations are loaded on demand;

### 2.23.0

- Improved web-application's SEO;
- Title updates during navigation;
- Fixed inconsistent `lang` attribute;

### 2.22.2

- Fix loading wrong initial tab (sometimes it even caused app crash);
- Fix navigation items focus indicator being cropped;
- Fix loader being invisible due the broken styles;

### 2.22.1

- Fix gauge chart flickering transition issues on some mobile devices;
- Fix gauge chart clipping shadow issues on some mobile devices;
- Remove tap highlight on mobile devices;
- "Changelog" and "FAQ" loads language-specific content upon request;
- Loader is shown when some deferred content is loaded;
- Small form element visual improvements;

### 2.22.0

- Page 404;
- Improved navigation. Wider screens have enough space but not all tab-sections would be visible. Not there are no upper limits for maximum active tabs. On smaller screens there will be visible up to 4 top chosen tabs. All links are always accessible via side-menu;
- Timeline event are now more symmetric on where the screen not yet small but already not wide enough;
- Scroll-bars for wides screens now have custom stylization;
- Fixed wrong "Bridges SPb" navigation period message, the correct countdown is shown;
- To the moon data added a full moon name when it's a full moon;
- Fixed a problem with invalid sun events being rendered, (during White nights for example);
- Next lights event countdown now based on chosen datetime (previously is was based on current datetime);
- Saint-Petersburg Drawbridges section now supports the same date-time input as all other application sections. It makes the experience more coherent and as the information is shown for a specific date-time, that makes easier to plan activities dependant on drawbridges operations;
- Side panel for drawbridges section was redesigned and now shows a list of all drawbridges state for a given moment;
- New section "Now" where the most important information is gathered in one place;
- The "navigation mode" settings option was removed. For most users this options was misleading and unclear. Another reason is that the drawbridges section supports the date-time input. The navigation is taken into account automatically behind the scenes, and the in formation is displayed via side-panel;
- Settings was reworked, now feature set is automatically connected to the chosen city;

### 2.21.1

- Use the correct label for language settings;
- Fix the incorrect time and timer output (used 24 hour cycle);

### 2.21.0

- English language support;

### 2.20.2

- The duration calculations (daylight, moonlights, lights) was fixed;
- Wrong moon phases order in "The Moon Phases Calendar" fix;
- The Moon data calculations optimizations (phases were calculated where they were not needed);
- Nadir sun time calculations were reworked to include it when the nadir is in the future day to include in within the current local date;

### 2.20.1

- Page common elements do not rerender (visually) upon navigation;
- Date-time input now has dedicated transition;

### 2.20.0

- Gesture navigation transitions were improved;
- Gesture navigation is now direction aware;

### 2.19.0

**Important**: all user settings will be purged.

- New settings options "Tabs" to control what tabs should be activated and their order;
- The "Saint-Petersburg Drawbridges" tab behavior was simplified to take only navigation period into account;
- The option to turn off the lights city completely was removed in favor of deactivating the tab in "Tabs" option;
- The options order was changed to be more relevant;
- The wrong data upon moonset was fixed (it was the same for moonrise);

### 2.18.0

- New navigation tab for small-width devices;
- The navigation tab visuals were improved for wide-screen devices;
- The application crash due wrong lights city settings was fixed;
- Upon gesture based navigation the viewport scrolls to the top;

### 2.17.1

- The problem with odd text-wrapping in information card was fixed;
- The font-size for smaller devices was tuned;

### 2.17.0

- Additional information card was added to "The Lights" tab;
- Additional information card was added to "The Sun" tab;
- Additional information card was added to "The Moon" tab;
- The timer card was removed from "The Lights" tab, the information was placed to the card;
- The Sun times ranges were added to the times diagram;
- The missing elevation graph pointers fix for Safari devices;

### 2.16.0

- The elevation graph for the Sun was added;
- The elevation graph for the Moon was added;
- The times diagram size was made a bit smaller;
- The autoscroll behavior was improved: not it activated only on navigation, not during all URL changes;

### 2.15.0

- The sunrise and sunset events now renders information about azimuth;
- The moonrise and moonset events now renders information about azimuth;

### 2.14.2

- Navigation gestures parameters improved to be more user friendly;
- Non-aesthetic text wrapping fixes;
- Better font for time rendering text on times diagram;

### 2.14.1

- Fixed wrong city lights name rendering;
- Fixed glitch scrolling during navigation;

### 2.14.0

- Gestures navigation support for sensor devices;

### 2.13.0

- Current time pointer added to times diagram. It visible when simple time pointer is a little bit far from current time;

### 2.12.0

- Time pointer (connected to date-time input) added to times diagram;

### 2.11.1

- Fixed error when geoposition data with increased precision (more than 6 digits) could not be set;
- The "Disallow list" option was renamed to "Events filter" for better user experience;

### 2.11.0

- Saint-Petersburg lights schedule update;
- New "Settings" section;
- Drawbridges events support;
- Moscow city lights schedule support;

### 2.10.0

- New "Saint-Petersburg Drawbridges" tab;

### 2.9.2 - 2.9.5

- The hidden contents problem on Apple devices is fixed;

### 2.9.1

- Links contrast was set to recommended;
- Font is preloaded to remove visual glitch upon opening;
- Timeline events links have accessible titles;

### 2.9.0

- Timeline events that is happening at given date-time how has a special indicator;
- Timeline events became links to a given date-time;
- During load the geoposition data asked to render the data properly;

### 2.8.1

- The semantics for calculated output were improved;
- The overflowing text on smaller screen devices was fixed;

### 2.8.0

- "City Lights" tab renders the lights duration for a given date;
- "The Sun" tab renders the daylight duration for a given date;
- Some events marked as *secondary*. It is used for smaller timelines to make specific events less significant for a user;
- "City Lights" tab has smaller timeline to connect the lights events with sunrise and sunset;
- "The Moon" tab has smaller timeline to connect the moon events with sunrise and sunset;

### 2.7.0

- Changelog is now available as separate page via version number;
- Wrong moon times data fix for dates when the Moon was only rising or only setting during the day;
- Moon illustration takes into consideration zenith angle to show proper rotation;
- Moon phase name and illumination percentage is rendered in "The Moon" tab;

### 2.6.0

- PWA update notifications support. The update will be installed upon restart or refreshing the page;

### 2.5.0

- All tabs has the same date-time input field to control what data to render;
- Timeline renders all events from *the given date*, not only for the next 3 days;
- Date-time value sync with URL, this makes it possible to share the state via link;
- PWA quick-actions now have correct links;
- User-friendly handling the wrong date-time input;

### 2.4.0

- Timeline supports sun times events;
- Timeline events shows up secondary information;
- Moon timeline events displays the phase and the rotation of the moon at that time;

### 2.3.0

- Mobile layout improvements;
- Wide-screen layout improvements;
- PWA quick-actions;
- Navigation uses URL instead of state;

### 2.2.1

- Fixed date-time control icons;
- Fixed application crash caused by invalid date-time input;

### 2.2.0

- Unnecessary Moon phases calculations fix;
- The diagram supports animated transitions;
- The Moon Phases calendar was added;

### 2.1.1

- The Moon illustration supports animations;
- The Moon illustration edge glitches fixed;

### 2.1.0

- "Ephemerids" tab functionality is separated into "The Sun" and "The Moon" tabs;
- The Moon illustration is rendered via donut diagram;
- The Sun illustration is rendered via donut diagram;

### 2.0.0

- The web-application renamed to "Photo Companion";
- Application aggregates more data, besides only city-lights schedule. The aggregated data calculated without network usage, that's the core of the application and it's future development;
- PWA functionality improved;

### 1.0.0

- The first public release;
