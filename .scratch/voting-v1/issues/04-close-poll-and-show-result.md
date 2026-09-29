# 04: Poll 마감과 Result 보기

**What to build:** Operator가 확인을 거쳐 Open Poll을 마감하면 Closed가 되고, 다시 열 수 없다. Closed Poll은 Vote를 받지 않는다. Operator는 Open 중에도 언제든 Result를 보고, Voter는 Poll이 Closed된 뒤에만 Poll link에서 Result를 본다. Result는 Option 순서대로 Option별 선택 수, 비율, 전체 Vote 수를 보여준다. 스펙의 User Stories 19–22, 33–34, 37–39, 41–42에 해당한다.

**Blocked by:** 03 (Single Poll에 Vote하기)

**Status:** ready-for-agent

- [ ] closePoll은 Open Poll을 Closed로 바꾸고 마감 시각을 기록하며, 이미 Closed면 아무것도 바꾸지 않는다. 다시 여는 기능은 없다
- [ ] Closed Poll에 대한 castVote는 도메인 오류로 거부되고, 마감과 동시에 들어온 Vote도 마감 후에는 기록되지 않는다
- [ ] getResult는 Option별 선택 수, 전체 Vote 수, 비율(선택 수 ÷ 전체 Vote 수)을 Option 순서대로 돌려준다
- [ ] getResult는 보는 사람이 Voter이고 Poll이 Open이면 "아직 비공개"를 돌려주고, Operator에게는 항상 공개한다
- [ ] Vote가 0개인 Poll의 Result는 오류 없이 모든 수 0으로 보인다
- [ ] Operator 화면에서 마감 전에 확인을 받고, 마감과 Operator용 Result Server Function은 매번 Operator 세션을 확인한다
- [ ] Voter가 Closed Poll의 Poll link를 열면 마감 안내와 Result가 보인다
- [ ] Voter가 보고 있는 동안 Poll이 마감되어 제출이 거부되면 마감 안내가 보인다
- [ ] closePoll, Closed Poll에 대한 castVote, getResult의 공개 규칙과 계산에 대한 도메인 모듈 테스트가 있다
