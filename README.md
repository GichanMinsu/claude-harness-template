# Claude Harness Template

Claude Code 기반 하네스 엔지니어링 스타터 템플릿.

Next.js + TypeScript + Anthropic Claude API 조합에 TDD 가드, phase/step 자동 실행, 코드 리뷰 스킬이 미리 셋팅되어 있습니다.

## 포함된 것

| 항목 | 위치 | 설명 |
|---|---|---|
| 초기화 스킬 | `.agents/skills/init/` | `/init` — 프로젝트 이름·스택 선택 → 템플릿 자동 설정 |
| 하네스 실행기 | `scripts/execute.py` | phase/step 단위 Claude Code 자동 실행 |
| TDD 가드 훅 | `.claude/hooks/tdd-guard.sh` | 테스트 없는 구현 파일 수정 차단 |
| Claude Code 설정 | `.claude/settings.json` | PreToolUse 훅 등록 |
| 하네스 스킬 | `.agents/skills/harness/` | `/harness` 워크플로우 |
| 리뷰 스킬 | `.agents/skills/review/` | `/review` 체크리스트 |
| 문서 템플릿 | `docs/` | PRD, ARCHITECTURE, ADR 스텁 |

## 시작하기

### 1. 레포 클론 후 Claude Code 열기

```bash
git clone https://github.com/GichanMinsu/claude-harness-template.git my-app
cd my-app
```

### 2. /init 으로 프로젝트 초기화

Claude Code에서 `/init`을 실행하면 아래 내용을 선택할 수 있습니다.

- 프로젝트 이름
- 기술 스택 프리셋 (6가지 선택지)
- 제품 목표

선택이 완료되면 `CLAUDE.md`, `docs/`, `package.json`, `src/app/layout.tsx`가 자동으로 업데이트됩니다.

**기술 스택 프리셋:**

| # | 프리셋 | 적합한 앱 |
|---|---|---|
| A | 기본 웹앱 | 분석 도구, 대시보드, 콘텐츠 앱 |
| B | 웹앱 + DB | 데이터 저장이 필요한 앱 |
| C | 웹앱 + 인증 | 로그인이 필요한 서비스 |
| D | 풀스택 SaaS | 유료 구독 SaaS |
| E | API Only | 백엔드 서비스, 자동화 도구 |
| F | 직접 구성 | 위 프리셋에 맞지 않는 경우 |

### 3. 환경 변수 설정

`.env.local`을 생성하고 값을 설정합니다. (필요한 환경변수는 `/init` 완료 시 안내됩니다)

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key
CLAUDE_MODEL=claude-sonnet-4-6   # 선택값
```

### 4. 의존성 설치

```bash
npm install
```

### 5. Phase 설계 및 실행

```bash
# Claude Code에서 phase 설계
/harness

# 승인 후 자동 실행
python3 scripts/execute.py {phase-dir}
```

## 검증 명령

```bash
npm run lint
npm run test
npm run build
```

## 하네스 워크플로우

```
1. /init  →  프로젝트 이름 + 스택 선택 → 템플릿 자동 설정
        ↓
2. docs/ 작성  →  PRD, ARCHITECTURE, ADR 채우기
        ↓
3. /harness  →  phase/step 설계 및 승인
        ↓
4. python3 scripts/execute.py {phase}  →  자동 구현
        ↓
5. /review  →  결과 검토
```

각 step은 독립된 Claude Code 세션에서 실행되며, TDD 가드가 테스트 없는 구현을 차단합니다. 실패한 step은 최대 3회 자동 재시도합니다.
