# Accuracy and model scope

The package uses UTC for Earth rotation and an Espenak/Meeus polynomial estimate
of ΔT to obtain terrestrial time for ephemerides. The Sun model includes a
date-dependent orbital solution, aberration, nutation, and true obliquity. The
Moon model evaluates all 60 longitude/distance terms and all 60 latitude terms
from Meeus tables 47.A and 47.B, then applies nutation and topocentric parallax.

The supported date range is 1800–2200. This is an accuracy scope, not support
for navigation, legal sunrise determinations, precision eclipse contact work,
or spacecraft operations. Refraction and the physical horizon vary with weather
and terrain. Eclipse calculations use smooth mean limbs and do not account for
lunar topography.

## Regression targets

| Quantity | Target in ordinary conditions |
| --- | ---: |
| Sun azimuth/altitude | 0.1° |
| Moon topocentric azimuth/altitude | 0.15° |
| Geocentric Moon distance | 50 km |
| Illuminated fraction | 0.002 absolute |
| Sun events | 90 seconds |
| Moon rise/set and principal phases | 2 minutes |
| Local eclipse contacts and maximum | 2 minutes |
| Local eclipse obscuration | 0.02 absolute |
| Lunar eclipse contacts and maximum | 2 minutes |
| Lunar penumbral/umbral magnitude | 0.02 absolute |
| High-latitude or grazing events | 5 minutes |

Static tests include Meeus's 1992-04-12 lunar-distance example, JPL Horizons
DE441 topocentric position samples, USNO 2025 rise/set/transit and principal
phase samples, and NASA local circumstances for partial, annular, total, and
horizon-clipped solar eclipses and NASA total, partial, and penumbral lunar
eclipse circumstances. The checked position samples differ from JPL by
about 0.003°; the checked USNO and NASA events agree at minute precision. These
fixtures are regression evidence, not a claim that every point in the full
range has been certified.

Primary references:

- Jean Meeus, *Astronomical Algorithms*, 2nd edition, chapters 10, 22, 25,
  40, 47–49.
- [NASA/JPL Horizons](https://ssd.jpl.nasa.gov/horizons/), DE441 observer ephemerides.
- [U.S. Naval Observatory Astronomical Applications API](https://aa.usno.navy.mil/data/api).
- [NASA local solar-eclipse circumstances](https://eclipse.gsfc.nasa.gov/SEmono/reference/locircT.html).
- [NASA Five Millennium Catalog of Lunar Eclipses](https://eclipse.gsfc.nasa.gov/LEcat5/catalog.html).
- [NASA enlargement of Earth's shadows](https://eclipse.gsfc.nasa.gov/LEcat5/shadow.html).
