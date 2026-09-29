# Voting App

동아리·학생회 같은 소규모 조직의 실제 선거와 의사결정을 지원하는 투표 도구. Operator가 Poll을 올리면 Voter가 Option을 골라 Vote하고 Result를 확인한다.

## Language

### 사람과 조직

**Organization** (조직):
투표 도구를 사용하는 동아리·학생회 등 소규모 조직. 한 사이트는 한 Organization만 쓴다.
_Avoid_: Group, Team, 단체

**Operator** (운영자):
Organization에서 Poll을 만들고 관리하는 사람.
_Avoid_: Admin, Manager, 관리자, 투표 생성자, Creator

**Operator token** (운영자 토큰):
Operator임을 증명하는 비밀 값. 모든 Operator가 하나를 공유하며, 토큰으로는 Operator 개인을 구분하지 않는다.
_Avoid_: Admin password, 관리자 비밀번호, API key

**Member** (조직 구성원):
Organization에 속한 사람.
_Avoid_: User, 회원

**Voter** (투표자):
Poll에 참여할 자격이 있는 Member.
_Avoid_: Participant, 참여자, 유권자

### 투표

**Poll** (투표):
Member에게 결정을 묻기 위해 만든 하나의 질문과 여러 Option의 집합.
_Avoid_: Survey, 설문, Election, Question(엔티티 이름으로)

**Option** (선택지):
하나의 Poll에 속하며 Voter가 고를 수 있는 개별 항목.
_Avoid_: Choice, Answer, 항목, Candidate(엔티티 이름으로)

**Selection mode** (선택 방식):
Operator가 Poll마다 정하는 설정으로, Single(단일 선택) 또는 Multiple(복수 선택) 중 하나.
_Avoid_: Vote type, Poll type, 투표 유형

**Selection limit** (최대 선택 수):
Selection mode가 Multiple인 Poll에서 한 Vote로 고를 수 있는 Option의 최대 개수. Operator가 Poll마다 정한다.
_Avoid_: Max choices, 최대 개수, Quota

**Closing time** (마감 시각):
Poll이 Closed가 되는 시각. Operator가 Poll을 만들 때 반드시 정하며, 앞당길 수는 있지만 늦출 수는 없다.
_Avoid_: Deadline, End date, 종료일, 마감일

**Open / Closed** (진행 중 / 마감):
Poll의 상태. Closing time 전이면 Open이고, Closing time이 지나거나 Operator가 지금 마감하면 Closed가 된다. Closed Poll은 Vote를 받지 않는다.
_Avoid_: Active/Inactive, Ended, 종료

**Poll link** (투표 링크):
Voter가 Poll에 들어오는 유일한 경로로, 추측할 수 없는 주소. Operator가 조직 안에 공유한다.
_Avoid_: URL, Invite link, 초대 링크

**Vote** (투표 행위):
한 Voter가 한 Poll에서 그 Poll의 Selection mode에 따라 하나 또는 여러 개의 Option을 고르는 행위.
_Avoid_: Ballot, Response, 응답, "투표"(행위를 가리킬 때)

**Result** (결과):
한 Poll의 Option별 선택 수와 전체 Vote 수의 집계. Voter에게는 Poll이 Closed된 뒤에 공개된다.
_Avoid_: Tally, Score, 통계, Winner, 당선, 1위(앱은 판정하지 않는다)
