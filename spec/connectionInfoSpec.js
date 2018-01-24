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
const PostgreSQLConnectionInfo = require('../lib/connectionInfo')

describe('connection', function () {
  describe('instantion', function () {
    describe('without username', function () {
      it('should throw a ConfigurationError', function () {
        expect(function () {
          try {
            let conn = new PostgreSQLConnectionInfo()
            conn.test()
          } catch (err) {
            expect(err.message).toBe('PostgreSQL configuration: user missing.')
            throw err
          }
        }).toThrowError(errors.ConfigurationError)
      })
    })

    describe('without password', function () {
      it('should throw a ConfigurationError', function () {
        expect(function () {
          try {
            let conn = new PostgreSQLConnectionInfo({
              user: 'dbuser'
            })
            conn.test()
          } catch (err) {
            expect(err.message).toBe('PostgreSQL configuration: password missing.')
            throw err
          }
        }).toThrowError(errors.ConfigurationError)
      })
    })

    describe('without database', function () {
      it('should throw a ConfigurationError', function () {
        expect(function () {
          try {
            let conn = new PostgreSQLConnectionInfo({
              user: 'dbuser',
              password: 'azerty'
            })
            conn.test()
          } catch (err) {
            expect(err.message).toBe('PostgreSQL configuration: database missing.')
            throw err
          }
        }).toThrowError(errors.ConfigurationError)
      })
    })

    describe('without host and port', function () {
      it('should load default parameters', function () {
        let conn = new PostgreSQLConnectionInfo({
          user: 'dbuser',
          password: 'azerty',
          database: 'mydb'
        })

        expect(conn.host).toBe('localhost')
        expect(conn.port).toBe(3211)
      })
    })
  })

  describe('identifier', function () {
    it('should be generated with connection parameters', function () {
      let conn1 = new PostgreSQLConnectionInfo({
        user: 'dbuser',
        password: 'azerty',
        database: 'mydb'
      })
      let identifier1 = conn1.identifier
      expect(identifier1).toBe('default://dbuser@localhost:3211/mydb')

      let conn2 = new PostgreSQLConnectionInfo({
        user: 'dbuser',
        password: 'azerty',
        database: 'mydb',
        host: 'pg.rduk.fr'
      }, 'pg')
      let identifier2 = conn2.identifier
      expect(identifier2).toBe('pg://dbuser@pg.rduk.fr:3211/mydb')
    })
  })
})
