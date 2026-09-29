-- 모든 Poll은 Closing time을 가진다. 기존 Poll은 다음 규칙으로 채운다.
-- Open Poll: 이 마이그레이션 시점부터 3일 뒤. Closed Poll: Operator가 마감한 시각(없으면 만든 시각).
ALTER TABLE polls ADD COLUMN closes_at timestamptz;

UPDATE polls
SET closes_at = CASE
  WHEN status = 'closed' THEN coalesce(closed_at, created_at)
  ELSE now() + interval '3 days'
END;

ALTER TABLE polls ALTER COLUMN closes_at SET NOT NULL;
