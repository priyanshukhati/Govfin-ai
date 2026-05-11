"use client"

import { Navbar } from "@/components/dashboard/navbar"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { SchemeCard } from "@/components/dashboard/scheme-card"
import { AiInsights } from "@/components/dashboard/ai-insights"
import {
  ShieldCheck,
  UserCheck,
  Bell,
} from "lucide-react"

import { RecommendationSummary } from "@/components/dashboard/recommendation-summary"

import { useDashboardData } from "@/hooks/use-dashboard-data"

import { useDashboardRecommendation }
from "@/hooks/use-dashboard-recommendation"

import { useAIInsights }
from "@/hooks/use-ai-insights"

import { useRecommendationSummary }
from "@/hooks/use-recommendation-summary"

export default function DashboardPage() {
  const dashboardData = useDashboardData()

  const recommendedScheme =
    useDashboardRecommendation()

  const aiInsights =
    useAIInsights()

  const recommendationSummaryData =
    useRecommendationSummary()  

  const kpiData = [
  {
    title: "Financial Health Score",
    value:
      `${dashboardData.financialHealthScore}%`,
  
    subtitle:
      dashboardData.financialHealthStatus,
  
    icon: <ShieldCheck className="size-5" />,
  
    trend: "up" as const,
  },
  {
    title: "Profile Completion",
  
    value:
      `${dashboardData.profileCompletion}%`,
  
    subtitle: "Profile completed",
  
    icon: <UserCheck className="size-5" />,
  
    trend: "neutral" as const,
  },
  {
    title: "Active Alerts",
  
    value:
      dashboardData.alertsCount.toString(),
  
    subtitle: "Smart notifications",
  
    icon: <Bell className="size-5" />,
  
    trend: "neutral" as const,
  },
]
  return (
    <>
      <Navbar title="Dashboard" />
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
          {/* KPI Cards */}
          <section>
            <h2 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Key Metrics
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {kpiData.map((kpi) => (
                <KpiCard key={kpi.title} {...kpi} />
              ))}
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Left Column - Recommended Scheme */}
            <div className="lg:col-span-2 space-y-6">
              <section>
                <h2 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Recommended Scheme
                </h2>
                {recommendedScheme ? (

                  <SchemeCard
                    id={recommendedScheme.id}
                
                    name={
                      recommendedScheme.name ||
                      "Recommended Scheme"
                    }
                
                    category={
                      recommendedScheme.category_type ||
                      "General"
                    }
                
                    benefit={
                      recommendedScheme.description?.replace(
                        "â‚¹",
                        "₹"
                      ) || "No description available"
                    }
                
                    highlighted
                  />
                
                ) : (

                  <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                    No recommendation available yet.
                  </div>
                
                )}
              </section>

              {/* AI Insights */}
              <section>
                <AiInsights insights={aiInsights} />
              </section>
            </div>

            {/* Right Column - Financial Snapshot */}
            <div>
              <h2 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Summary
              </h2>
            
              <RecommendationSummary
                data={{
                  eligibleSchemes:
                    recommendationSummaryData.eligibleSchemes,
              
                  highMatchSchemes:
                    recommendationSummaryData.highMatch,
              
                  recentlyViewed:
                    recommendationSummaryData.recentlyViewed,
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

