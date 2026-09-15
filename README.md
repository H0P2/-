# 김희망 — Interactive 3D Personal Space

AI 서버 없이 **GitHub Pages에서 바로 배포할 수 있는 정적 3D 개인 사이트**입니다.

## 포함 기능
- Three.js 기반 3D 개인 공간
- 마우스 드래그 / 휠 확대·축소
- 3D 오브젝트 클릭으로 섹션 이동
- 홈 / 소개 / 강점·취향 / 경험 / 좋아하는 것 / 프로젝트 / 방문자 기록
- 조명 전환
- IndexedDB 기반 방문 행동 기록(브라우저 내부에만 저장)
- 반응형 레이아웃

## GitHub Pages 배포
1. 이 폴더의 파일을 새 GitHub repository에 업로드합니다.
2. GitHub repository의 **Settings → Pages**로 이동합니다.
3. **Deploy from a branch**를 선택하고 `main` / `/ (root)`를 선택한 뒤 저장합니다.
4. 생성된 `https://<사용자명>.github.io/<저장소명>/` 주소로 접속합니다.

## 파일
- `index.html` — 페이지 구조
- `style.css` — 디자인
- `script.js` — 3D 장면, 인터랙션, IndexedDB

## 개인정보
방문 행동 데이터는 서버로 전송하지 않고 각 방문자의 브라우저 IndexedDB에 저장됩니다.

> 현재 버전에는 Node.js 서버, OpenAI API, API 키, `.env`가 필요하지 않습니다.
