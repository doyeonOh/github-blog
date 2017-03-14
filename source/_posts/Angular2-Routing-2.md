title: Angular2 Routing(2)
author: Doyeon Oh
tags:
  - angular2
  - routing
  - angular
categories:
  - angular
date: 2017-03-13 10:59:00
---
#### 5. Route Parameter

특정 리소스에 대해 라우팅 하고 싶을 때가 있다. 예를 들어, 뉴스 기사 사이트에는 많은 기사들이 있는데 각 기사들은 id 를 가지고 있다. 

id 가 3인 url 을 표현하면 다음과 같다.

```typescript
/articles/3
```

그리고 id 가 4인 것은 다음과 같다.

```typescript
/articles/4
```

하지만 이렇게 많은 것들을 매번 하나하나 라우팅 할 순 없다. 이것을 변수를 사용하여 이용 할 수가 있다.

즉 이것이 라우트 파라메터인데 라우트가 파라메터를 가지게 하려면 다음과 같이 앞에 콜론을 붙여주면 된다.

```typescript
/routes/:param

```

위의 뉴스 기사를 라우트 파라메터로 표현하면 다음과 같이 된다.

```typescript
/articles/:id
```

`Routes` 설정에 추가해보면 다음과 같다.

```typescript
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

라우트 파라메터를 사용하려면, 먼저 `ActivatedRoute` 를 가져와야 한다.

```typescript
import { ActivatedRoute } from '@angular/router';
```

다음으로 `ActivatedRoute` 를 컴포넌트 생성자로 주입 받는다.

예를들어 다음을 지정하는 `Routes` 가 있다고 하자.

```typescript
const routes: Routes = [
	{ path: 'articles/:id', component: ArticlesComponent }
];
```

그런다음 `ArticleComponent` 를 작성할 때, `ActivatedRoute` 를 생성자의 파라메터 하나로 추가한다.

```typescript
export class ArticleComponent {
	id: string;
    
    constructor(private route: ActivatedRoute) {
    	route.params.subscribe(params => { this.id = params['id']; });
    }
}
```

`route.params` 는 *Observable* 인 것을 알아야 한다. params 값을 `.subscribe` 를 사용하여 추출 할 수 있다. 

이 경우, 우리는 `params['id']` 의 값을 컴포넌트의 id 변수에 할당한다. 

이제 `/articles/230` 을 방문하면 컴포넌트의 id 변수에 230 이 할당된다.

그 외 `route.queryParams`, `route.data`, `route.url` 등의 Observable 프로퍼티도 존재 하니 공식 문서를 참조하길 바란다.


#### 6. Route guards

유저가 항상 제공하는 라우팅을 방문 할 수 있는 것은 아니다. 

만약 사용자가 어떠한 컴포넌트에 접근할 권한이 없다면 로그인(인증) 을 해야한다.

만약 컴포넌트를 표현 하기 전에 일부 데이터를 가져와야 할 경우도 있다.

혹은 변경 중인 작업들을 저장하지 않고 페이지를 나갈 때도 없어져도 괜찮은지 물을 수도 잇다.

이러한 시나리오를 처리하기 위해 라우팅 설정에 `Route Guards` 를 추가 할 수 있다.

이런 가드(Guard) 는 boolean 응답으로 동기적으로 반환이 가능하다.  그러나 많은 경우 안에서 동기적으로 대답을 낼 수가 없다. 관리자는 사용자에게 질문하거나 서버 변경사항을 저장하거나 새로운 데이터를 가져올 수 있다.

이것들은 모두 비동기직 작업이다.

따라서 라우터는 여러 종류의 가드를 지원한다.

1. `CanActivate`  는 라우트 탐색을 허용 여부를 결정 할 수 있다.
2. `CanActivateChild()` 는 자식 라우트 탐색 허용 여부를 결정 할 수 있다.
3. `CanDeactivate` 를 사용하여 현재 라우트에서 다른 라우트로 이동 가능 여부를 결정할 수 있다.
4. `Resolve` 는 라우트 활성화 전 데이터를 검색을 수행하고 탐색을 진행 하게 할 수 있다.
5. `CanLoad` 는 필요한 모듈을 로드 후 라우트 탐색을 할 수 있도록 비동기적으로 진행하게 할 수 있다.


가드에 대해서 더 궁금하다면 angular 공식문서를 참조하길 바란다.

[참조] : ng-book2 : The Complete Book on AngularJS 2,  https://angular.io