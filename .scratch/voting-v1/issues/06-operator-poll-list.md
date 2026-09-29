# 06: Operator의 Poll 목록

**What to build:** Operator가 지금까지 만든 모든 Poll을 최신순 목록으로 보고, 각 Poll의 질문, Open/Closed 상태, 현재 Vote 수를 한눈에 확인하며, 목록에서 Poll link를 다시 복사할 수 있다. Operator token을 공유하는 모든 Operator가 같은 목록을 본다. 스펙의 User Stories 16–18, 23에 해당한다.

**Blocked by:** 03 (Single Poll에 Vote하기)

**Status:** ready-for-agent

- [ ] listPolls는 모든 Poll의 질문, 상태, Vote 수, 생성 시각을 최신순으로 돌려준다
- [ ] listPolls Server Function은 매번 Operator 세션을 확인한다
- [ ] Operator 화면 첫 페이지가 이 목록이며, Poll이 없으면 빈 상태 안내와 Poll 만들기 버튼이 보인다
- [ ] 목록의 각 Poll에서 Poll link를 복사할 수 있다
- [ ] 04가 먼저 끝났다면 목록에서 각 Poll의 마감과 Result 화면으로 갈 수 있다. 04가 아직이면 이 항목은 04에서 연결한다
- [ ] listPolls의 정렬, 상태, Vote 수에 대한 도메인 모듈 테스트가 있다
