# 프로젝트: [PROJECT_NAME]
<!-- 예: BrushLearn, ResumeAI, DailyDigest -->

## 기술 스택
<!-- 아래는 기본 스택입니다. 앱에 맞게 교체하세요. -->
- Next.js App Router <!-- 예: React + Vite (SPA), Express + EJS (서버 렌더링) -->
- TypeScript strict mode
- Tailwind CSS <!-- 예: CSS Modules, styled-components -->
- Vitest + React Testing Library
- Anthropic Claude API
<!-- 추가 의존성 예: Prisma (DB), Supabase (BaaS), Zod (validation), Recharts (차트) -->

## 제품 목표
<!-- 예: "사용자가 URL 하나를 입력하면 AI가 콘텐츠를 분석해 실행 가능한 인사이트를 제공한다." -->
- [제품이 해결하는 핵심 문제를 1줄로 작성]
<!-- 예: "MVP는 분석 보고서보다 즉시 실행 가능한 체크리스트를 우선한다." -->
- [MVP의 핵심 기능을 1-2줄로 작성]

## 아키텍처 규칙
- CRITICAL: 외부 API 호출은 `src/app/api/**/route.ts`와 server-only service에서만 처리한다.
- CRITICAL: Client Component에서 외부 API를 직접 호출하지 않는다.
- CRITICAL: API key, provider raw error, 내부 stack trace를 클라이언트에 노출하지 않는다.
- 컴포넌트는 `src/components/`에 둔다.
- 공통 타입은 `src/types/`에 둔다.
- 유틸리티 함수는 `src/lib/`에 둔다.
- 외부 API wrapper는 `src/services/`에 두고 server-only boundary를 유지한다.
<!-- 앱 고유 규칙 추가 예: "DB 접근은 src/services/db.ts에서만 허용한다." -->

## 개발 프로세스
- CRITICAL: 새 기능 구현 시 반드시 테스트를 먼저 작성하고, 테스트가 통과하는 구현을 작성할 것 (TDD).
- 구현 전 `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`를 읽고 현재 범위를 확인한다.
- 제품 범위가 바뀌면 관련 docs를 먼저 업데이트한다.
- 커밋 메시지는 conventional commits 형식을 따른다: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.

## 환경 변수
- `ANTHROPIC_API_KEY`: Anthropic Claude API key.
- `CLAUDE_MODEL`: 선택값. 설정하지 않으면 `claude-sonnet-4-6`을 사용한다.
<!-- 앱 고유 환경변수 추가 예: `DATABASE_URL`, `YOUTUBE_API_KEY`, `STRIPE_SECRET_KEY` -->

## 명령어
```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
npm run test     # 테스트
```

## 초기 설정 (레포 클론 후 1회)
```bash
git config core.hooksPath .githooks   # pre-commit 훅 활성화 (lint + build + test)
cp .env.example .env.local            # 환경변수 파일 생성
```
