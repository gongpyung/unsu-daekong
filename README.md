# loddo

귀여운 한국 로또 번호 생성기 — [loddo.kr](https://loddo.kr)

## 기능

- **3가지 생성 모드**: 랜덤 / 핫번호 (최다 출현) / 콜드번호 (최소 출현)
- **고급 설정**: 포함/제외할 번호 지정
- **롤링 애니메이션**: 번호가 하나씩 멈추는 슬롯머신 효과
- **즉시 뽑기**: 애니메이션 없이 빠르게 번호 확인
- **최근 기록**: 최대 20개까지 로컬 저장
- **다크 모드**: 라이트/다크 테마 전환
- **중복 방지**: 역대 당첨번호와 동일한 조합 자동 회피
- **반응형**: 모바일/데스크톱 대응

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:8080 에서 확인할 수 있습니다.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (port 8080) |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint 검사 |
| `npm run test` | 테스트 실행 |
| `npm run fetch-data` | 최신 로또 당첨번호 업데이트 |

## 기술 스택

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui · Vitest
