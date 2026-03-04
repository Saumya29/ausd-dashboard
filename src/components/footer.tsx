import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-6">
      <div className="container mx-auto flex flex-col items-center gap-2 px-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          Built by{" "}
          <a
            href="https://github.com/saumyatiwari"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            Saumya Tiwari
          </a>
        </p>
        <a
          href="https://agora.finance"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-medium text-foreground hover:underline"
        >
          agora.finance
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </footer>
  );
}
