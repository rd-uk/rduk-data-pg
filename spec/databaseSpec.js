/**
 * MIT License
 *
 * Copyright (c) 2016 - 2018 RDUK <tech@rduk.fr>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* eslint-env jasmine */

'use strict'

const errors = require('@rduk/errors')
const PoolMock = require('./helpers/poolMock')
const PostgreSQLConnectionInfo = require('../lib/connectionInfo')
const PostgreSQLDatabase = require('../lib/database')

describe('database', function () {
  let pool = new PoolMock()
  let database = new PostgreSQLDatabase(pool)

  describe('method execute', function () {
    it('should success', function (done) {
      let cmd = 'test'
      let args = ['test']
      database.execute(cmd, args)
        .then(result => {
          expect(Array.isArray(result)).toBe(true)
          done()
        })
    })
  })

  describe('method dispose', function () {
    it('should success', function () {
      spyOn(pool, 'release')
      database.dispose()
      expect(pool.release).toHaveBeenCalled()
    })
  })

  describe('static create without connection', function () {
    it('should throw an ArgumentError', function () {
      expect(function () {
        PostgreSQLDatabase.create()
      }).toThrowError(errors.ArgumentError)
    })
  })

  describe('static get without connection', function () {
    it('should throw an ArgumentError', function () {
      expect(function () {
        PostgreSQLDatabase.get()
      }).toThrowError(errors.ArgumentError)
    })
  })

  describe('static get with same connection info', function () {
    it('should return previous instanciated database', function () {
      spyOn(PostgreSQLDatabase, 'create').and.returnValue({db: 'test'})
      let conn = new PostgreSQLConnectionInfo({
        user: 'test',
        password: 'password',
        database: 'db'
      })
      let db = PostgreSQLDatabase.get(conn)
      expect(PostgreSQLDatabase.get(conn)).toBe(db)
      PostgreSQLDatabase.create.and.stub()
    })
  })
})
