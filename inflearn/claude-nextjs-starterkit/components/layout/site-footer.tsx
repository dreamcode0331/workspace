import { siteConfig } from "@/lib/site-config"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 text-sm text-muted-foreground">
        <p>{siteConfig.name}</p>
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground"
        >
          GitHub
        </a>
      </div>
    </footer>
  )
}
