---
title: Typescript + ExpressJs Error
date: 2016-07-04 09:25:35
tags: [typescript, nodejs, expressjs, router]
categories: [Typescript, express]
---
저번 포스트에서는 서버 구동에 대해서 포스팅했다. 이번에는 Error 처리에 대해 포스팅 하겠다.

## 기본적인 에러처리
```bash
app.get('/', (req, res) => {
    throw new Error('에러 발생')
})
app.use((err, req, res, next) => {
    console.log(err.message)
})
```
위와 같이 처리를 하면 큰 문제가 생긴다. 아래와 같이 callback을 받아 error 처리를 할 시 절대로 에러를 잡지 못한다.
```bash
app.get('/', (req, res) => {
    callback(error => {
        throw new Error('에러 발생')
    });
})

app.use((err, req, res, next) => {
    console.log(err.message)
})
```
그래서 하는 방식이 next를 통한 에러를 전달하는 방식이다.
```bash
app.get('/', (req, res, next) => {
    callback(error => {
        if(error) return next(error);

        callback2(error => {
            if(error) return next(error);
        });
    });
})
app.use((err, req, res, next) => {
    console.log(err.message)
})
```
이렇게 처리시 2가지의 문제점을 가지고 있다.
 * 로직 및 모든 부분에 Error 처리를 해줘야 한다.
    (이거 의외로 되게 유지보수하기 힘들고, 귀찮은 작업이다. 깜빡 한번하면 그냥 죽어버린다.)
 * 내가 Error 처리를 하지 못하는 부분에서는 Error처리를 할 수 없다.(모듈 안에서 에러가 났던가, 기타 등등)

> 위와 같은 문제 때문에 필자는 [node-domain-middleware](https://github.com/brianc/node-domain-middleware) 미들웨어를 사용하여 에러처리를 했다.(편하고 좋았다.) 하지만 [expressJs의 성능우수 사례](http://expressjs.com/ko/advanced/best-practice-performance.html#section-8)를 보면 도메인 사용을 권장하지 않고 더이상 사용되지 않는 모듈이라고 되어 있다.

## 프로미스를 이용한 에러 처리
es2015에 있는 [Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)를 이용하여 Error 처리 하는 방식이다.
```bash
app.get('/', (req, res, next) => {
    callback()
        .then(_ => {
            // 로직1
        })
        .then(_ => {
            // 로직2
        })
        .catch(next);
})
app.use((err, req, res, next) => {
    console.log(err.message)
})
```
위와 같이 하면 catch를 통해 promise로 처리하는 부분의 모든 error를 처리 할 수 있다. 위에 단점으로 적었던 2가지 전부를 해결 할 수 있다. 나의 생각 일 수 있지만 코드도 좀더 간결해 보인다(아닐수도 있다.)
하지만 여기서 코드를 좀더 간결하게 해보도록 하겠다. es7 스팩인 async/await를 이용할 것이다.

### async/await 이용한 에러 처리
 async/await가 다소 생소 할 수 있다. 비동기 코드를 동기화 간편하게 해주는 것이다. es7에 제안된 스팩이며, 자세한 내용은 [이곳](https://blogs.msdn.microsoft.com/typescript/2015/11/03/what-about-asyncawait/)을 보자. 구글 검색해도 많이 나온다.

> async/await 사용하기 위해서는 [Babel](https://babeljs.io/docs/usage/cli/) 혹은 [typescript](https://www.typescriptlang.org/) 등을 사용해야된다. 필자는 typescript를 사용한다.

 1. 처음에는 우선 아래와 같이 (req, res, next) 부분을 감싸도록 하겠다.
```bash
const wrap = fn => (...args) => fn(...args).catch(args[2]);
```
    ["...args"](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/arguments)는 es2015 문법이다. 이렇게 사용하면 args안에 parameter 값들이 순차적으로 들어가게된다.
    wrap은 함수를 받아서 그 함수를 실행 하고 catch를 통해 error가 발생시 next(error)을 해주는 역활이다. router에서는 기본적으로 paramter를 req, res, next를 주기 때문에 args[2]는 next 이다.

    이걸 풀어서 아래와 같이 할 수 있다.
```bash
const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);
```
 2. 만든 wrap을 아래와 같이 한다.
```bash
app.get('/', wrap(async (req, res, next) => {
    let data = await callback();
    let 로직1 = await 로직1();
    /* 리턴 값이 없음 아래와 같이 써도 된다. */
    await 로직2();
}))
app.use((err, req, res, next) => {
    console.log(err.message)
})
```
    코드를 보면 짐작하시겠지만 async/await를 통해 비동기 로직을 동기식으로 간편하게 로직처리 한다.

> 여기에도 유의점이 있다. 이것을 사용하기 위해서는 return promise 이어야된다. 단순 callback에 대한 처리를 할 수 없다. 하지만 많은 모듈 혹은 미들웨어가 promise를 제공(?)하기 때문에 사용하기에는 불편함이 없다.(기존 로직은 async/await로 처리하면되며, mongoose나 mysql 같은경우 이미  promise를 사용 할 수 있어 큰 불편이 없다.)

## 결론
직접 이렇게 하고 사용을 하면 생산성이 확실히 빨라진다. 코드도 짧아지고 가독성도 좋아 진다. 이렇게 한번 쓰기 시작하면서 모든 노드 프로젝트는 이 방식으로 개발하고 있다. 나는 이 방식(방법)을 추천한다.


##### 참고
 * [Asynchronous Error Handling in Express with Promises, Generators and ES7](https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/)
 * [프로덕션 우수 사례: 성능 및 신뢰성](http://expressjs.com/ko/advanced/best-practice-performance.html)

`반말로 블로그를 작성하였는데 이해해주시기 바랍니다. 문의 및 수정 사항은 댓글이나 mayajuni10@gmail.com으로 이메일 보내주시기 바랍니다.`


