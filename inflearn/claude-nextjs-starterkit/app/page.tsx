import Link from "next/link";
import {
  ArrowRight,
  Atom,
  Code2,
  Component,
  Palette,
  Shapes,
  Terminal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";

const stack = [
  {
    icon: Atom,
    title: "Next.js",
    version: "16.4",
    description: "App Router, Turbopack, Cache Components 기본 활성화",
  },
  {
    icon: Code2,
    title: "TypeScript",
    version: "5",
    description: "strict 모드와 @/* 경로 별칭이 설정된 타입 안전 환경",
  },
  {
    icon: Palette,
    title: "Tailwind CSS",
    version: "4.3",
    description: "tailwind.config 없이 CSS(@theme)만으로 설정",
  },
  {
    icon: Component,
    title: "shadcn/ui",
    version: "CLI 4",
    description: "복사해서 쓰는 접근성 높은 컴포넌트, 다크 모드 포함",
  },
  {
    icon: Shapes,
    title: "lucide-react",
    version: "1.x",
    description: "일관된 스타일의 오픈소스 아이콘 세트",
  },
];

const steps = [
  { command: "npm install", description: "의존성 설치" },
  { command: "npm run dev", description: "개발 서버 실행 (localhost:3000)" },
  {
    command: "npx shadcn@latest add dialog",
    description: "필요한 컴포넌트 추가",
  },
];

export default function Home() {
  return (
    <>
      <section className="container mx-auto flex flex-col items-center gap-6 px-4 py-24 text-center">
        <Badge variant="secondary">웹 개발 스타터킷</Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          설정은 끝났습니다.
          <br />
          바로 만들기 시작하세요.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="#getting-started"
            className={buttonVariants({ size: "lg" })}
          >
            시작하기
            <ArrowRight />
          </Link>
          <a
            href="https://ui.shadcn.com/docs/components"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            컴포넌트 둘러보기
          </a>
        </div>
      </section>

      <section
        id="features"
        className="container mx-auto scroll-mt-16 px-4 py-16"
      >
        <h2 className="mb-8 text-center text-2xl font-semibold">기술 스택</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map(({ icon: Icon, title, version, description }) => (
            <Card key={title}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon className="size-6 text-primary" />
                  <Badge variant="outline">{version}</Badge>
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="getting-started"
        className="container mx-auto scroll-mt-16 px-4 py-16"
      >
        <h2 className="mb-8 text-center text-2xl font-semibold">시작하기</h2>
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <div key={step.command} className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <code className="flex items-center gap-2 font-mono text-sm">
                    <Terminal className="size-4 text-muted-foreground" />
                    {step.command}
                  </code>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
