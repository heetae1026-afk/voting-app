# 01: Operator sign-in

**What to build:** Operator가 Operator token을 입력하면 Operator 화면에 들어가고, 이 브라우저에서 한동안 로그인 상태가 유지되며, 로그아웃할 수 있다. 틀린 토큰에는 명확한 오류가 보이고, 세션 없이 Operator 화면에 들어오면 로그인 화면으로 보낸다. 이 티켓에서 Operator 화면은 빈 자리표시자여도 된다. 스펙의 User Stories 1–5, Implementation Decisions "Operator 인증"에 해당한다. ADR-0001에 따라 모든 Operator가 토큰 하나를 공유하며 개인을 구분하지 않는다.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Operator token은 서버 환경변수에서만 읽고, 코드와 저장소에는 없다
- [ ] 입력한 토큰은 상수 시간 비교로 확인한다
- [ ] 맞는 토큰이면 서명된 httpOnly 세션 쿠키를 발급하며, 세션에는 "Operator임" 외의 정보가 없다
- [ ] Operator token을 바꾸면 기존 세션이 모두 무효가 된다
- [ ] 틀린 토큰에는 한국어 오류 안내가 보이고 세션이 발급되지 않는다
- [ ] 세션 없이 Operator 화면에 접근하면 로그인 화면으로 이동한다
- [ ] 로그아웃하면 세션이 사라지고 Operator 화면에 다시 들어갈 수 없다
- [ ] Operator 여부 확인은 재사용 가능한 서버 측 검사로 만들어, 이후 Operator 전용 Server Function이 매번 호출할 수 있다. proxy 단계의 보호만 믿지 않는다
- [ ] 토큰 비교와 세션 발급·검증은 순수 함수로 분리되어 Vitest 단위 테스트가 있다. 이 티켓에서 Vitest를 처음 설정한다면 여기서 도입한다
