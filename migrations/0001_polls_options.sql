CREATE TABLE polls (
  id text PRIMARY KEY,
  question text NOT NULL CHECK (length(question) > 0),
  selection_mode text NOT NULL CHECK (selection_mode IN ('single', 'multiple')),
  selection_limit integer NOT NULL CHECK (selection_limit >= 1),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz
);

CREATE TABLE options (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  poll_id text NOT NULL REFERENCES polls (id) ON DELETE CASCADE,
  label text NOT NULL CHECK (length(label) > 0),
  position integer NOT NULL,
  UNIQUE (poll_id, position),
  UNIQUE (poll_id, label)
);
