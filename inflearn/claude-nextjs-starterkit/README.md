# Next.js Starter Kit

웹 개발을 빠르게 시작하기 위한 스타터킷입니다. 각 도구의 공식 설치 가이드를 그대로 따라 설정했습니다.

## 기술 스택

| 도구 | 버전 | 비고 |
| --- | --- | --- |
| Next.js | 16.4 | App Router, Turbopack, Cache Components |
| React | 19.3 | |
| TypeScript | 5 | strict, `@/*` 경로 별칭 |
| Tailwind CSS | 4.3 | `@tailwindcss/postcss` 사용, `tailwind.config` 없음 |
| shadcn/ui | CLI 4 | `base-nova` 스타일 (Base UI 기반), CSS 변수 테마 |
| lucide-react | 1.x | shadcn 기본 아이콘 라이브러리 |
| next-themes | 0.4 | 다크 모드 (라이트/다크/시스템) |

## 요구 사항

- Node.js **20.19 이상** 권장 (Next.js 최소 20.9, 일부 ESLint·shadcn 의존성은 20.19 이상 필요)

## 시작하기

```bash
npm install
npm run dev      # http://localhost:3000
```

| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 (Turbopack) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 |
| `npm run lint` / `lint:fix` | ESLint 검사 / 자동 수정 |

> 개발 서버는 기본적으로 `localhost`만 허용합니다. `127.0.0.1`이나 이 PC의 IP 외에 다른 호스트(터널, 사설 도메인 등)로 접속하면 JS가 로드되지 않아 메뉴·테마 토글이 동작하지 않으니, `next.config.ts`의 `allowedDevOrigins`에 추가하세요.

## 폴더 구조

```
app/
  layout.tsx          # 루트 레이아웃 (ThemeProvider, Header, Footer)
  page.tsx            # 랜딩 예제 페이지
  globals.css         # Tailwind 및 shadcn 테마 변수
components/
  ui/                 # shadcn/ui 컴포넌트 (CLI로 추가)
  layout/             # site-header, site-footer, mobile-nav
  theme-provider.tsx  # next-themes 래퍼
  mode-toggle.tsx     # 다크 모드 토글
lib/
  utils.ts            # cn() 유틸
  site-config.ts      # 사이트 이름, 내비게이션 등 설정
components.json       # shadcn/ui 설정
postcss.config.mjs    # Tailwind CSS v4 PostCSS 플러그인
```

## 컴포넌트 추가

```bash
npx shadcn@latest add dialog input
```

```tsx
import { Button } from "@/components/ui/button"
```

이 스타일은 Base UI 기반이라 다른 요소로 렌더링할 때 `asChild` 대신 `render` prop을 사용합니다.

```tsx
<DropdownMenuTrigger render={<Button variant="outline" />}>열기</DropdownMenuTrigger>
```

링크를 버튼처럼 보이게 하려면 `buttonVariants`를 사용합니다.

```tsx
<Link href="/" className={buttonVariants({ variant: "outline" })}>홈</Link>
```

## 테마 변경

`app/globals.css`의 `:root` / `.dark` CSS 변수를 수정하거나, [shadcn/ui Themes](https://ui.shadcn.com/themes)에서 생성한 값을 붙여넣으세요.

## 참고 문서

- [Next.js Installation](https://nextjs.org/docs/app/getting-started/installation)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [shadcn/ui Next.js](https://ui.shadcn.com/docs/installation/next)
- [lucide-react](https://lucide.dev/guide/packages/lucide-react)
