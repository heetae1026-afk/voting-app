-- ADR-0001: Vote에는 Voter를 식별하는 정보를 담지 않는다.
CREATE TABLE votes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  poll_id text NOT NULL REFERENCES polls (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX votes_poll_id_idx ON votes (poll_id);

-- Vote 하나가 고른 Option마다 한 행.
CREATE TABLE vote_selections (
  vote_id bigint NOT NULL REFERENCES votes (id) ON DELETE CASCADE,
  option_id bigint NOT NULL REFERENCES options (id) ON DELETE CASCADE,
  PRIMARY KEY (vote_id, option_id)
);

CREATE INDEX vote_selections_option_id_idx ON vote_selections (option_id);
