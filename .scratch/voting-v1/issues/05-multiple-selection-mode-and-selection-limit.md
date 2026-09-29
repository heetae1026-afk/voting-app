# 05: Multiple Selection mode와 Selection limit

**What to build:** Operator가 Poll을 만들 때 Selection mode를 Multiple로 정하고 Selection limit을 정할 수 있다. Voter는 몇 개까지 고를 수 있는지 안내받고 그만큼 여러 Option을 골라 Vote하며, Selection limit을 넘게 고르면 막힌다. Result의 비율은 전체 Vote 수 대비 각 Option을 고른 비율이라, 합이 100%를 넘을 수 있다는 것을 화면에서 이해할 수 있다. 스펙의 User Stories 10–11, 13, 26–28, 40에 해당한다.

**Blocked by:** 04 (Poll 마감과 Result 보기)

**Status:** ready-for-agent

- [ ] createPoll은 Multiple을 받고, Selection limit이 2 이상이고 Option 수 이하일 때만 허용하며, 아니면 구분 가능한 도메인 오류로 거부한다
- [ ] Poll 작성 폼에서 Selection mode를 고르고, Multiple이면 Selection limit을 입력한다
- [ ] Poll link 화면은 Multiple이면 여러 Option을 고를 수 있게 하고, "최대 N개" 안내를 보여주며, Selection limit을 넘는 선택을 막는다
- [ ] castVote는 Multiple Poll에서 1개 이상 Selection limit 이하의 서로 다른 Option만 허용한다
- [ ] Result 화면은 Multiple Poll에서 비율이 전체 Vote 수 기준임을 알린다
- [ ] Multiple 검증 경계값, Multiple castVote의 허용과 거부, Multiple Result 계산에 대한 도메인 모듈 테스트가 있다
