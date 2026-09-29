/** 도메인 모듈이 의존하는 최소한의 SQL 실행기. 운영은 Neon, 테스트는 PGlite가 구현한다. */
export interface Db {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
}
