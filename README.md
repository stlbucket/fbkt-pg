# fbkt-pg
function bucket is an opinionated toolkit for building a postgres-backed(optionally, but really it's the only option right now) web server that helps to quickly pull together data in a JSON format to support web app development.

fbkt-pg adds postgres features to the stack.

usage:
```
npm install --save fbkt
```

you need to have installed ^postgres9.5.

configure a database and update the <a href="https://github.com/stlbucket/fbkt-pg/blob/master/config/dev/index.js">dev config</a> file accordingly

```
npm run buildDb
```

```
npm run test
```

```
npm run dev
```
