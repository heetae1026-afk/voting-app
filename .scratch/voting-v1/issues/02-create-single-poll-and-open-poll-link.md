# 02: Single Poll 만들기와 Poll link 열기

**What to build:** Operator가 질문과 2개 이상의 Option을 입력해 Single Poll을 만들면 Poll link를 받고 한 번에 복사할 수 있다. Voter가 Poll link를 열면 로그인 없이 질문과 Option이 정한 순서대로 보인다. 없는 Poll link를 열면 "찾을 수 없음" 안내가 보인다. 이 티켓은 이후 모든 티켓이 쓰는 Poll 도메인 모듈, DB 스키마, 테스트 기반도 함께 세운다. 스펙의 User Stories 6–9, 12, 14–15, 24, 35, Implementation Decisions "Poll 도메인 모듈", "스키마", Testing Decisions에 해당한다.

**Blocked by:** 01 (Operator sign-in)

**Status:** ready-for-agent

- [ ] Poll 도메인 모듈은 SQL 실행기를 주입받아, 운영에서는 Neon(`@neondatabase/serverless`), 테스트에서는 PGlite를 쓴다
- [ ] 저장소 안 SQL 마이그레이션으로 polls, options, votes, vote_selections 네 테이블을 만들고, 운영과 테스트가 같은 마이그레이션을 쓴다
- [ ] Vitest 테스트는 테스트마다 새 PGlite DB에 마이그레이션을 적용하고 시작한다
- [ ] createPoll은 Open 상태의 Single Poll을 만들고, 추측할 수 없는 URL-safe 무작위 ID(128비트 이상)를 돌려준다. Single의 Selection limit은 1로 고정한다
- [ ] createPoll은 Option이 2개 미만이거나, 공백 제거 후 빈 Option이 있거나, 중복 Option이 있으면 구분 가능한 도메인 오류로 거부한다
- [ ] getPollForVoting은 질문, 순서가 정해진 Option, Selection mode, Selection limit, 상태를 돌려주고, 없는 ID에는 "없음"을 돌려준다
- [ ] Operator 화면의 Poll 작성 폼에서 Option을 추가, 삭제하고 순서를 바꿀 수 있으며, 도메인 오류는 한국어 안내로 보인다
- [ ] Poll 생성 Server Function은 매번 Operator 세션을 확인한다(01의 검사 사용)
- [ ] 생성 직후 Poll link가 보이고 복사 버튼이 있다
- [ ] Poll link 화면은 한국어이고 모바일 우선이며, 이 티켓에서는 Option을 보여주기만 하고 제출 기능은 없어도 된다
- [ ] 홈 화면에 Poll 목록이 없다
- [ ] 위 검증 규칙과 getPollForVoting 동작에 대한 도메인 모듈 테스트가 있다
