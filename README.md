# Claude Harness Template

Claude Code 기반 하네스 엔지니어링 스타터 템플릿.

Next.js + TypeScript + Anthropic Claude API 조합에 TDD 가드, phase/step 자동 실행, 코드 리뷰 스킬이 미리 셋팅되어 있습니다.

## 포함된 것

| 항목 | 위치 | 설명 |
|---|---|---|
| 하네스 실행기 | `scripts/execute.py` | phase/step 단위 Claude Code 자동 실행 |
| TDD 가드 훅 | `.claude/hooks/tdd-guard.sh` | 테스트 없는 구현 파일 수정 차단 |
| Claude Code 설정 | `.claude/settings.json` | PreToolUse 훅 등록 |
| 하네스 스킬 | `.agents/skills/harness/` | `/harness` 워크플로우 |
| 리뷰 스킬 | `.agents/skills/review/` | `/review` 체크리스트 |
| 문서 템플릿 | `docs/` | PRD, ARCHITECTURE, ADR 스텁 |

## 시작하기

### 1. 프로젝트 정의

`CLAUDE.md`의 `[PROJECT_NAME]`과 플레이스홀더를 채운다.

`docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`를 프로젝트에 맞게 작성한다.

### 2. 환경 변수 설정

`.env.local`을 생성하고 아래 값을 설정한다.

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key
CLAUDE_MODEL=claude-sonnet-4-6   # 선택값
```

### 3. 의존성 설치

```bash
npm install
```

### 4. Phase 설계 및 실행

Claude Code에서 `/harness`로 phase를 설계하고, 승인 후 실행한다.

```bash
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
1. CLAUDE.md + docs/ 작성
        ↓
2. /harness 로 phase/step 설계
        ↓
3. python3 scripts/execute.py {phase}
        ↓
4. /review 로 결과 검토
```

각 step은 독립된 Claude Code 세션에서 실행되며, TDD 가드가 테스트 없는 구현을 차단합니다. 실패한 step은 최대 3회 자동 재시도합니다.
