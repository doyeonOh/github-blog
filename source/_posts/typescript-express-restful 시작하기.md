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
typings install dt~express --save --global
typings install env~node --save --global
```
위의 문법은 [Typings](https://github.com/typings/typings)에 가면 설명나와 있다.

설치가 완료 되면 typings.json을 보면 아래와 같이 되어 있다.
```
{
  "name": "myapp",
  "dependencies": {},
  "globalDependencies": {
    "express": "registry:dt/express#4.0.0+20160317120654",
    "node": "registry:env/node#6.0.0+20160622202520"
  }
}
```
먼저 파일을 만들고 위와 같이 작성후 `typings install`로 한꺼번에 설치가 가능하다.

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
목표는 Hollo world를 찍는거까지 하겠다.

