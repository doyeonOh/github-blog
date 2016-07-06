---
title: Typescript + ExpressJs 시작하기
date: 2016-06-30 09:07:02
tags: [typescript, nodejs, expressjs]
categories: [Typescript]
---
![](typescript-express-nodejs.jpg)

최근 [Angular2.0](https://angular.io/) 을 스터디 하면 [Typescript](http://www.typescriptlang.org/)를 알게 되었다. 사용하면서 모든 javascript에 적용을 시키면 정말 편할꺼 같아서 개인적으로 Restful Api 서버를 만들어 보고, 그걸을 토대로 기록을 남긴다.

# 시작하기 및 설정
시작하기 전에 먼저 설치를 해야된다.
- [NodeJs](https://nodejs.org/en/) 6버젼 이상을 추천한다.(es2015지원이 빵빵하다!)
- [Typescript](http://www.typescriptlang.org/)

NodeJs는 해당 홈페이지 들어가서 다운로드를 받고 설치하면 문제 없지 진행 할 수 있다.
Typescript 설치는 터미널을 열고 아래와 같이 npm으로 간편하게 설치가 가능하다.
```bash
npm install -g typescript
```

## 1. 프로젝트 설정
```bash
mkdir myapp
cd myapp
npm init
```
npm init을 했을시 package.json을 생성시켜주지만 직접 파일로 만들어도 된다.

> package.json
 : 필요한 노드 모듈을 정의하고 프로젝트 설명이 기록되어 있다. 또한 npm 실행 script도 사용할수 있다.

```javascript package.json
{
  "name": "myapp",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}

```
초기 셋팅을 하면 위와 같이 된다.

## 2. expressJs 설치
```bash
npm install --save express
```
위와 같이 express 설치를 하면 package.json에 아래와 같이 추가가 된다.
```bash
"dependencies": {
    "express": "^4.14.0"
  }
```
## 3. typings
> typings
 : 타입스크립트에서 사용되는 모듈 혹은 라이브러리 등등의 정의가 있는 파일이다.(쉽게 말해 자동완성 기능을 해준다.) 기능과 사용법 자세한 설명은 [Typings](https://github.com/typings/typings)에서 보자

설치와 설정은 아래와 같다.
```bash
npm install -g typings
typings init
```
typings init을 하면 typings.json이 생성된다. 여기에 우리가 설치한 Definition File들이 기록된다.
> NodeJs를 통해 사용되는 모듈뿐만 아니라 그 이외의 수많은 Definition이 있기 때문에 검색 후 설치하는 것을 권장한다. typings search [모듈이름] 으로 찾을 수 있으며, typings install로 설치가 가능하다.

typings.json이 만들어졌으면, 우리가 사용한 모듈이랑 노드에 대해 설치를 하자.
```bash
typings install env~node --save --global
typings install dt~express --save --global
```
위의 문법은 [Typings](https://github.com/typings/typings)에 가면 설명나와 있다.

> 아마 위에 2개만 설치하고 타입스크립트 컴파일을 하면 에러가 떨어질 것이다. 이유는 express 정의 파일안에 serve-static, express-serve-static-core 파일을 import 하는 부분이 있다. 또 serve-static 안에 mime라는 정의를 임포트 하기 때문에 같이 설치한다.


```bash
typings install dt~serve-static --save --global
typings install dt~express-serve-static-core --save --global
typings install dt~mime --save --global
```

설치가 완료 되면 typings.json을 보면 아래와 같이 되어 있다.
```
{
  "name": "myapp",
  "dependencies": {},
  "globalDependencies": {
    "express": "registry:dt/express#4.0.0+20160317120654",
    "express-serve-static-core": "registry:dt/express-serve-static-core#0.0.0+20160625155614",
    "node": "registry:env/node#6.0.0+20160622202520",
    "mime": "registry:dt/mime#0.0.0+20160316155526",
    "serve-static": "registry:dt/serve-static#0.0.0+20160606155157"
  }
}
```
먼저 파일을 만들고 위와 같이 작성후 `typings install`로 한꺼번에 설치가 가능하다.

> 모든 모듈, 라이브러리 등등에 정의 파일이 존재하지 않는다. 그래서 정의 파일을 사용하지 않아도 오류 없이 사용이 가능하다.`const redisStore = require("connect-redis");` 이와 같이 선언하면 정의 파일 없이도 에러 없이 사용 가능하다.

## 4. typescript 설정
typescript를 사용하면 tsconfig.json라는 파일을 만들어서 설정을 진행 할 수 있다. 자세한 설명은 [공식홈페이지](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)에서 확인 할 수 있다.

```bash tsconfig.json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "moduleResolution": "node",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": false,
    "noImplicitAny": false
  },
  "exclude": [
    "typings",
    "node_modules"
  ]
}
```
위의 내용으로 파일을 만든다.

이제 거의 완성이 되었다. 이렇게 되면 아래와 같은 구조가 된다.(하위 폴더는 생략)
```text
├── node_modules
├── typings
├── package.json
├── typings.json
└── tsconfig.json
```

# 코딩 시작
여기까지 오셨으면 설치 및 설정까지 완료된 것이다. 이제부턴 코드를 작성하겠다.
es2015를 기반으로 사용할것이며, 기본적으로 es2015를 공부하면 좀더 좋다. 물론 es5로 코딩도 가능하다.
post, get, delete, put 메소드를 사용하여 {result : Hello world}를 리턴을 목표로 한다

## 1. 테스트 코드 만들기
우리가 만든 예제가 잘 돌아가는지 테스트를 하기 위해 mocha를 이용하여 테스트 코드를 만든다. 테스트 코드에 대해서는 설명을 하진 않겠다.
``` bash
npm install -g mocha
npm install --save-dev should
npm install --save-dev supertest

typings install dt~mocha --save --global
typings install dt~should --save --global
```
위에 것들을 다 설치하면 바로 test 폴더를 만들고 그안에 app.spec.ts 파일을 만든다.

```javascript ./test/app.spec.ts
const request = require('supertest');
require('should');

const server: any = request.agent('http://localhost:3000');

describe('테스트 시작', () => {
    it('GET', done => server.get('/').expect(200).expect("Content-type",/json/)
        .end((err, res) => {
            if(err) throw err;
            res.body.should.be.a.Object();
            res.body.should.have.property('result');
            res.body.result.should.equal('Hello World');
            done();
        }));
    it('POST', done => server.post('/').expect(200).expect("Content-type",/json/)
        .end((err, res) => {
            if(err) throw err;
            res.body.should.be.a.Object();
            res.body.should.have.property('result');
            res.body.result.should.equal('Hello World');
            done();
        }));
    it('DELETE', done => server.delete('/').expect(200).expect("Content-type",/json/)
        .end((err, res) => {
            if(err) throw err;
            res.body.should.be.a.Object();
            res.body.should.have.property('result');
            res.body.result.should.equal('Hello World');
            done();
        }));
    it('PUT', done => server.put('/').expect(200).expect("Content-type",/json/)
        .end((err, res) => {
            if(err) throw err;
            res.body.should.be.a.Object();
            res.body.should.have.property('result');
            res.body.result.should.equal('Hello World');
            done();
        }));
});
```
이제 테스트 코드도 만들었겠다. 슬슬 본격적인 코딩에 들어가겠다.

## 2. app.ts
서버에 대한 설정을 하는 역활을 한다. 이 글에서는 간단하게 router랑 기본 설정말 할것이며, 이후 logging, db(mongo,mysql etc)설정, session(redis, cookie)등의 설정은 다루지 않겠다.

완성까지는 아니지만 express + typescript + mongodb 를 활용하여 만든 [github](https://github.com/mayajuni/blog/tree/master/server-node)를보면 알 수 있다. 그안에 logging부터 restapi 테스트까지 전부 있다.

코딩하는 방법은 여러가지가 있겠지만 es2015의 [Class](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes)를 사용하겠다.

```javascript app.ts
import * as express from "express";

export class Server {
    /* app에 대한 타입 설정 */
    public app: express.Application;

    constructor() {
        /* express 설정을 위한 express 선언 */
        this.app = express();
        /* 라우터 */
        this.router();

        /* Not Foud */
        this.app.use((req: express.Request, res: express.Response, next: Function) => {
            /**
             *  Error이라는 정의가 있지만 Error에는 status라는 정의가 없어서 any 설정
             *  (아마 typescript로 개발하다보면 any를 많이 쓰게된다)
             */
            const err: any = new Error('not_found');
            err.status = 404;
            next(err);
        });

        /* 에러 처리 */
        this.app.use((err: any, req: express.Request, res: express.Response) => {
            err.status  = err.status || 500;
            console.error(`error on requst ${req.method} | ${req.url} | ${err.status}`);
            console.error(err.stack || `${err.message}`);

            err.message = err.status  == 500 ? 'Something bad happened.' : err.message;
            res.status(err.status).send(err.message);
        });
    }

    private router() {
        /**
         * 에러 처리를 좀더 쉽게 하기 위해서 한번 감싸준다.
         * es7에 제안된 async await를 사용하여 에러처리시 catch가 되기 편하게 해준 방식이다.
         * http://expressjs.com/ko/advanced/best-practice-performance.html#section-10 을 참고하면 좋다.
         */
        const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);
        //get router
        const router: express.Router = express.Router();

        //get
        router.get("/", wrap(async (req, res) => {
            res.status(200).json({result: "Hello World"})
        }));

        //post
        router.post("/", wrap(async (req, res) => {
            res.status(200).json({result: "Hello World"})
        }));

        //put
        router.put("/",  wrap(async (req, res) => {
            res.status(200).json({result: "Hello World"})
        }));

        //delete
        router.delete("/",  wrap(async (req, res) => {
            res.status(200).json({result: "Hello World"})
        }));

        this.app.use(router);
    }
}
```
위의 라우터 부분은 추후 한번 더 블로깅 하겠다. 자세하게 보고 싶으면 [expressJs 성능 우수 사례의 올바른 예외처리(프로미스 사용)](http://expressjs.com/ko/advanced/best-practice-performance.html#section-10)를 참고하면 된다.

## 3. server.ts
app.ts에 설정된 내용을 가지고 서버를 만들고 스타트 하는 역활을 한다. 물론 app.ts에서 해도 되지만 확정성을 고려하여 따로 분리한다.

 ```javascript server.ts
import {Server} from './app';
import * as express from "express";

/* 따로 설정하지 않았으면 3000 port를 사용한다. */
const port: number = process.env.PORT || 3000;
const app: express.Application = new Server().app;
app.set('port', port);

app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + port);
}).on('error', err => {
    console.error(err);
});
 ```

##  4. server run
타입 스크립트는 한번 컴파일을 하지 않으면 js 파일이 생성되지 않는다 그렇게 때문에 꼭 컴파일을 해야된다.
```bash
tsc --p tsconfig.json
```
이렇게 하면 ts파일 이외의 js 파일과 js.map 파일이 생성된다.

> ts 파일이 위치한 곳에 생성되기 때문에 안좋아 보일수 있다. gulp나 grunt를 사용하면 해결 할 수 있다.

```bash
node server
```
위와 같이 하면 서버가 구동된다.
![](서버구동.PNG)

구동 까지 완료 되었으면, 처음에 만든 테스트를 실행 하여, 제대로 되는지 확인한다.
```bash
mocha
```
mocha만 치면 프로젝트의 test폴더 안에 있는 모든 테스트 파일을 구동한다.
이제 결과는 아래와 같다.
![](테스트결과.PNG)

물론 웹으로 요청 한 것도 볼 수 있다.
![](웹결과.PNG)

마지막으로 package.json에 script 추가한다.
```bash package.json
{
  "name": "myapp",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "npm run tsc & mocha",
    "start": "npm run tsc && node server",
    "tsc": "tsc --p tsconfig.json"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.14.0"
  },
  "devDependencies": {
    "mocha": "^2.5.3",
    "should": "^9.0.2",
    "supertest": "^1.2.0"
  }
}
```

아주 기본적인 구동 및 테스트만 했다.
언제든 궁금한 사항이나 버그, 오류가 있을 시 mayajuni10@gmail.com으로 이메일 주시거나 혹은 아래의 댓글로 남겨주시면 수정 및 최대한 아는 범위에서 답변 하겠다.

테스트로 만든 예제 또한 [github](https://github.com/mayajuni/myapp)에 공개되어 있어 볼수 있다.

`반말로 블로그를 작성하였는데 이해해주시기 바랍니다.`
