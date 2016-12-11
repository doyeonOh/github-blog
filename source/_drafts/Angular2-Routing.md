title: Angular2 Routing
author: Doyeon Oh
tags:
  - angular2
  - routing
categories:
  - angular2
date: 2016-12-10 15:00:00
---
# Angular2 Routing


#### 1. Routing ?

일단 라우팅에 대해서 알아보자.

일반적으로 웹 개발에서, 라우팅은 어플리케이션의 서로 다른 영역들을 구분하는 것을 의미한다.

모두 알다시피 / 경로로 방문하면 어플리케이션의 홈 라우트를 방문하길 원할 것이고, /about 페이지로 방문하면 about page 로 렌더링하기 원할 것이다.

그렇다면 왜 라우팅을 해야하는지 알아보자면 

- app 안에서 서로 다른 영역을 구분 할 수 있다.
- app 안에서 상태를 유지한다.
- 특정 룰에 기반한 app 의 영역을 보호한다.

정도가 될 수 있겠다.


#### 2. Angular2 의 Routing Component

Angular2 에서 라우팅 설정에 사용되는 메인 컴포넌트 3개가 있다.

- `Routes` 는 어플리케이션이 지원하는 라우트를 표현한다.
- `RouterOutlet` 은 확장된 각 라우트의 컨텐트를 얻을 수 있다.
- `RouteLink` directive 는 어플리케이션 내의 다른 라우트로 링크하기 위해 사용된다.

위의 설명만 들으면 뭔소린지 모를 것이다. 다음을 계속 보자.

그 전에 일단 Angular2 의 router 사용하려면 `@angular/router` 패키지로부터 다음과 같이 import 해야 한다.

```
import {
	RouterModule,
    Routes
} from '@angular/router';
```


##### 2-1. Routes

어플리케이션의 라우트를 정의하려면 이놈이 필요하다. 이놈 즉, `Routes` 설정을 생성하고 우리 어플리케이션에 적용하기 위해 `router` 를 사용하는데 필요한 의존들과 함께 `RouterModule.forRoot(routes)` 사용해야 한다.

뭔 소린지 모르니 다음 코드를 보자.

```
const routes: Routes = [
    { path: '', redirectTo: home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'contactus', redirectTo: 'contact' }
];

```

`routes` 에 대한 설명을 하자면

- `path` 는 이 라우트가 처리할 URL 을 지정한다.
- `component` 는 path 에 따라 처리되어질 연결된 컴포넌트를 의미한다.
- `redirectTo` 는 필수는 아니지만 어플리케이션 내부에 존재하는 라우트 경로로 리다이렉트 할 때 사용된다.
- 그 외에도 등등 이 있으니 공식 문서 참고.


자 이 routes 를 만들었으니 어플리케이션에 적용을 해야한다.

`Routes` 를 적용하자

1. `RouterModule` 을 import 한다.
2. `NgModule` 의 imports 안에 `RouterModule.forRoot(routes)` 를 사용하여 routes 를 적용한다.

```
...
import {
	RouterModule,
    Routes
} from '@angular/router';
...

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'contactus', redirectTo: 'contact' }
];

@NgModule({
  declarations: [
    RoutesDemoApp,
    HomeComponent,
    AboutComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes) // <-- 적용
  ],
  bootstrap: [ AppModule ]
})
class RoutesAppModule {}

platformBrowserDynamic().bootstrapModule(RoutesAppModule)
.catch((err: any) => console.error(err));

```

##### 2-2. RouterOutlet

라우트를 변경할 때 외부 layout 은 냅두고 내부만 바꾸고 싶을 때가 있다. 그럴 때 사용하는 것이 RouterOutlet 이다.

이미 `NgModule` 에서 `RouterModule` 을 import 했기 때문에 해당 모듈에 Declarations 된 모든 component 들은 해당 모듈에 포함된 RouterOutlet 을 사용 할 수 있다. 

사용 할 때는 해당 component 에 연결된 template 에서 `router-outlet` 디렉티브를 사용한다. 

```
@Component({
  selector: 'router-app',
  template: `
    <div>
      <nav>
        <a>Navigation:</a>
          <ul>
            <li><a [routerLink]="['home']">Home</a></li>
            <li><a [routerLink]="['about']">About</a></li>
            <li><a [routerLink]="['contact']">Contact     us</a></li>
         </ul>
      </nav>
      <router-outlet></router-outlet>  <-- 이것이 router-outlet!!!
    </div>
`
})
class RoutesApp { }
```

routerLink 는 바로 다음에 설명하겠지만, 

위의 코드에서 home, about, contact 앵커 태그를 클릭하면 하단 `router-outlet` 에 해당 라우트가 연결된 component 로 전환 될 것이다.


##### 2-3. RouterLink

`RouterLink` 는 `[routerLink]` 를 사용한다.(위에 코드에 보이시죠?)

근데 왜 이걸 써야 할까? 알다시피 다음과 같이 직접적으로 HTML에 링크를 시도할 수 있지 않은가?

```
<a href="/#/home">Home</a>
```

이렇게 하면 큰일 난다. 아니 큰일은 나지 않지만, 링크를 클릭하면 페이지가 새로고침된다. 

우린 SPA 프로그래밍을 하는데 페이지가 새로고침이 되면 SPA 프로그래밍이 아니다.(Single Page Application)

Angular2 에서 이 문제를 해결한 것이 `RouterLink` 이다. 이것을 사용하면 페이지 새로고침 없이 해당 라우트로 링크 할 수 있다. 

위에도 나와 있지만 이 directive 는 다음과 같이 특별한 문법으로 link 를 작성 할 수 있다.

```
 <a>Navigation:</a>
  <ul>
    <li><a [routerLink]="['home']">Home</a></li>
    <li><a [routerLink]="['about']">About</a></li>
    <li><a [routerLink]="['contact']">Contact us</a></li>
  </ul>

```

왼쪽 편에 `[routerLink]` 는 현재 엘리먼트에 directive 를 적용한다. (여기서는 a 태그)

그리고 오른편에는 route 경로를 가지고 있는 배열이 있다. 생각하는 바와 같이 클릭하면 해당 home, about, contact 라우트로 이동 한다.

배열에 문자열만 턱하니 있으니 뭔가 이상해 보일 수도 있겠지만, 링크 할 때 제공 할 수 있는 것들이 더 많기 때문에 배열로 이루어져 있는 것이다. 더 제공 할 수 있는 것에 대해서는 공식 문서를 참조하자.


#### 3. `<base href="/">` 와 `APP_BASE_HREF`


##### 3-1. `<base href="/">`

다음 코드 `index.html` 파일을 보자.

```
<!doctype html>
<html>
  <head>
    <base href="/">  <---------- 여기!!!!!!
    <title>ng-book 2: Angular 2 Router</title>
    {% for (var css in o.htmlWebpackPlugin.files.css) { %}
      <link href="{%=o.htmlWebpackPlugin.files.css[css] %}" rel="stylesheet">
    {% } %}
  </head>
  <body>
    <router-app></router-app>
    <script src="/core.js"></script>
    <script src="/vendor.js"></script>
    <script src="/bundle.js"></script>
  </body>
</html>

```

위의 `<base href="/">` 만 빼면 그냥 알 수 있는 코드이다.

이 태그는 전통적으로 브라우저에게 어딜 봐야 하는지 알려주기 위해 사용된다.

예를 들어, `/hello` 라는 라우트 경로를 가지고 있고, `base` 엘리먼트에 `href="app"` 이라고 선언되었다면 어플리케이션은 해당 경로를 `/app/hello` 로  가리킬 것이다.

다음 코드는 그 예제이다.

```
const routes: Routes = [
    { path: 'app', component: AppComponent }
  ];


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule.forRoot(routes)
  ],
  ...
})
export class AppModule { }
```
```
<!doctype html>
<html>
  <head>
  <base href="/app">
    ...
  </head>
  <body>
    ...
  </body>
</html>
```
base 태그가 /app 로 되있기 때문에 routes 경로도 app 으로 지정해주어야 한다.

##### 3-2. `APP_BASE_HREF`

`<base href="/">` 를 코드 안에도 넣을 수 있다. 

그것은 바로 `NgModule` 의 `APP_BASE_HREF` 를 제공하면 된다!

```
@NgModule({
  declarations: [ RoutesDemoApp ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes) // <-- routes
  ],
  bootstrap: [ RoutesDemoApp ],
  providers: [
    { provide: LocationStrategy, useClass:   HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' } // <--- 여기
  ]
})
```

provider 에 있는  `{ proivde: APP_BASE_HREF, useValue: '/' }` 는 방금 말했듯이 HTML 헤더에 있던 `<base href="/">` 와 동일 하다.

Angular2 router 를 사용하려면 둘 중에 하나를 명시해주어야 한다.


#### 4. Routing Strategy


Angular2 의 라우팅 전략은 여러 가지가 있다. 그 중에 기본 전략으로 지정 된 것은 `PathLocationStrategy` 이다. 이것은 HTML5 routing 이라고도 불리는 데, 이 전략을 사용하는 동안 라우트들은 regular path 들을 표현한다. 

이 전략은 `LocationStrategy` 클래스를 바인딩 하여 어플리케이션의 라우팅 전략을 변경 할 수 있다.

기본적으로 사용되는 `PathLocationStrategy` 를 대신하여 `HashLocationStrategy` 를 사용 할 수 있다.

이 전략은 쉽게 말하면 hash(#) 기반 전략이다. 즉 `PathLocationStrategy` 에서 사용되던 `/hello` 라는 라우트가 `HashLocationStrategy` 에서는 `/#/hello` 로 표현된다. 

HTML5 Routing 을 사용하는 경우, 보통 경로들과 다르지 않기 때문에 구분을 주고자 한다면 사용하는 것을 추천한다.


이제 새로운 전략을 한번 사용해보자.

일단 `LocationStrategy` 와 `HashLocationStrategy` 를 import 해야 한다.

```
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
```

해당 클래스 들은 `@angular/common` 패키지에 존재한다.

이제 이 클래스들을 `NgModule` 에 작성하자.

```
	...
	providers: [
    	{ provide: LocationStrategy, useClass: HashLocationStrategy }
    ]
	...

```

이렇게 하면 적용된다. 그외 전략은 공식 문서를 참고하자..


#### 5. Route Parameter

특정 리소스에 대해 라우팅 하고 싶을 때가 있다. 예를 들어, 뉴스 기사 사이트에는 많은 기사들이 있는데 각 기사들은 id 를 가지고 있다. 

id 가 3인 url 을 표현하면 다음과 같다.

```
/articles/3
```

그리고 id 가 4인 것은 다음과 같다.

```
/articles/4
```

하지만 이렇게 많은 것들을 매번 하나하나 라우팅 할 순 없다. 이것을 변수를 사용하여 이용 할 수가 있다.

즉 이것이 라우트 파라메터인데 라우트가 파라메터를 가지게 하려면 다음과 같이 앞에 콜론을 붙여주면 된다.

```
/routes/:param

```

위의 뉴스 기사를 라우트 파라메터로 표현하면 다음과 같이 된다.

```
/articles/:id
```

`Routes` 설정에 추가해보면 다음과 같다.

```
const routes: Routes = [
    { path: '', redirectTo: 'search', pathMatch: 'full' },
    { path: 'search', component: SearchComponent },
    { path: 'artists/:id', component: ArtistComponent },
    { path: 'tracks/:id', component: TrackComponent },
    { path: 'albums/:id', component: AlbumComponent },
];
```

`artists/123` 으로 방문 한다면, 해당 123을 가진 id 라우트 파라메터가 `ArtistComponent` 에 전달 될 것이다.


##### 5-1. ActivatedRoute
