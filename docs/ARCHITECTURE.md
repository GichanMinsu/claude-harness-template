# 아키텍처

## 개요
<!-- 예: "Next.js 단일 앱. UI와 API route를 같은 프로젝트에서 관리하며, 외부 API 호출은 서버 영역으로만 제한한다." -->
[앱의 전반적인 구조와 핵심 설계 원칙을 1-2줄로 작성]

## 기술 스택
<!-- 아래는 기본 스택입니다. 앱에 맞게 교체하세요. -->
- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- Vitest + React Testing Library
- Zod
- Anthropic Claude API (`@anthropic-ai/sdk`)
<!-- 추가 예: Prisma + PostgreSQL, Supabase, Recharts, NextAuth -->

## 디렉토리 구조
```text
src/
├── app/
│   ├── page.tsx                     # 메인 페이지
│   └── api/
│       └── [feature]/               # 예: channel, resume, digest
│           └── route.ts             # API route (외부 API 호출 담당)
├── components/                      # UI 컴포넌트
├── lib/                             # 유틸리티 함수, 스키마, 에러 코드
├── services/                        # server-only 외부 API wrapper
└── types/                           # 공통 타입 정의
```

## 주요 패턴
- Server Components를 기본으로 하되, 인터랙션이 필요한 컴포넌트는 Client Component로 구현한다.
- Route Handler는 request validation, service 호출, 에러 매핑을 담당한다.
- Service layer는 외부 provider response를 앱 내부 타입으로 정규화한다.
- Client Component는 앱 API만 호출하고 provider SDK와 API key에 접근하지 않는다.
<!-- 앱 고유 패턴 추가 예: "DB 조회는 항상 service layer를 거친다." -->

## 데이터 흐름
```text
[사용자 입력]
  -> [클라이언트 검증]        # 예: URL 형식 체크, 필드 유효성
  -> POST /api/[feature]      # Route Handler
  -> [Service]                # 예: claude.ts, youtube.ts
  -> [외부 API / Claude]
  -> [정규화된 결과]
  -> [UI 렌더링]
```
<!-- 파이프라인이 여러 단계인 경우 단계별로 분리해 작성
예: collect -> analyze -> render (각 단계가 별도 API route인 경우) -->

## API Route 책임
<!-- 각 route가 담당하는 것과 하지 않는 것을 명시합니다.
예:
### `POST /api/channel/collect`
- 담당: URL 파싱, YouTube API 호출, 정규화
- 하지 않음: Claude 분석, DB 저장

### `POST /api/channel/analyze`
- 담당: 수집 결과 검증, Claude Tool Use 호출, JSON 반환
- 하지 않음: YouTube API 호출, DB 저장
-->
### `POST /api/[feature]`
- 담당: [request validation, 어떤 service 호출, 어떤 결과 반환]
- 하지 않음: [이 route가 하면 안 되는 것]

## 에러 taxonomy
<!-- 앱의 에러 코드를 여기에 열거합니다. app-errors.ts와 동기화 유지.
예:
- `INVALID_INPUT`: 잘못된 사용자 입력
- `MISSING_API_KEY`: 서버에 API key 미설정
- `PROVIDER_ERROR`: 외부 API 호출 실패
- `AI_REFUSAL`: Claude가 구조화된 응답 생성 거부
-->
- `[ERROR_CODE]`: [설명 — 언제 발생하는지, HTTP status]

## 테스트 전략
- 유틸리티 함수는 unit test로 검증한다.
- Service layer는 mocked client로 provider 응답과 에러 매핑을 검증한다.
- API route는 missing env, invalid request, provider failure, success path를 검증한다.
- UI는 주요 사용자 플로우를 React Testing Library로 검증한다.
<!-- 추가 전략 예: "DB 접근 테스트는 test DB를 사용한다." -->

## 배포
- 로컬 개발과 Vercel 배포를 기준으로 설계한다.
- 환경변수는 `.env.local` 또는 배포 환경변수로 주입한다.
<!-- 다른 배포 환경인 경우 교체: AWS Lambda, Railway, Fly.io 등 -->
