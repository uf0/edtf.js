'use strict'

const assert = require('assert')
const { parse } = require('./parser')
const { abs, floor } = Math

const V = new WeakMap()

class Century {
  static parse(input) {
    return parse(input, { types: ['Century'] })
  }

  constructor(input) {
    V[this] = []

    this.uncertain = false
    this.approximate = false

    switch (typeof input) {
    case 'number':
      this.century = input
      break

    case 'string':
      input = Century.parse(input)
      // eslint-disable-line no-fallthrough

    case 'object':
      if (Array.isArray(input))
        input = { values: input }

      {
        assert(input !== null)
        if (input.type) assert.equal('Century', input.type)

        assert(input.values)
        assert(input.values.length === 1)

        this.century = input.values[0]
        this.uncertain = !!input.uncertain
        this.approximate = !!input.approximate
      }
      break

    default:
      this.year = new Date().getUTCFullYear()
    }
  }

  get type() {
    return 'Century'
  }

  get century() {
    return this.values[0]
  }

  set century(century) {
    century = floor(Number(century))
    assert(abs(century) < 100, `invalid century: ${century}`)
    return this.values[0] = century
  }

  get year() {
    return this.values[0] * 100
  }

  set year(year) {
    return this.century = year / 100
  }

  get values() {
    return V[this]
  }

  get edtf() {
    return this.toEDTF()
  }

  get min() {
    return Date.UTC(this.year, 0)
  }

  get max() {
    return Date.UTC(this.year + 99, 11, 31, 24, 0, 0)
  }

  toEDTF() {
    let century = Century.pad(this.century)

    if (this.uncertain)
      century = century + '?'

    if (this.approximate)
      century = (century + '~').replace(/\?~/, '%')

    return century
  }

  static pad(number) {
    let k = abs(number)
    let sign = (k === number) ? '' : '-'

    if (k < 10)   return `${sign}0${k}`

    return `${number}`
  }
}

module.exports = Century