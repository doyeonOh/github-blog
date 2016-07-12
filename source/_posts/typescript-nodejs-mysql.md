---
title: async/await를 이용한 mySql 모듈 만들기
date: 2016-07-12 08:53:11
tags: [typescript, nodejs, expressjs]
categories: [Typescript, nodeJs]
---
![](node.js-with-mysql.png)
nodeJs를 이용하여 mysql 혹은 mariaDB 등 RDB를 사용하는 경우가 많다. es7에 제안된 async/await를 사용하여 mysql 모듈을 만들어 볼까 한다.(모듈이라고 하지만 그저 wrapping 한거다.)

## 기존 사용 했던 mysql 코드
처음 mysql을 썼었을때 pool을 이용하여, 매번 connection을 맺고 끊어주고, 또 트랜젝션을 맺고 롤백과 commit을 해주는 코드를 썼다.

아마 대부분이 아래와 같을 것이다.:
```javascript
const mysql = require('mysql');
const DBpool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'example.org',
  user            : 'bob',
  password        : 'secret',
  database        : 'my_db'
});

const get = id => {
    DBpool.getConnection((err, con) => {
        if (err) {
            throw err;
        }
        con.query('select * from user where id= ?', [id], (err, data) => {
            con.release();
            ...
        });
    });
}
```
트랜젝션을 사용:
```javascript
// pool은 생략
const insert = id => {
    DBpool.getConnection((err, con) => {
        if (err) {
            throw err;
        }
        con.beginTransaction(err => {
            if (err) {
                con.release();
                throw err;
            }

            con.query('select * from user where id = ?', [id], (err, data) => {
                if(err) {
                    return con.rollback(() => {
                        con.release();
                        throw err;
                    });
                }

                con.query('insert into user (name) values (?)', [data[0].name], (err, data) => {
                    if(err) {
                        return con.rollback(() => {
                            con.release();
                            throw err;
                        });
                    }

                    con.commit((err) => {
                        if (err) {
                            return con.rollback(() => {
                                con.release();
                                throw err;
                            });
                        }
                        return con.release();
                    });
                });
                ...
            });
        });
    });
}
```

이렇게 되면 매번 db 작업을 할때마다 connection 맺어주고 끊어주는 중복된 코드를 작성해야되며, 트렌젝션을 맺을때는 콜백헬과 좀더 더 긴 코드를 매번 처리해줘야된다.

필자는 이렇게 하는 것이 너무나도 마음에 안들었고 매번 중복된 코드를 쓰는게 너무너무 귀찮아서 아래와 같이 만들어서 사용했다.

## 1. 시작하기
async/await를 사용하기 위해서는 [Babel](https://babeljs.io/)을 사용하거나 [Typescript](https://www.typescriptlang.org/) 같은 것을 사용해야된다. 필자는 Typescript를 사용하기 때문에 Typescript로 진행 하겠다.

기본 설정:
1. NodeJs 설치
2. Typescript 설치
3. Typings 설치

> 자세한 설정은 [Typescript + ExpressJs 시작하기](https://mayajuni.github.io/2016/06/30/typescript-express_%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0/)를 참고하여 진행하면 된다.

## 2. promise-mysql
async/await는 전에 [ExpressJs Error](https://mayajuni.github.io/2016/07/04/expressJs-error/)에서 설명 했듯이 모든 리턴은 promise로 받아야된다. 그래서 기존 mysql은 callback 기반이기 때문에 사용하지 못하고 npm에 있는 [promise-mysql](https://www.npmjs.com/package/promise-mysql) 모듈을 사용한다.

```bash
npm install --save promise-mysql
```
promise-mysql모듈은 typings에 없기 때문에 설치를 하지 않고 진행한다.

## 3. Module 만들기
기존에는 모든 함수에 connection 혹은 transaction을 맺고 끊는 혹은 콜백하고 커밋하는 코드를 넣어줬다. 이제 그부분을 분리하여, 모듈로 만들 것이다.

#### 1) connection
내가 생각하는 순서는 다음과 같다.:
 1. function을 받는다.
 2. 받은 function의 paramter들을  ["...args"](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/arguments)를 사용하여 args에 담는다.
 3. connection을 맺고 connection 객체를 생성한다.
 4. 받은 function을 connection객체와 함께 기존 paramter(args)를 넘겨주어 실행 시킨다.
 5. catch를 통해 error가 있을시 connection을 닫아주고 throw error을 해준다.
 6. error가 없을시에는 connection을 닫아주고 실행된 function을 값을 넘겨준다.

위와 같이 생각을 했으면, 아마 아래와 같은 코드가 나올 것이다.
```javascript
/**
 * 기존 import 하는 방식이 아닌 이유는 promise-mysql은
 * 정의 파일(typings)이 없기 때문에 아래와 같이 쓴다.
 */
const promiseMysql = require('promise-mysql');

const pool  = promiseMysql.createPool({
  connectionLimit : 10,
  host: 'example.org',
  user: 'bob',
  password: 'secret',
  database: 'my_db'
});

export const connect = fn => async (...args) => {
    /* DB 커넥션을 한다. */
    let con: any = await pool.getConnection();
    /* 로직에 con과 args(넘겨받은 paramter)를 넘겨준다. */
    const result = await fn(con, ...args).catch(error => {
        /* 에러시 con을 닫아준다. */
        con.connection.release();
        throw error;
    });
    /* con을 닫아준다. */
    con.connection.release();
    return result;
};
```

#### 2) 트렌젝션 모듈
트렌젝션 모듈도 위의 connection모듈과 크게 다르지 않을것이다. 그저 롤백과 커밋이 들어간것이다.
 1. function을 받는다.
 2. 받은 function의 paramter들을  ["...args"](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/arguments)를 사용하여 args에 담는다.
 3. connection을 맺고 connection 객체를 생성한다.
 4. 트렌젝션을 시작하는 코드를 넣는다.
 5. 받은 function을 connection객체와 함께 기존 paramter(args)를 넘겨주어 실행 시킨다.
 6. catch를 통해 error가 있을시 rollback과 connection을 닫아주고 throw error을 해준다.
 7. error가 없을시에는 commit과 connection을 닫아주고 실행된 function을 값을 넘겨준다.

위와 같이 생각을 했으면, 아마 아래와 같은 코드가 나올 것이다.
```javascript
// pool 생략
export const transaction = fn => async (...args) => {
    /* DB 커넥션을 한다. */
    const con: any = await pool.getConnection();
    /* 트렌젝션 시작 */
    await con.connection.beginTransaction();
    /* 비지니스 로직에 con을 넘겨준다. */
    const result = await fn(con, ...args).catch(async (error) => {
        /* rollback을 진행한다. */
         await con.rollback();
        /* 에러시 con을 닫아준다. */
        con.connection.release();
        throw error;
    });
    /* commit을 해준다. */
    await con.commit();
    /* con을 닫아준다. */
    con.connection.release();
    return result;
}
```
위와 같이 만든 모듈을 하나로 합치고 mysql모듈이라고 명칭하면 아래와 같다.
```javascript mysql.ts
/**
 * 기존 import 하는 방식이 아닌 이유는 promise-mysql은
 * 정의 파일(typings)이 없기 때문에 아래와 같이 쓴다.
 */
const promiseMysql = require('promise-mysql');
import * as dotenv from 'dotenv';

dotenv.config({
    silent: true,
    path: '.env'
});

const pool = promiseMysql.createPool({
    connectionLimit : 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

export module mysql {
    export const connect = fn => async (...args) => {
        /* DB 커넥션을 한다. */
        const con: any = await pool.getConnection();
        /* 로직에 con과 args(넘겨받은 paramter)를 넘겨준다. */
        const result = await fn(con, ...args).catch(error => {
            /* 에러시 con을 닫아준다. */
            con.connection.release();
            throw error;
        });
        /* con을 닫아준다. */
        con.connection.release();
        return result;
    };

    export const transaction = fn => async (...args) => {
        /* DB 커넥션을 한다. */
        const con: any = await pool.getConnection();
        /* 트렌젝션 시작 */
        await con.connection.beginTransaction();
        /* 비지니스 로직에 con을 넘겨준다. */
        const result = await fn(con, ...args).catch(async (error) => {
            /* rollback을 진행한다. */
             await con.rollback();
            /* 에러시 con을 닫아준다. */
            con.connection.release();
            throw error;
        });
        /* commit을 해준다. */
        await con.commit();
        /* con을 닫아준다. */
        con.connection.release();
        return result;
    }
}
```
이렇게 하면 mysql 모듈이 완성이다.

## 4. 사용법
일반 connection 사용:
```javascript
/* 위에 만든 mysql 모듈이다. */
import {mysql} from "mysql"

const get = mysql.connect((con: any, id: string) => con.query('select * from user', [id]));
```
너무 간단하게 한줄로 끝내버렸다. 물론 단순 select한 값을 리턴했기 때문에 위와 같이 한줄로 나올수 있는 것이다. 만약 다른 비지니스 로직이 있다고 하면 아래와 같다.
```javascript
/* 위에 만든 mysql 모듈이다. */
import {mysql} from "mysql"

const get = mysql.connect(async (con: any, id: string) => {
        const result = await con.query('select * from user', [id]);

        // ...비지니스로직...

        return result
    });
```
굳이 동기로 할 필요 없을시에는 async를 빼도 된다.

트랜젝션을 사용:
```javascript
/* 위에 만든 mysql 모듈이다. */
import {mysql} from "mysql"

const insert = mysql.transaction(async (con: any, id: string) => {
    const user = await con.query('select * from user where id = ?', [id]);
    await con.query('insert into user (name) values (?)', [user[0].name]);
    /* 리턴할 값이 없을시 그냥 return만 써도 된다. */
    return user;
});
```
트랜젝션을 사용하는 코드는 더욱더 짧아진 코드량을 볼 수 있다.

> 이 모듈에 대한 예제를 [github](https://github.com/mayajuni/async-await-mysql)에 올렸다. 한번 보면 좀더 이해하기 편할 것이다. 도움이 되었다면 위의 별도 한번 눌러 주는 센스!

`반말로 블로그를 작성하였는데 이해해주시기 바랍니다. 문의 및 수정 사항은 댓글이나 mayajuni10@gmail.com으로 이메일 보내주시기 바랍니다.`