# Schedule data

## Illumination

### Saint-Petersburg, Russia

Illumination schedule for Saint-Petersburg, Russia has some repetitive structure, that will be used to *compress* the data.

What can be noticed is that the schedule changes every 5 days. Each month has the same date-ranges with the same schedule: 1-5, 6-10, 11-15, 16-20, 21-25, 26-.... This way each month is broken into 6 parts and we can get the right part by division by 5 (31 should be handled).

All the data is represented as an array with repetitive data as `[ ..., hours_on, minutes_on, hours_off, minutes_off, ... ]`, where the time range is stored.

So, how do we get the right data?

1. Imagine that every 4 items makes a new row;
2. The dataset has 6 rows for each month. The month number can give us the starting row as `(month * 6 - 6)` (taking 0-index into account);
3. The date should give as the offset required to get to the right row as `min((date - 1) // 5, 5)`, where `//` is integer division and `min` function used as the last range can be `26-31` for example;
4. As there are not real rows, we get the "imaginary" row using the fact that there are 4 items per collection we get index as such `row => row * 4`, and the next four items is the data we need.

Overall:

```ts
function getSchedule(month: number, date: number, data: number[]): number[] {
	const row = (month * 6 - 6) + Math.min(Math.floor((date - 1) / 5), 5);
	const index = row * 4;
	return data.slice(index, index + 4);
}
```
