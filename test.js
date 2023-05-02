/* eslint-env jest */
import * as my from './index.js'
import dbg from 'debug'

const debug = dbg('weekmath/test')

test('getDateObject', async () => {
  const now = new Date()
  // hope not much time passed!
  expect(my.getDateObject().getTime()).toBe(now.getTime())
  expect(my.getDateObject(now).getTime()).toBe(now.getTime())
  expect(my.getDateObject('1996').getTime()).toBe((new Date('1996')).getTime())
})

test('parseDayNumber', async () => {
  expect(my.parseDayNumber(4)).toBe(4)
  expect(my.parseDayNumber('Sunday')).toBe(0)
  expect(my.parseDayNumber('sun')).toBe(0)
  expect(my.parseDayNumber('su')).toBe(0)
  expect(my.parseDayNumber('s')).toBe(0) // that's a choice
  expect(my.parseDayNumber('Sunday')).toBe(0)
  expect(my.parseDayNumber('Monday')).toBe(1)
  expect(my.parseDayNumber('Tuesday')).toBe(2)
  expect(my.parseDayNumber('Wednesday')).toBe(3)
  expect(my.parseDayNumber('Thursday')).toBe(4)
  expect(my.parseDayNumber('Friday')).toBe(5)
  expect(my.parseDayNumber('Saturday')).toBe(6)
  expect(my.parseDayNumber('Fakeday')).toBe(-1)
})

test('startOfWeekZero', async () => {
  const f = my.startOfWeekZero
  expect(() => f('2021-01-01')).toThrow()
  // 2023 starts on a sunday, so day 1 = week 1 daysIntoWeek 0,
  // so week 0 is entirely in prev year
  expect(f('Sunday', '2023-01-01')).toBe(Date.parse('2022-12-25'))
  expect(f('Sunday', '2022-01-01')).toBe(Date.parse('2021-12-26'))
  expect(f('Sunday', '2019-01-01')).toBe(Date.parse('2018-12-30'))
  expect(f('Sunday', '2018-01-01')).toBe(Date.parse('2017-12-31'))

  // same for later days in year
  expect(f('Sunday', '2023-12-31')).toBe(Date.parse('2022-12-25'))
  expect(f('Sunday', '2022-12-31')).toBe(Date.parse('2021-12-26'))
  expect(f('Sunday', '2019-12-31')).toBe(Date.parse('2018-12-30'))
  expect(f('Sunday', '2018-12-31')).toBe(Date.parse('2017-12-31'))

  // what if week starts on other days?
  expect(f('mo', '2023-01-01')).toBe(Date.parse('2022-12-26'))
  expect(f('tu', '2023-01-01')).toBe(Date.parse('2022-12-27'))
  expect(f('we', '2023-01-01')).toBe(Date.parse('2022-12-28'))
  expect(f('th', '2023-01-01')).toBe(Date.parse('2022-12-29'))
  expect(f('fr', '2023-01-01')).toBe(Date.parse('2022-12-30'))
  expect(f('sa', '2023-01-01')).toBe(Date.parse('2022-12-31'))

  expect(f()).toBe(f('su', new Date()))
})

test('weekPosition', async () => {
  expect(my.weekPosition('2023-01-01')).toEqual([1, 0])
  expect(my.weekPosition('2023-01-01T12:00:00.000Z')).toEqual([1, 0.5])
  expect(my.weekPosition('2023-01-02')).toEqual([1, 1])
  expect(my.weekPosition('2023-01-08')).toEqual([2, 0])
  expect(my.weekPosition('2023-12-31')).toEqual([53, 0])
})
