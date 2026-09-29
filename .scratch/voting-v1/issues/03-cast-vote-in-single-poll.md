# 03: Single Poll에 Vote하기

**What to build:** Voter가 Poll link에서 Option 하나를 고르고, 고른 Option을 확인한 뒤 제출한다. 제출하면 "Vote했습니다" 확인이 보이고, 같은 브라우저로 다시 열면 "이미 Vote했습니다"가 보인다. 아무것도 고르지 않으면 제출할 수 없다. 스펙의 User Stories 25, 29–32, 36에 해당한다. ADR-0001에 따라 서버는 중복 Vote를 막지 않으며, 브라우저 표시는 실수 방지용 UX일 뿐이다.

**Blocked by:** 02 (Single Poll 만들기와 Poll link 열기)

**Status:** ready-for-agent

- [ ] castVote는 Open Poll에 Vote 하나를 votes 한 행과, 고른 Option마다 vote_selections 한 행으로 기록한다
- [ ] castVote는 Option이 0개이거나, Selection limit을 넘거나, 서로 중복되거나, 다른 Poll의 Option이면 구분 가능한 도메인 오류로 거부한다
- [ ] 상태 확인과 기록은 한 트랜잭션에서 처리한다
- [ ] Voter를 식별하는 정보(IP, 쿠키 값, 브라우저 지문 등)는 저장하지 않는다
- [ ] 제출 전에 고른 Option을 확인하는 단계가 있다
- [ ] 제출에 성공하면 브라우저 저장소에 "이 Poll에 Vote함"을 남기고, 표시가 있으면 Vote 화면 대신 "이미 Vote했습니다"를 보여준다. 서버는 이 표시를 확인하지 않는다
- [ ] 도메인 오류는 한국어 안내로 보인다
- [ ] Single Poll에서 castVote의 허용과 거부 사례에 대한 도메인 모듈 테스트가 있다
