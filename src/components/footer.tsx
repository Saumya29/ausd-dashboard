import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-4">
      <div className="container mx-auto flex flex-col items-center gap-3 px-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          Built by{" "}
          <a
            href="https://github.com/saumyatiwari"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Saumya Tiwari
          </a>
        </p>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground/50">Data refreshes automatically</span>
          <a
            href="https://agora.finance"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium"
          >
            agora.finance
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
