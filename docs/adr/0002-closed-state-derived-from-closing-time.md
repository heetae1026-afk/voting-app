# Closed 여부는 Closing time과 현재 시각으로 매번 계산한다

Poll은 Closing time이 지나면 자동으로 Closed가 된다. 이를 예약 작업(cron)이 상태 칸을 바꾸는 방식으로 하지 않고, 읽을 때마다 "Operator가 지금 마감했거나 Closing time이 지났으면 Closed"로 계산한다. 예약 작업 방식은 작업 주기만큼 마감이 늦거나, 작업이 멈추면 마감되지 않는 문제가 있고, 서버리스 배포에 별도 스케줄러를 둬야 한다. 계산 방식은 마감 직후 첫 요청부터 정확하며 인프라가 늘지 않는다.

## Consequences

- DB의 상태 칸(`status`)은 "Operator가 지금 마감했는지"만 뜻한다. `status = 'open'`이어도 Closing time이 지났다면 Closed다. Poll 상태를 판단하는 코드는 반드시 둘을 함께 본다.
- Vote를 거부하는 검사는 기록하는 SQL 문장 안에서 `closes_at > now()`까지 확인해, 마감 순간 들어온 Vote가 기록되지 않게 한다. 시각은 DB 서버 시각을 기준으로 한다.
- Operator의 "지금 마감"은 Closing time을 앞당기는 것과 같은 결과다. Closing time을 늦추는 기능은 두지 않는다.
- Closing time 직전에 기록을 시작한 Vote는 받아들인다(`now()`는 그 Vote의 트랜잭션이 시작된 시각이다). 그 Vote가 커밋되기 전 몇 ms 사이에 Result를 읽으면, 직후보다 한 표 적게 보일 수 있다. Operator의 "지금 마감"은 `FOR SHARE` 때문에 이런 Vote가 끝날 때까지 기다리지만, 시각으로 인한 마감은 기다릴 대상이 없다. 마감 전에 제출된 Vote를 받는 것이 맞고, Result 조회마다 잠금을 거는 비용이 더 크므로 이 차이는 감수한다.
