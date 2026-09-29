# Spec: Closing time과 Result 그래프

Status: ready-for-agent

## Problem Statement

동아리 회장(Operator)이 "투표가 계속 열려 있어서 사람들이 참여를 안 한다"고 했다. 지금 Poll은 Operator가 직접 마감하기 전까지 무기한 Open이라, Voter는 언제까지 참여해야 하는지 모르고 미루다가 잊는다. Operator도 마감을 챙기지 않으면 Poll이 끝나지 않는다. 또 Result는 Option마다 얇은 막대와 숫자뿐이라, 마감 후 결과를 한눈에 파악하거나 공지에 옮기기에 부족하다.

## Solution

Operator는 Poll을 만들 때 Closing time을 반드시 정한다(기본 3일 뒤). Closing time이 지나면 Poll은 자동으로 Closed가 되어 더 이상 Vote를 받지 않고, Voter에게 Result가 공개된다. Voter는 Poll link 화면 맨 위에서 "10월 3일(금) 오후 6:00 마감 · 2일 남음"처럼 마감 시각과 남은 시간을 보고, 마감 1시간 전부터는 눈에 띄게 강조된다. Operator는 "지금 마감"으로 Closing time을 앞당길 수 있지만 늦출 수는 없다.

Result는 가로 막대 그래프로 보여준다. Option 순서를 유지하고, 가장 많이 선택된 Option(동률이면 모두)을 색으로 강조하되 당선·1위 같은 판정 문구는 쓰지 않는다. Result를 누가 언제 보는지는 바뀌지 않는다. Voter는 Closed 후, Operator는 언제든 본다.

## User Stories

### Closing time 정하기

1. As an Operator, I want to Poll을 만들 때 Closing time을 정하기를, so that Poll이 무기한 열려 있지 않다
2. As an Operator, I want to Closing time 입력칸에 "지금부터 3일 뒤, 정시로 올림"이 미리 채워져 있기를, so that 대부분의 경우 그대로 만들 수 있다
3. As an Operator, I want to Closing time을 한국 시간(KST) 기준 날짜와 분 단위 시각으로 고르기를, so that 브라우저나 서버 시간대와 상관없이 의도한 시각에 마감된다
4. As an Operator, I want to 지금부터 10분 이내의 Closing time은 고를 수 없기를, so that 만들자마자 마감되는 Poll을 실수로 만들지 않는다
5. As an Operator, I want to 30일보다 먼 Closing time은 고를 수 없기를, so that 사실상 계속 열려 있는 Poll이 다시 생기지 않는다
6. As an Operator, I want to 허용 범위를 벗어난 Closing time을 넣으면 허용 범위를 알려주는 안내를 보기를, so that 바로 고칠 수 있다
7. As an Operator, I want to Closing time 없이는 Poll을 만들 수 없기를, so that 모든 Poll에 끝이 있다

### 자동 마감

8. As an Operator, I want to Closing time이 지나면 Poll이 자동으로 Closed가 되기를, so that 내가 마감을 챙기지 않아도 된다
9. As a Voter, I want to Closing time이 지난 Poll에는 Vote할 수 없기를, so that 마감 규칙이 모두에게 똑같이 적용된다
10. As a Voter, I want to 화면을 열어 둔 사이 Closing time이 지나서 제출이 거부되면 마감 안내를 보기를, so that 왜 안 되는지 안다
11. As a Voter, I want to Closing time이 지나면 Poll link에서 Result를 보기를, so that 따로 공지를 기다리지 않아도 된다
12. As an Operator, I want to Closing time 직전에 들어온 Vote와 직후에 들어온 Vote가 정확히 구분되기를, so that 마감 시각을 두고 시비가 없다

### Closing time 앞당기기

13. As an Operator, I want to "지금 마감"으로 Closing time 전에 Poll을 마감하기를, so that 필요하면 일찍 끝낼 수 있다
14. As an Operator, I want to Closing time을 늦출 방법이 없기를, so that "불리해서 연장했다"는 시비가 생기지 않는다
15. As an Operator, I want to 이미 Closed인 Poll에는 "지금 마감" 버튼이 보이지 않기를, so that 헷갈리지 않는다

### Closing time 보여주기

16. As a Voter, I want to Poll link 화면 맨 위에서 마감 시각을 "10월 3일(금) 오후 6:00 마감"처럼 보기를, so that 언제까지 해야 하는지 바로 안다
17. As a Voter, I want to 마감 시각 옆에 "2일 남음"처럼 남은 시간을 보기를, so that 얼마나 급한지 느낀다
18. As a Voter, I want to 남은 시간이 하루 미만이면 "5시간 남음", 1시간 미만이면 "37분 남음"으로 보기를, so that 마감이 가까워질수록 정확히 안다
19. As a Voter, I want to 마감 1시간 전부터 마감 표시가 눈에 띄는 색으로 바뀌기를, so that 놓치지 않는다
20. As a Voter, I want to 화면을 열어 둔 동안 남은 시간이 1분마다 갱신되기를, so that 새로고침하지 않아도 된다
21. As a Voter, I want to 초 단위 카운트다운이 없기를, so that 선거에서 불필요하게 재촉받지 않는다
22. As a Voter, I want to Closed Poll에서는 "10월 3일(금) 오후 6:00에 마감되었습니다"처럼 마감된 시각을 보기를, so that 언제 끝났는지 안다
23. As an Operator, I want to 관리 화면에서도 Closing time과 남은 시간을 보기를, so that 공지할 때 참고할 수 있다
24. As an Operator, I want to 일찍 마감한 Poll은 실제로 마감한 시각이 보이기를, so that 원래 Closing time과 헷갈리지 않는다

### Result 그래프

25. As a Voter, I want to Closed Poll의 Result를 가로 막대 그래프로 보기를, so that 결과를 한눈에 파악한다
26. As a Voter, I want to 그래프가 Option 순서(기호 순)대로 나오기를, so that 투표 화면과 같은 순서로 비교할 수 있다
27. As a Voter, I want to 각 막대 옆에 선택 수와 비율이 보이기를, so that 정확한 숫자도 안다
28. As a Voter, I want to 가장 많이 선택된 Option이 색으로 강조되기를, so that 어느 쪽이 많은지 바로 보인다
29. As a Voter, I want to 동률이면 가장 많이 선택된 Option이 모두 강조되기를, so that 앱이 임의로 하나를 고른 것처럼 보이지 않는다
30. As an Operator, I want to 그래프에 "당선"이나 "1위" 같은 판정 문구가 없기를, so that 판정은 조직 회칙에 따라 우리가 한다
31. As a Voter, I want to Vote가 하나도 없는 Poll에서는 아무 Option도 강조되지 않기를, so that 0표가 "최다"로 보이지 않는다
32. As a Voter, I want to 후보 이름이 길어도 폰에서 그래프가 읽히기를, so that 카톡 링크로 들어와서도 결과를 볼 수 있다
33. As a Voter, I want to Multiple Poll 그래프에서 비율이 전체 Vote 수 기준이라는 안내를 보기를, so that 합이 100%를 넘어도 이해한다
34. As an Operator, I want to 관리 화면에서도 같은 그래프를 Open 중에도 보기를, so that 진행 상황을 같은 방식으로 파악한다
35. As an Operator, I want to Voter가 Open Poll의 그래프를 볼 수 없기를, so that 중간 결과가 표심에 영향을 주지 않는다
36. As a Voter, I want to 그래프가 밝은 화면과 어두운 화면 모두에서 잘 보이기를, so that 기기 설정과 상관없이 읽을 수 있다

## Implementation Decisions

### Closed 판정 (ADR-0002)

- Closed 여부는 저장된 값으로 매번 계산한다. "Operator가 지금 마감했거나(`status = 'closed'`) Closing time이 지났으면 Closed"다. 예약 작업(cron)은 두지 않는다.
- DB의 `status` 칸은 이제 "Operator가 지금 마감했는지"만 뜻한다. Poll 상태를 판단하는 모든 곳은 도메인 모듈이 계산한 상태를 쓰고, `status` 칸을 직접 보지 않는다.
- Closed 판정과 Vote 거부는 DB 서버 시각(`now()`)을 기준으로 한다. castVote의 기록 SQL 문장은 기존의 Open 확인에 `closes_at > now()`를 더해, 마감 순간의 Vote가 기록되지 않게 한다. 기존의 `FOR SHARE` 잠금은 유지한다.

### 스키마

- 마이그레이션 0003에서 `polls.closes_at`(timestamptz)을 추가한다.
  - 기존 Open Poll은 마이그레이션 시점에서 3일 뒤로 채운다.
  - 기존 Closed Poll은 `closed_at`으로 채운다. `closed_at`이 없으면 `created_at`으로 채운다.
  - 채운 뒤 NOT NULL로 바꾼다.
- `closed_at`은 계속 "Operator가 지금 마감한 시각"을 담는다.

### Poll 도메인 모듈 변경

- **createPoll**(…, Closing time) + 선택 입력 "지금" 시각:
  - Closing time은 필수다. "지금"보다 10분 이상 뒤이고 30일 이하 뒤여야 하며, 아니면 새 도메인 오류 사유 `invalid-closing-time`으로 거부한다.
  - "지금"은 기본적으로 현재 시각이다. 주입할 수 있게 둔 이유는 테스트 때문이다. 과거 시각에 만든 Poll로 "이미 Closing time이 지난 Poll"을 인터페이스만으로 재현한다. 다른 함수는 시각을 주입받지 않고 DB 시각을 쓴다.
- **getPoll**은 계산된 상태(Open/Closed), Closing time, 그리고 Closed라면 실제로 마감된 시각을 함께 돌려준다. 실제로 마감된 시각은 Operator가 일찍 마감했으면 그 시각, 아니면 Closing time이다.
- **castVote**는 Closing time이 지난 Poll을 기존 사유 `poll-closed`로 거부한다.
- **closePoll**은 계산된 상태가 Open일 때만 마감한다. Closing time을 늦추는 함수는 만들지 않는다.
- **getResult**의 공개 규칙은 그대로이며, 계산된 상태를 기준으로 판단한다. Closing time이 지나면 Voter에게도 공개된다.

### Closing time 입력

- 작성 폼의 입력칸은 "날짜 + 분 단위 시각"이며, 값은 항상 KST로 해석한다. 서버는 입력 문자열에 +09:00을 붙여 해석하고, 서버나 브라우저의 시간대에 의존하지 않는다.
- 기본값은 서버가 만든다. "지금부터 3일 뒤를 정시로 올림"을 KST로 표시한다.
- 입력칸의 최소값과 최대값도 같은 규칙으로 채워 브라우저에서 1차로 막는다. 최종 검증은 도메인 모듈이 한다.

### 표시용 순수 함수

- **마감 문구**(Closing time, 지금):
  - 절대 시각은 KST 기준 "10월 3일(금) 오후 6:00 마감" 형식이다.
  - 남은 시간은 하루 이상이면 "N일 남음"(내림), 1시간 이상이면 "N시간 남음"(내림), 1시간 미만이면 "N분 남음"(내림, 최소 1분)이다.
  - 1시간 미만이면 "강조" 표시를 켠다.
  - 지난 시각이면 "10월 3일(금) 오후 6:00에 마감되었습니다"를 돌려준다.
- **최다 선택 Option**(Result): 선택 수가 최대인 Option ID를 모두 돌려준다. 전체 Vote가 0이면 빈 목록이다.
- 남은 시간 표시는 클라이언트 컴포넌트가 1분마다 다시 계산한다. 서버 렌더링 값과 클라이언트 값이 달라 생기는 hydration 불일치가 없게 한다. 예를 들어 서버가 계산한 기준 시각을 넘겨 첫 렌더를 맞춘다.

### Result 그래프

- 기존 Result 표를 가로 막대 그래프로 바꾼다. 라이브러리 없이 CSS로 그린다.
- 각 행은 Option 이름, 막대, 선택 수, 비율로 이루어진다. 막대 길이는 비율(선택 수 ÷ 전체 Vote 수)이다.
- 최다 선택 Option은 강조 색을 쓴다. 강조는 색에만 의존하지 않고, 굵은 글씨처럼 모양으로도 구분한다.
- 판정 문구(당선, 1위, Winner)는 쓰지 않는다(CONTEXT.md의 Result _Avoid_).
- Voter 화면(Closed 후)과 Operator 화면(언제든)이 같은 컴포넌트를 쓴다.
- 폰 너비에서는 Option 이름을 막대 위 줄에 두어 긴 이름도 잘리지 않게 한다.

## Testing Decisions

- **seam ①: Poll 도메인 모듈.** 기존과 같이 PGlite에 운영과 같은 마이그레이션을 적용하고, 공개 인터페이스만 호출한다. 테이블 구조나 `status` 칸은 확인하지 않는다.
  - createPoll: Closing time 누락, 10분 경계, 30일 경계의 허용과 거부
  - "이미 Closing time이 지난 Poll"(과거 시각에 만든 Poll): getPoll이 Closed로 보고하고 실제로 마감된 시각이 Closing time인지, castVote가 `poll-closed`로 거부하는지, getResult가 Voter에게 공개하는지
  - Closing time 전 Poll: Open이고 Vote를 받으며, Voter에게 Result를 숨기는지
  - closePoll로 일찍 마감한 Poll: 실제로 마감된 시각이 Closing time이 아닌지
  - 마이그레이션: 기존 Poll을 채우는 규칙(Open은 3일 뒤, Closed는 closed_at)은 마이그레이션 SQL에 대한 별도 테스트를 두지 않고, 운영 DB에 적용한 뒤 확인한다
- **seam ②: 표시용 순수 함수.** 입력에 고정된 "지금"을 넣고, 기대값은 손으로 계산한 리터럴로 둔다.
  - 마감 문구: KST 변환(UTC 자정 근처, 요일 경계), 오전과 오후, 일·시간·분 단위 경계(정확히 1일, 1시간, 1분 미만), 강조 여부, 지난 시각
  - 최다 선택 Option: 단독 최다, 동률, 0표
- 그래프 화면과 폼은 자동 테스트하지 않고, 개발 서버에서 Open, Closed, 0표, 동률, Multiple, 긴 이름을 수동으로 확인한다.
- 기존 테스트 중 Poll을 만드는 곳은 모두 Closing time을 넣도록 바꾼다. 공통 도우미로 모아 한 곳에서 기본값을 준다.

## Out of Scope

- Closing time 연장(의도적으로 만들지 않음)
- 시작 시각 예약
- 원그래프, 시간에 따른 참여 추이 그래프
- Open 중 Voter에게 Result 공개, Poll마다 공개 설정
- 마감 임박 알림(이메일, 푸시)
- Closing time 앞당기기를 특정 시각으로 지정하는 기능("지금 마감"만 있음)

## Further Notes

- 이 기능은 첫 스펙(`.scratch/voting-v1/spec.md`)의 Out of Scope였던 "마감 시각 예약과 자동 마감"을 들여오는 것이다.
- 의사결정 기록: ADR-0002(Closed 판정은 매번 계산). 용어: CONTEXT.md의 Closing time, Open / Closed, Result.
- Q1의 가설은 "마감이 보이지 않아 미룬다"이다. 배포 후 회장님께 참여가 늘었는지 확인하면, 마감 임박 알림 같은 다음 단계가 필요한지 판단할 수 있다.
