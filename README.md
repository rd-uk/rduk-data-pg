# RDUK - PostgreSQL Data Provider

[![Build Status](https://travis-ci.org/rd-uk/rduk-data-pg.svg?branch=master)](https://travis-ci.org/rd-uk/rduk-data-pg)
[![Coverage Status](https://coveralls.io/repos/github/rd-uk/rduk-data-pg/badge.svg?branch=master)](https://coveralls.io/github/rd-uk/rduk-data-pg?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/rd-uk/rduk-data-pg.svg)](https://greenkeeper.io/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This module is an implementation of `@rduk/data/lib/base` for [PostgreSQL](https://www.postgresql.org/).

## Installation

[`pg`](https://www.npmjs.com/package/pg) is a peer dependency. Don't forget to add this module to your project.

```sh
npm i @rduk/data-pg pg
```

## Configuration

```yaml
---
connections:
  -
    name: conn1
    user: ${PG_USER}
    password: ${PG_PASSWORD}
    database: ${PG_DB_NAME};
data:
  default: pg
  providers:
    -
      name: pg
      type: '@rduk/data-pg'
      connection: conn1
  query:
    provider: '@rduk/data-pg/queryProvider' # manage specific pg syntax

```

See [`@rduk/configuration`](https://github.com/rd-uk/rduk-configuration#readme) for more information.

## Usage

### Insert

First, create a QueryProvider

```js
const Visitor = require('@rduk/data/lib/sql/visitor/expression')
const PostgreSQLQueryProvider = require('@rduk/data-pg/lib/queryProvider')

const provider = new PostgreSQLQueryProvider(Visitor)
```

Next, prepare an `InsertExpression`

```js
const InsertExpression = require('@rduk/data/lib/sql/expression/insert')
const SourceExpression = require('@rduk/data/lib/expression/source')

let expression = new InsertExpression(new SourceExpression('users'))
let obj = new ObjectLiteralExpression([
    new FieldExpression('email', new PropertyExpression(new NameExpression('this'), 'email')),
    new FieldExpression('username', new PropertyExpression(new NameExpression('this'), 'username')),
    new FieldExpression('password', new PropertyExpression(new NameExpression('this'), 'password')),
    new FieldExpression('salt', new PropertyExpression(new NameExpression('this'), 'salt'))
])
let assignment = new LambdaExpression(obj, [])
expression.assignments.push(assignment)
```

Finally, execute your query

```js
provider.execute(expression, {
    email: 'kimung@mail.test',
    username: 'kimung',
    password: '$2y$10$jMA23KsnU7kMQq1Wlr6PbOJWb0kD1j1P1RDdylfL739XE3gcX7UWq',
    salt: '5f7086760c3d96f5f90faac2f46c59940d83d8c84df5beef3725d8d8f02171b1'
}).then(result => {
    console.log(result);
})

/**
 * The pool.query method of pg module will be called with:
 *   - command: 'INSERT INTO users (email, username, password, salt) VALUES ($1, $2, $3, $4) RETURNING *'
 *   - parameters: [
 *       'kimung@mail.test',
 *       'kimung',
 *       '$2y$10$jMA23KsnU7kMQq1Wlr6PbOJWb0kD1j1P1RDdylfL739XE3gcX7UWq',
 *       '5f7086760c3d96f5f90faac2f46c59940d83d8c84df5beef3725d8d8f02171b1',
 *     ]
 * 
 */
```

## License and copyright

See [LICENSE](LICENSE) file.