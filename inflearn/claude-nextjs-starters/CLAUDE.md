# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 명령어

```bash
npm run dev        # 개발 서버 (Turbopack, http://localhost:3000)
npm run build      # 프로덕션 빌드 — 타입 검사도 여기서 수행됨
npm run start       # 프로덕션 서버 실행 (build 후)
npm run lint        # ESLint (eslint-config-next core-web-vitals + typescript)
npx shadcn@latest add <component>   # components/ui/ 에 shadcn 컴포넌트 추가
```

테스트 러너는 설정되어 있지 않다. 변경 검증은 `npm run lint`와 `npm run build`로 한다. `lint:fix` 스크립트는 없음(`npm run lint`만 존재).

## 버전 주의 (학습 데이터와 다름)

- **Next.js 16.4 / React 19.3** — 코드 작성 전 `node_modules/next/dist/docs/`의 해당 문서를 확인할 것 (AGENTS.md 참고).
- `next.config.ts`에서 `cacheComponents: true`, `partialPrefetching: true`가 켜져 있다. 동적 데이터(요청 API, 비캐시 fetch 등)를 다루는 페이지는 `"use cache"` 또는 `<Suspense>` 경계가 필요하다.
- 페이지/레이아웃 props는 전역 타입 헬퍼 `LayoutProps<"/">`, `PageProps<"/...">`를 사용한다 (`app/layout.tsx` 참고).
- **Tailwind CSS v4** — `tailwind.config` 파일이 없다. 테마는 `app/globals.css`의 `@theme inline` 및 `:root` / `.dark` CSS 변수(oklch)로 정의된다. 다크 모드는 `@custom-variant dark (&:is(.dark *))` 클래스 방식 + `next-themes`(`attribute="class"`)가 `<html>`에 `.dark` 클래스를 토글.
- **shadcn/ui `base-nova` 스타일 (Radix가 아닌 Base UI `@base-ui/react` 기반)** — 다른 요소로 렌더링할 때 `asChild`가 아니라 `render` prop을 쓴다:
  ```tsx
  <DropdownMenuTrigger render={<Button variant="outline" />}>열기</DropdownMenuTrigger>
  ```
  링크를 버튼 모양으로 만들 때는 `<Link className={buttonVariants({ variant: "outline" })}>`.

## 구조

- `app/layout.tsx`가 전체 셸을 구성한다: `ThemeProvider`(next-themes) → `SiteHeader` → `<main>` → `SiteFooter`. `<html>`에 `suppressHydrationWarning`이 있는 이유는 next-themes 때문이다. `lang="ko"`.
- `lib/site-config.ts`가 사이트 이름·설명·내비게이션·외부 링크의 단일 소스다. 헤더(`site-header.tsx`), 모바일 내비(`mobile-nav.tsx`의 `Sheet`), 푸터(`site-footer.tsx`), `metadata`(title template `%s | 사이트명`)가 모두 여기서 읽는다. 메뉴·링크 추가 시 이 파일만 수정하면 전체에 반영된다.
- 다크모드 토글은 `components/mode-toggle.tsx`(`useTheme().setTheme`)가 담당하며 헤더 우측에 배치되어 있다.
- `components/ui/`는 shadcn CLI가 생성하는 파일이므로 직접 수정보다 CLI로 추가/갱신하는 것을 우선한다. 앱 고유 컴포넌트는 `components/layout/`(헤더/푸터/모바일 내비)과 `components/` 루트(`mode-toggle`, `theme-provider`)에 둔다.
- 클라이언트 컴포넌트(`"use client"`)는 상호작용이 필요한 곳(`mode-toggle`, `mobile-nav`, `theme-provider`)으로 한정되어 있고 나머지는 서버 컴포넌트다.
- 경로 별칭: `@/*` → 프로젝트 루트 (`tsconfig.json`, `components.json`). 클래스 병합은 `cn()` (`lib/utils.ts`).

## MCP / Claude Code 설정

- `.mcp.json`에 Playwright MCP 서버(`@playwright/mcp@latest`, stdio)가 설정되어 있고 `.claude/settings.local.json`에서 허용됨. 브라우저 자동화·스크린샷 검증이 필요하면 이 서버를 사용한다.

## 코드 스타일

Prettier 설정은 없다. 기존 파일의 스타일을 따른다: `components/` 하위(shadcn 생성 파일 포함)는 세미콜론 없음, `app/`과 설정 파일은 세미콜론 사용. UI 문구는 한국어.
