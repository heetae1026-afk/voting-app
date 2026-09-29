# Spec: 투표 도구 v1

Status: ready-for-agent

## Problem Statement

동아리·학생회 같은 소규모 조직은 선거나 의사결정을 할 때 구성원에게 질문 하나를 던지고 선택지 중에서 고르게 할 방법이 필요하다. 지금은 카톡 투표나 손을 드는 방식처럼 결과를 한눈에 모으기 어렵거나 조직 밖 도구에 의존하는 방식을 쓴다. Operator는 Poll을 빠르게 올리고 링크 하나로 Member에게 돌린 뒤 마감하고 Result를 확인하고 싶다. Voter는 가입이나 로그인 없이 링크를 열어 바로 Vote하고 싶다.

## Solution

Operator가 Operator token으로 로그인해 Poll을 만든다. Poll은 질문, 두 개 이상의 Option, Selection mode(Single 또는 Multiple), 그리고 Multiple일 때는 Selection limit로 이루어진다. 만들면 Poll link가 나오고, Operator가 이를 조직 안에 공유한다. Voter는 Poll link를 열어 Selection mode에 맞게 Option을 고르고 Vote한다. Operator가 Poll을 마감하면 Closed가 되어 더 이상 Vote를 받지 않고, 그때부터 Voter도 Result를 볼 수 있다. Operator는 Open 중에도 언제든 Result를 볼 수 있다.

v1은 ADR-0001에 따라 Voter를 인증하지 않고 중복 Vote를 막지 않는다. 같은 브라우저에서 실수로 두 번 제출하는 것만 화면에서 막는다.

## User Stories

### Operator 인증

1. As an Operator, I want to Operator token을 입력해 Operator 화면에 들어가기를, so that 아무나 Poll을 만들거나 마감하지 못한다
2. As an Operator, I want to 한번 입력한 Operator token이 이 브라우저에서 한동안 유지되기를, so that Poll을 관리할 때마다 다시 입력하지 않는다
3. As an Operator, I want to 로그아웃하기를, so that 공용 컴퓨터에서 다른 사람이 Operator 권한을 쓰지 못한다
4. As an Operator, I want to 틀린 Operator token을 넣으면 명확한 오류를 보기를, so that 오타인지 알 수 있다
5. As a Voter, I want to Operator 화면에 들어가려 하면 Operator token을 요구받기를, so that Operator 기능이 Voter에게 열려 있지 않다는 것이 분명하다

### Poll 만들기

6. As an Operator, I want to 질문을 입력해 Poll을 만들기를, so that Member에게 결정을 물을 수 있다
7. As an Operator, I want to Option을 두 개 이상 추가하기를, so that Voter가 고를 선택지가 생긴다
8. As an Operator, I want to Option의 순서를 정하기를, so that 후보 기호 순서나 논리적 순서대로 보인다
9. As an Operator, I want to Option을 추가하고 지우는 일을 게시 전에 자유롭게 하기를, so that 초안을 다듬을 수 있다
10. As an Operator, I want to Selection mode를 Single 또는 Multiple로 정하기를, so that "회장 1명 선출"과 "운영위원 여러 명 선출"을 모두 할 수 있다
11. As an Operator, I want to Multiple일 때 Selection limit을 정하기를, so that "최대 3명까지"처럼 선출 인원을 표현할 수 있다
12. As an Operator, I want to Option이 2개 미만이거나 빈 Option, 중복 Option이 있으면 만들 수 없기를, so that 잘못된 Poll이 Voter에게 가지 않는다
13. As an Operator, I want to Selection limit이 2 이상이고 Option 수 이하일 때만 만들 수 있기를, so that 의미 없는 설정을 막을 수 있다
14. As an Operator, I want to Poll을 만들자마자 Poll link를 받기를, so that 바로 공유할 수 있다
15. As an Operator, I want to Poll link를 한 번에 복사하기를, so that 카톡방에 쉽게 붙여넣을 수 있다

### Poll 관리

16. As an Operator, I want to 지금까지 만든 모든 Poll 목록을 보기를, so that 진행 중인 것과 마감된 것을 관리할 수 있다
17. As an Operator, I want to 목록에서 각 Poll의 Open/Closed 상태와 현재 Vote 수를 보기를, so that 참여 현황을 한눈에 파악한다
18. As an Operator, I want to 다른 Operator가 만든 Poll도 똑같이 보고 관리하기를, so that Operator token을 공유하는 운영진이 함께 일할 수 있다
19. As an Operator, I want to Open Poll을 마감하기를, so that 정해진 시점에 Vote를 끝낼 수 있다
20. As an Operator, I want to 마감 전에 확인을 받기를, so that 실수로 마감하지 않는다
21. As an Operator, I want to 마감한 Poll은 다시 열 수 없기를, so that 마감 후 결과가 바뀌었다는 시비가 없다
22. As an Operator, I want to Open 중에도 Result를 보기를, so that 진행 상황을 확인할 수 있다
23. As an Operator, I want to 목록에서 Poll link를 다시 복사하기를, so that 공지를 다시 올릴 수 있다

### Vote

24. As a Voter, I want to Poll link를 열면 로그인 없이 바로 질문과 Option을 보기를, so that 부담 없이 참여할 수 있다
25. As a Voter, I want to Single Poll에서는 Option 하나만 고를 수 있기를, so that 규칙에 맞게 Vote한다
26. As a Voter, I want to Multiple Poll에서는 Selection limit까지 여러 Option을 고르기를, so that 여러 후보에게 Vote할 수 있다
27. As a Voter, I want to Selection limit을 넘게 고르려 하면 막히고 안내를 보기를, so that 무효가 되는 Vote를 하지 않는다
28. As a Voter, I want to 몇 개까지 고를 수 있는지 미리 안내받기를, so that 규칙을 알고 고른다
29. As a Voter, I want to Option을 하나도 고르지 않으면 제출할 수 없기를, so that 빈 Vote가 생기지 않는다
30. As a Voter, I want to 제출 전에 고른 Option을 확인하기를, so that 실수로 잘못 Vote하지 않는다
31. As a Voter, I want to 제출 후 "Vote했습니다" 확인을 보기를, so that 내 Vote가 들어갔다는 것을 안다
32. As a Voter, I want to 같은 브라우저로 Poll link를 다시 열면 "이미 Vote했습니다"를 보기를, so that 실수로 두 번 Vote하지 않는다
33. As a Voter, I want to Closed Poll의 Poll link를 열면 마감되었다는 안내와 Result를 보기를, so that 늦게 들어와도 결과를 알 수 있다
34. As a Voter, I want to 내가 보고 있는 동안 Poll이 마감되어 제출이 거부되면 마감 안내를 보기를, so that 왜 안 되는지 안다
35. As a Voter, I want to 존재하지 않는 Poll link를 열면 "찾을 수 없음" 안내를 보기를, so that 링크가 잘못됐다는 것을 안다
36. As a Voter, I want to 폰에서 편하게 Vote하기를, so that 카톡 링크를 눌러 바로 참여할 수 있다

### Result

37. As a Voter, I want to Open Poll에서는 Result를 볼 수 없기를, so that 중간 결과에 휩쓸리지 않고 고른다
38. As a Voter, I want to Poll이 Closed된 뒤 Option별 선택 수와 비율을 보기를, so that 결정 결과를 알 수 있다
39. As a Voter, I want to 전체 Vote 수를 보기를, so that 몇 명이 참여했는지 안다
40. As a Voter, I want to Multiple Poll에서 비율이 전체 Vote 수 대비 각 Option을 고른 비율로 표시되기를, so that 비율 합이 100%를 넘어도 의미를 이해할 수 있다
41. As an Operator, I want to Result가 Option 순서대로, 선택 수와 함께 보이기를, so that 회의록이나 공지에 옮겨 적기 쉽다
42. As an Operator, I want to Vote가 0개인 Poll의 Result도 오류 없이 보기를, so that 아무도 참여하지 않은 경우도 처리된다

## Implementation Decisions

### 범위와 전제

- 한 사이트는 한 Organization만 쓴다. Organization은 데이터에 등장하지 않는 배경 개념이며, 다른 조직은 별도로 배포한다.
- ADR-0001: Voter 인증과 중복 Vote 방지는 하지 않는다. Operator는 모든 Operator가 공유하는 단일 Operator token으로 인증하며, 개인을 구분하지 않는다.
- Next.js 16 App Router와 Neon Postgres(`@neondatabase/serverless`, 이미 의존성에 있음)를 쓴다. 화면 변경은 Server Function(Server Action)으로 처리한다. 코드를 쓰기 전에 `node_modules/next/dist/docs/`의 해당 가이드를 확인한다(AGENTS.md).

### Poll 도메인 모듈 (핵심 seam)

모든 규칙은 하나의 Poll 도메인 모듈 안에 두고, 화면과 Server Function은 이 모듈을 얇게 호출만 한다. 모듈은 SQL 실행기를 주입받아, 운영에서는 Neon, 테스트에서는 PGlite를 쓴다.

공개 인터페이스(이름은 구현 시 조정 가능):

- **createPoll**(질문, Option 목록, Selection mode, Selection limit): 새 Open Poll을 만들고 Poll link에 쓸 ID를 돌려준다.
  - Option은 2개 이상, 공백을 제거한 뒤 비어 있지 않고 서로 중복되지 않아야 한다.
  - Single이면 Selection limit은 1로 고정한다. Multiple이면 2 이상이고 Option 수 이하여야 한다.
- **getPollForVoting**(Poll ID): Voter가 볼 질문, 순서가 정해진 Option, Selection mode, Selection limit, 상태를 돌려준다. 없는 ID면 "없음"을 돌려준다.
- **castVote**(Poll ID, 고른 Option ID 목록): Vote를 하나 기록한다.
  - Poll이 Open이어야 한다.
  - Option ID는 모두 그 Poll의 것이고 서로 중복되지 않으며, 개수는 1개 이상 Selection limit 이하여야 한다.
  - 마감과 동시에 들어온 Vote가 마감 후에 기록되지 않도록, 상태 확인과 기록을 한 트랜잭션에서 처리한다.
- **closePoll**(Poll ID): Open Poll을 Closed로 바꾼다. 이미 Closed면 아무것도 바꾸지 않는다. 다시 여는 기능은 없다.
- **getResult**(Poll ID, 보는 사람: Operator 또는 Voter): Option별 선택 수, 전체 Vote 수, 각 Option의 비율(선택 수 ÷ 전체 Vote 수)을 돌려준다. 보는 사람이 Voter이고 Poll이 Open이면 "아직 비공개"를 돌려준다.
- **listPolls**(): Operator용으로 모든 Poll의 질문, 상태, Vote 수, 생성 시각을 최신순으로 돌려준다.

모듈의 오류는 구분 가능한 도메인 오류로 돌려준다. 예: 잘못된 Poll 정의, 없는 Poll, Closed Poll, 잘못된 선택 개수, 다른 Poll의 Option. 화면은 이를 한국어 안내로 바꾼다.

### 스키마

- **polls**: ID(추측할 수 없는 무작위 값, 128비트 이상, URL-safe), 질문, Selection mode, Selection limit, 상태(Open/Closed), 생성 시각, 마감 시각
- **options**: ID, Poll ID, 이름, 순서
- **votes**: ID, Poll ID, 생성 시각. 한 행이 Vote 하나다.
- **vote_selections**: Vote ID, Option ID. Vote 하나가 고른 Option마다 한 행이다.
- 전체 Vote 수는 votes 행 수로, Option별 선택 수는 vote_selections 행 수로 센다. Multiple Poll에서는 Option 비율의 합이 100%를 넘을 수 있다.
- Voter를 식별하는 정보(IP, 쿠키 값, 브라우저 지문 등)는 저장하지 않는다.
- 스키마 변경은 저장소 안의 SQL 마이그레이션으로 관리한다.

### Operator 인증

- Operator token은 서버 환경변수로 둔다. 코드와 저장소에는 넣지 않는다.
- Operator가 로그인 화면에 토큰을 입력하면, 서버가 상수 시간 비교로 확인한 뒤 서명된 httpOnly 세션 쿠키를 발급한다. 세션에는 "Operator임" 외의 정보를 담지 않는다.
- Operator 전용 Server Function(createPoll, closePoll, listPolls, Operator용 getResult)은 매번 세션을 확인한다. 화면 라우팅 단계의 보호(Next.js 16의 proxy)만 믿지 않는다.
- Operator token을 바꾸면 기존 세션은 모두 무효가 되도록 세션 서명에 토큰에서 파생한 값을 쓴다.

### Voter 화면

- Poll link는 Poll ID를 담은 공개 경로다. 홈 화면에 Poll 목록은 없다.
- 제출에 성공하면 브라우저 저장소에 "이 Poll에 Vote함" 표시를 남긴다. 표시가 있으면 Vote 화면 대신 "이미 Vote했습니다"를 보여준다. 이는 실수 방지용 UX일 뿐, 서버는 이 표시를 확인하지 않는다(ADR-0001).
- 화면은 한국어이며 모바일 우선으로 만든다.

## Testing Decisions

- **seam은 하나, Poll 도메인 모듈이다.** 테스트는 모듈의 공개 인터페이스만 호출하고 돌려받은 값과 도메인 오류만 확인한다. 테이블 구조나 SQL, 내부 함수는 확인하지 않는다.
- 테스트 DB는 **PGlite**(프로세스 안에서 도는 Postgres)를 쓰고, 운영과 같은 마이그레이션을 적용한다. 테스트마다 새 DB에서 시작한다.
- 테스트 러너는 **Vitest**를 새로 도입한다. 저장소에 기존 테스트가 없어 따를 선례는 없다.
- 반드시 다룰 행동:
  - Poll 정의 검증: Option 수, 빈 Option과 중복 Option, Single과 Multiple의 Selection limit 경계값
  - Single과 Multiple 각각에서 castVote의 허용과 거부: 0개, limit 초과, 중복 Option, 다른 Poll의 Option
  - Closed Poll에 대한 castVote 거부, closePoll을 두 번 호출해도 안전한지
  - getResult: Voter는 Open 중 비공개이고 Closed 후 공개, Operator는 항상 공개, Multiple에서 선택 수와 전체 Vote 수 계산, Vote 0개일 때
  - listPolls의 상태와 Vote 수
- Operator 인증(토큰 비교, 세션 발급과 검증)은 순수 함수로 분리해 단위 테스트한다.
- 화면과 Server Function은 v1에서 자동 테스트하지 않는다. 얇은 호출 계층이라 수동 확인으로 충분하다고 본다.

## Out of Scope

- Voter 로그인, Member 명단, 중복 Vote 방지(ADR-0001, 이후 버전)
- Operator 개인 계정과 "누가 만들었는지" 기록(ADR-0001, 이후 버전)
- 여러 Organization 지원
- 마감 시각 예약과 자동 마감, 시작 시각 예약
- Draft 상태와 게시 전 검토 흐름
- Poll과 Option의 설명, 후보 사진
- 당선이나 가결 판정, 정족수, 동률 처리
- 이메일이나 푸시 알림
- 공개 Poll 목록, 검색
- 다국어 지원

## Further Notes

- 이 스펙의 일부는 대화에서 사용자가 "추천안대로"로 승인한 기본값이다. 한 사이트에 한 Organization, Selection limit, Operator 직접 마감, Poll link로만 접근, 브라우저 표시, Closed 후 Result 공개가 여기에 해당한다.
- **미결 사항:** Open Poll을 수정하거나 Poll을 삭제하는 기능은 논의하지 않았다. v1은 수정과 삭제를 제공하지 않는 것으로 가정한다. 잘못 만든 Poll은 마감하고 새로 만든다. 필요하면 구현 전에 정한다.
- 용어는 `CONTEXT.md`를 따른다. 특히 "투표"는 Poll만 가리키고, 행위는 Vote라고 쓴다.
