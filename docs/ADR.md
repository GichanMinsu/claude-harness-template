# Architecture Decision Records

## 철학
MVP는 핵심 사용자 플로우를 가장 빠르게 검증하는 구조를 우선한다. provider 호출, 타입, 에러 모델, 테스트 경계는 초기에 명확히 둔다.

---

### ADR-001: Next.js App Router 선택
**결정**: 앱은 Next.js App Router 기반으로 구현한다.

**이유**: UI와 API route를 같은 프로젝트에서 관리할 수 있고 로컬 개발과 Vercel 배포 흐름이 단순하다. 별도 백엔드 서버 없이 외부 API 호출을 서버 route 안에 숨길 수 있다.

**트레이드오프**: 프론트엔드와 백엔드가 완전히 분리된 구조보다 경계가 느슨해질 수 있다. 외부 API 호출을 route handler와 server-only service로 제한해 보완한다.

---

### ADR-002: Anthropic Claude API Tool Use 사용
**결정**: AI 기능은 Anthropic Messages API의 Tool Use로 구현한다.

**이유**: Tool Use의 `tool_choice: {type: "tool"}`로 JSON schema 준수를 강제할 수 있다. 자유 형식 텍스트보다 구조화된 JSON이 UI 안정성, 테스트, 에러 처리에 유리하다.

**트레이드오프**: system prompt와 tool input_schema를 함께 관리해야 한다. schema가 과하게 엄격하면 유효한 응답도 실패할 수 있으므로 UI에 필요한 필드만 schema로 고정한다.

---

### ADR-003: DB 없는 세션 기반 MVP
**결정**: MVP에서는 결과를 DB에 저장하지 않는다.

**이유**: 핵심 흐름 검증이 목적이므로 인증, 스키마 마이그레이션, 히스토리 관리 없이 빠르게 진행한다.

**트레이드오프**: 새로고침하면 결과가 사라진다. 히스토리, 공유, 내보내기는 MVP 이후 기능으로 둔다.

---

<!-- 새 ADR 추가 예시:
### ADR-004: [제목]
**결정**: [결정 내용]
**이유**: [선택 이유]
**트레이드오프**: [단점과 완화 방법]
-->
