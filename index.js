//
// Makes no real attempt to be internationalized, except that you can
// make weeks start whenever you want.
//
// Key point: week number 1 is the first full week of the year.
//
// Totally different logic from
// https://en.wikipedia.org/wiki/ISO_week_date (in which week 1 "has
// the year's first working day in it, if Saturdays, Sundays and 1
// January are not working days."
//


import dbg from 'debug'

const debug = dbg('weekmath')

export const weekdaysLowerCase = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
]
const msInDay = 86400000
const msInWeek = 7 * msInDay

export function weekNumber (date, weekZeroStarts) {
  if (!weekZeroStarts) weekZeroStarts = startOfWeekZero()
  date = getDateObject(date)
  return Math.floor((date - weekZeroStarts) / msInWeek)
}

// Very similar to Date.getDay(), except allows the week to start
// at arbitrary time, and *IT IS FLOATING POINT* which is nice for
// graphic displays.  Round/floor/ceil if you want.
export function daysIntoWeek (date, weekZeroStarts) {
  if (!weekZeroStarts) weekZeroStarts = startOfWeekZero()
  date = getDateObject(date)
  return ((date - weekZeroStarts) % msInWeek) / msInDay
}

export function weekPosition (date, weekZeroStarts) {
  if (!weekZeroStarts) weekZeroStarts = startOfWeekZero()
  date = getDateObject(date)
  const weekNumber = Math.floor((date - weekZeroStarts) / msInWeek)
  const daysIntoWeek = ((date - weekZeroStarts) % msInWeek) / msInDay
  return [weekNumber, daysIntoWeek]
}

// Week zero is the week containing dec 31st of the previous year.
// Week zero has 0-6 days of this year in it
// Week one always havs 7 days of this year in it
export function startOfWeekZero(day, date) {
  day = parseDayNumber(day)
  if (day < 0) throw RangeError('cannot understand your day-the-week-starts-on value')
  date = getDateObject(date)
  const firstDateOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1) - 86400000)
  debug('first day of %o starts %o', date, firstDateOfYear)
  const offset = firstDateOfYear.getUTCDay() - day
  debug({firstDateOfYear, gd: firstDateOfYear.getUTCDay(), day, offset})
  // debug('Year of %o starts on a %o so offset is %o, weeks starts on %o')
  const ms = firstDateOfYear - offset * 86400000
  return ms
}

export function getDateObject (param) {
  if (param) {
    if (!param?.toISOString && !param?.getTime) param = new Date(param)
  } else {
    param = new Date()
  }
  return param
}

// Sunday = 0, per JS
export function parseDayNumber (day) {
  if (typeof day === 'number') return day
  if (day === undefined) return 0
  day = day.toLowerCase()
  for (let index = 0; index < 7; index++) {
    const text = weekdaysLowerCase[index]
    if (text === day || text.startsWith(day)) return index
  }
  return -1
}
