# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 명령어

```bash
npm run dev        # 개발 서버 (Turbopack, http://localhost:3000)
npm run build      # 프로덕션 빌드 — 타입 검사도 여기서 수행됨
npm run lint       # ESLint (eslint-config-next core-web-vitals + typescript)
npm run lint:fix
npx shadcn@latest add <component>   # components/ui/ 에 shadcn 컴포넌트 추가
```

테스트 러너는 설정되어 있지 않다. 변경 검증은 `npm run lint`와 `npm run build`로 한다. Node.js 20.19 이상 필요.

## 버전 주의 (학습 데이터와 다름)

- **Next.js 16.4 / React 19.3** — 코드 작성 전 `node_modules/next/dist/docs/`의 해당 문서를 확인할 것 (AGENTS.md 참고).
- `next.config.ts`에서 `cacheComponents: true`, `partialPrefetching: true`가 켜져 있다. 동적 데이터(요청 API, 비캐시 fetch 등)를 다루는 페이지는 `"use cache"` 또는 `<Suspense>` 경계가 필요하다 — `docs/01-app/01-getting-started/08-caching.md`, `02-guides/migrating-to-cache-components.md` 참고.
- 페이지/레이아웃 props는 전역 타입 헬퍼 `LayoutProps<"/">`, `PageProps<"/...">`를 사용한다 (`app/layout.tsx` 참고).
- **Tailwind CSS v4** — `tailwind.config` 파일이 없다. 테마는 `app/globals.css`의 `@theme inline` 및 `:root` / `.dark` CSS 변수로 정의된다. 다크 모드는 `@custom-variant dark (&:is(.dark *))` 클래스 방식.
- **shadcn/ui `base-nova` 스타일 (Radix가 아닌 Base UI `@base-ui/react` 기반)** — 다른 요소로 렌더링할 때 `asChild`가 아니라 `render` prop을 쓴다:
  ```tsx
  <DropdownMenuTrigger render={<Button variant="outline" />}>열기</DropdownMenuTrigger>
  ```
  링크를 버튼 모양으로 만들 때는 `<Link className={buttonVariants({ variant: "outline" })}>`.

## 구조

- `app/layout.tsx`가 전체 셸을 구성한다: `ThemeProvider`(next-themes, `attribute="class"`) → `SiteHeader` → `<main>` → `SiteFooter`. `<html>`에 `suppressHydrationWarning`이 있는 이유는 next-themes 때문이다. `lang="ko"`.
- `lib/site-config.ts`가 사이트 이름·설명·내비게이션·외부 링크의 단일 소스다. 헤더, 모바일 내비(`Sheet`), 푸터, `metadata`(title template `%s | 사이트명`)가 모두 여기서 읽는다. 메뉴 추가 시 이 파일만 수정한다.
- `components/ui/`는 shadcn CLI가 생성하는 파일이므로 직접 수정보다 CLI로 추가/갱신하는 것을 우선한다. 앱 고유 컴포넌트는 `components/layout/` 등 별도 폴더에 둔다.
- 클라이언트 컴포넌트(`"use client"`)는 상호작용이 필요한 곳(`mode-toggle`, `mobile-nav`, `theme-provider`)으로 한정되어 있고 나머지는 서버 컴포넌트다.
- 경로 별칭: `@/*` → 프로젝트 루트. 클래스 병합은 `cn()` (`lib/utils.ts`).

## 개발 서버 접속 호스트

개발 서버는 기본적으로 `localhost`만 허용한다. `next.config.ts`가 `127.0.0.1`과 이 PC의 LAN IPv4 주소를 `allowedDevOrigins`에 자동 추가한다. 그 외 호스트(터널, 사설 도메인 등)로 접속하면 `/_next` 개발 에셋이 차단되어 하이드레이션이 안 되므로(메뉴·테마 토글 미동작) 해당 호스트를 `allowedDevOrigins`에 추가해야 한다.

## 코드 스타일

Prettier 설정은 없다. 기존 파일의 스타일을 따른다: `components/` 하위(shadcn 생성 파일 포함)는 세미콜론 없음, `app/`과 설정 파일은 세미콜론 사용. UI 문구는 한국어.
