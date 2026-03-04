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

      <main className="container mx-auto flex-1 px-4 py-6 space-y-4 max-w-6xl sm:px-6 sm:py-10 sm:space-y-6">
        <TotalSupplyCard />

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
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
