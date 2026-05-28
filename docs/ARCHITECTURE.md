# 아키텍처

## 개요
[앱의 전반적인 구조와 핵심 설계 원칙을 1-3줄로 작성]

## 기술 스택
- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- Vitest + React Testing Library
- Zod
- Anthropic Claude API (`@anthropic-ai/sdk`)

## 디렉토리 구조
```text
src/
├── app/
│   ├── page.tsx                     # 메인 페이지
│   └── api/
│       └── [feature]/
│           └── route.ts             # API route
├── components/                      # UI 컴포넌트
├── lib/                             # 유틸리티 함수, 스키마, 에러
├── services/                        # server-only 외부 API wrapper
└── types/                           # 공통 타입
```

## 주요 패턴
- Server Components를 기본으로 하되, 인터랙션이 필요한 컴포넌트는 Client Component로 구현한다.
- Route Handler는 request validation, service 호출, 에러 매핑을 담당한다.
- Service layer는 외부 provider response를 앱 내부 타입으로 정규화한다.
- Client Component는 앱 API만 호출하고 provider SDK와 API key에 접근하지 않는다.

## 데이터 흐름
```text
[사용자 입력]
  -> [클라이언트 검증]
  -> [API Route]
  -> [Service]
  -> [외부 API / Claude]
  -> [정규화된 결과]
  -> [UI 렌더링]
```

## 에러 taxonomy
- [ERROR_CODE_1]: [설명]
- [ERROR_CODE_2]: [설명]

## 테스트 전략
- 유틸리티 함수는 unit test로 검증한다.
- Service layer는 mocked client로 provider 응답과 에러 매핑을 검증한다.
- API route는 validation, service failure, success path를 검증한다.
- UI는 주요 사용자 플로우를 React Testing Library로 검증한다.

## 배포
- 로컬 개발과 Vercel 배포를 기준으로 설계한다.
- 환경변수는 `.env.local` 또는 배포 환경변수로 주입한다.
