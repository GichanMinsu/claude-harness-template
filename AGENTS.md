# 프로젝트: [PROJECT_NAME]

## 기술 스택
- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- Vitest + React Testing Library
- Anthropic Claude API

## 제품 목표
- [제품이 해결하는 핵심 문제를 1줄로 작성]
- [MVP의 핵심 기능을 1-3줄로 작성]

## 아키텍처 규칙
- CRITICAL: 외부 API 호출은 `src/app/api/**/route.ts`와 server-only service에서만 처리한다.
- CRITICAL: Client Component에서 외부 API를 직접 호출하지 않는다.
- CRITICAL: API key, provider raw error, 내부 stack trace를 클라이언트에 노출하지 않는다.
- 컴포넌트는 `src/components/`에 둔다.
- 공통 타입은 `src/types/`에 둔다.
- 유틸리티 함수는 `src/lib/`에 둔다.
- 외부 API wrapper는 `src/services/`에 두고 server-only boundary를 유지한다.

## 개발 프로세스
- CRITICAL: 새 기능 구현 시 반드시 테스트를 먼저 작성하고, 테스트가 통과하는 구현을 작성할 것 (TDD).
- 구현 전 `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`를 읽고 현재 범위를 확인한다.
- 제품 범위가 바뀌면 관련 docs를 먼저 업데이트한다.
- 커밋 메시지는 conventional commits 형식을 따른다: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.

## 환경 변수
- `ANTHROPIC_API_KEY`: Anthropic Claude API key.
- `CLAUDE_MODEL`: 선택값. 설정하지 않으면 `claude-sonnet-4-6`을 사용한다.

## 명령어
```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
npm run test     # 테스트
```
