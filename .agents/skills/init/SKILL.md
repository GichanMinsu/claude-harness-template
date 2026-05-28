---
name: init
description: "새 프로젝트를 시작할 때 사용. 프로젝트 이름과 기술 스택 프리셋을 선택받아 CLAUDE.md, docs/, package.json을 초기화한다. 사용자가 '새 앱', '새 프로젝트', '시작', '/init'을 언급할 때 실행한다."
---

# 프로젝트 초기화 워크플로우

새 프로젝트를 시작할 때 아래 순서로 진행한다.

## Step 1 — 프로젝트 이름 수집

사용자에게 프로젝트 이름을 묻는다.

> "프로젝트 이름이 무엇인가요? (예: BrushLearn, ResumeAI, DailyDigest)"

## Step 2 — 기술 스택 프리셋 제안

아래 5가지 프리셋을 표로 제시하고 선택을 요청한다.

| # | 프리셋 | 포함 스택 | 적합한 앱 |
|---|---|---|---|
| A | **기본 웹앱** | Next.js + Tailwind + Claude API | 분석 도구, 대시보드, 콘텐츠 앱 |
| B | **웹앱 + DB** | Next.js + Tailwind + Prisma + PostgreSQL + Claude API | 데이터 저장이 필요한 앱 |
| C | **웹앱 + 인증** | Next.js + Tailwind + NextAuth + Claude API | 로그인이 필요한 서비스 |
| D | **풀스택 SaaS** | Next.js + Tailwind + Prisma + NextAuth + Stripe + Claude API | 유료 구독 SaaS |
| E | **API Only** | Next.js API Routes + Zod + Claude API (UI 없음) | 백엔드 서비스, 자동화 도구 |
| F | **직접 구성** | 사용자가 직접 스택을 나열 | 위 프리셋에 맞지 않는 경우 |

## Step 3 — 제품 목표 수집 (선택)

> "어떤 문제를 해결하는 앱인가요? 1-2줄로 설명해주세요. (나중에 채워도 됩니다)"

## Step 4 — 파일 업데이트

수집한 정보를 바탕으로 아래 파일들을 업데이트한다.

### CLAUDE.md 업데이트 규칙

- `[PROJECT_NAME]`을 실제 이름으로 교체
- `## 기술 스택` 섹션을 선택한 프리셋으로 교체 (주석 제거)
- `## 제품 목표`를 수집한 내용으로 교체 (없으면 플레이스홀더 유지)
- `## 환경 변수`에 프리셋별 추가 환경변수 삽입:
  - B (DB): `DATABASE_URL`
  - C (Auth): `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
  - D (SaaS): `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

### docs/PRD.md 업데이트 규칙

- `[PROJECT_NAME]`을 실제 이름으로 교체
- 제품 목표를 수집한 경우 `## 목표` 섹션에 반영

### docs/ADR.md 업데이트 규칙

프리셋에 따라 관련 ADR을 추가하거나 교체한다.

- **B (DB)**: ADR-003을 "Prisma + PostgreSQL 선택"으로 교체
- **C (Auth)**: ADR-004 "NextAuth 선택" 추가
- **D (SaaS)**: ADR-003 DB 교체 + ADR-004 Auth + ADR-005 "Stripe 선택" 추가
- **E (API Only)**: ADR-001을 "Next.js API Routes (UI 없음)" 으로 교체

### package.json 업데이트 규칙

- `"name"` 필드를 프로젝트 이름의 kebab-case로 변경
- 프리셋별 추가 의존성 안내 (실제 install 명령 제안):

| 프리셋 | 추가 패키지 |
|---|---|
| B | `npm install prisma @prisma/client` |
| C | `npm install next-auth` |
| D | `npm install prisma @prisma/client next-auth stripe` |
| E | `recharts`, `lucide-react` 제거 제안 |

### src/app/layout.tsx 업데이트

- `title`과 `description`의 `[PROJECT_NAME]` 플레이스홀더를 실제 이름으로 교체

## Step 5 — 완료 안내

업데이트가 완료되면 다음을 안내한다.

1. `.env.local` 생성 및 환경변수 설정 방법
2. 추가 패키지 설치 명령 (해당하는 경우)
3. 다음 단계: `docs/PRD.md`, `docs/ARCHITECTURE.md`를 채운 뒤 `/harness`로 phase 설계 시작
