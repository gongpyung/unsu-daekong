<div align="center">

# 🍀 운수대콩 (loddo)

**귀여운 로또 번호 생성기**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-00D9FF?style=for-the-badge&logo=github)](https://loddo.kr)

[사이트 바로가기](https://loddo.kr) · [기능 요청](https://github.com/gongpyung/loddo/issues)

</div>

---

## 🎯 소개

**loddo**는 역대 당첨번호를 분석해 로또 번호를 생성하는 웹앱입니다.

- 🎲 **3가지 모드** — 랜덤, 핫번호(최다 출현), 콜드번호(최소 출현)
- 📊 **빈도 분석** — 1,200회 이상의 역대 당첨 데이터 기반
- 🚫 **중복 방지** — 역대 당첨번호와 동일 조합 자동 회피
- 🌙 **다크 모드** — 라이트/다크 테마 전환
- 📱 **반응형** — 모바일/데스크톱 대응

---

## ✨ 주요 기능

<table>
<tr>
<td width="50%">

### 🎰 롤링 애니메이션
번호가 하나씩 멈추는 슬롯머신 효과

</td>
<td width="50%">

### ⚡ 즉시 뽑기
애니메이션 없이 빠르게 번호 확인

</td>
</tr>
<tr>
<td width="50%">

### ⚙️ 고급 설정
포함/제외할 번호를 직접 지정

</td>
<td width="50%">

### 📋 최근 기록
최대 20개까지 로컬에 자동 저장

</td>
</tr>
</table>

---

## 🚀 빠른 시작

```bash
# 저장소 클론
git clone https://github.com/gongpyung/loddo.git
cd loddo

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:8080 접속

---

## 📦 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (port 8080) |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint 검사 |
| `npm run test` | 테스트 실행 |
| `npm run fetch-data` | 최신 로또 당첨번호 업데이트 |

---

## 🔧 기술 스택

| 영역 | 기술 |
|------|------|
| **Framework** | React 18, TypeScript |
| **Build** | Vite (SWC) |
| **Styling** | Tailwind CSS, shadcn/ui (Radix) |
| **Testing** | Vitest, React Testing Library |
| **Hosting** | GitHub Pages |
| **CI/CD** | GitHub Actions (자동 배포 + 매주 당첨번호 업데이트) |

---

<div align="center">

**loddo** — 오늘의 행운 번호를 뽑아보세요 🍀

</div>
