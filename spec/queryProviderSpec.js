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

describe('insert stmt generation', function () {
  it('should success', function (done) {
    const FieldExpression = require('@rduk/expression/lib/parser/expression/field')
    const LambdaExpression = require('@rduk/expression/lib/parser/expression/lambda')
    const NameExpression = require('@rduk/expression/lib/parser/expression/name')
    const ObjectLiteralExpression = require('@rduk/expression/lib/parser/expression/object')
    const PropertyExpression = require('@rduk/expression/lib/parser/expression/property')
    const SourceExpression = require('@rduk/data/lib/expression/source')
    const InsertExpression = require('@rduk/data/lib/sql/expression/insert')

    const Visitor = require('@rduk/data/lib/sql/visitor/expression')
    const QueryProvider = require('../lib/queryProvider')

    const provider = new QueryProvider(Visitor)

    let expression = new InsertExpression(new SourceExpression('users'))
    let obj = new ObjectLiteralExpression([
      new FieldExpression('email', new PropertyExpression(new NameExpression('this'), 'email')),
      new FieldExpression('username', new PropertyExpression(new NameExpression('this'), 'username')),
      new FieldExpression('password', new PropertyExpression(new NameExpression('this'), 'password'))
    ])
    let assignment = new LambdaExpression(obj, [])
    expression.assignments.push(assignment)

    let command = provider.getCommand(expression)
    expect(command).toBe('INSERT INTO users (email, username, password) VALUES (?<email>, ?<username>, ?<password>) RETURNING *')

    provider.execute(expression, {
      email: 'dummy@mail.test',
      username: 'dummy',
      password: '123456'
    }).catch(err => {
      expect(err).toBeDefined()
      expect(err.message).toBeDefined('connect ECONNREFUSED 127.0.0.1:3211')
      done()
    })
  })
})
