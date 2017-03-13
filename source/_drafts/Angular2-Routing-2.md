title: Angular2 Routing(2)
author: Doyeon Oh
date: 2017-03-13 10:59:25
tags:
---
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