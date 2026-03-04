import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TotalSupplyCard } from "@/components/dashboard/total-supply-card";
import { ChainBreakdown } from "@/components/dashboard/chain-breakdown";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ChainHealth } from "@/components/dashboard/chain-health";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="container mx-auto flex-1 px-6 py-10 space-y-6 max-w-6xl">
        <TotalSupplyCard />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChainBreakdown />
          </div>
          <div>
            <ChainHealth />
          </div>
        </div>

        <RecentActivity />
      </main>

      <Footer />
    </div>
  );
}
