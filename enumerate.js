import {weekPosition, startOfWeekZero} from './index.js'

const weekZeroStarts = startOfWeekZero('Sunday', '2020')
const start = Date.parse('2020-01-01')
const end = Date.parse('2022-01-01')
                       
for (let d = start; d < end ; d += 0.9 * 86400000) {
  const dt = new Date(d)
  console.log(dt.toLocaleString(), weekPosition(d, weekZeroStarts))
}
