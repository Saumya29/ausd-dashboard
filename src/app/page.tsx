import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TotalSupplyCard } from "@/components/dashboard/total-supply-card";
import { ChainBreakdown } from "@/components/dashboard/chain-breakdown";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ChainHealth } from "@/components/dashboard/chain-health";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container mx-auto flex-1 space-y-6 px-4 py-8">
        {/* Hero — total supply */}
        <TotalSupplyCard />

        {/* Middle row — breakdown + health */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChainBreakdown />
          </div>
          <div>
            <ChainHealth />
          </div>
        </div>

        {/* Bottom — recent activity */}
        <RecentActivity />
      </main>

      <Footer />
    </div>
  );
}
