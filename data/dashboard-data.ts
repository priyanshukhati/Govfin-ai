import {
  AIInsight,
  RecommendationSummary,
  DashboardAlert,
} from "@/types/dashboard"

export const aiInsights: AIInsight[] = [
  {
    id: 1,
    title: "Savings Alert",
    message:
      "Your savings rate is below the recommended 30% level.",
    type: "warning",
  },
  {
    id: 2,
    title: "Scheme Eligibility",
    message:
      "You may qualify for PM Kisan Samman Nidhi scheme.",
    type: "info",
  },
  {
    id: 3,
    title: "Expense Tracking",
    message:
      "Great job! Your expense tracking is consistent this month.",
    type: "success",
  },
]

export const dashboardAlerts: DashboardAlert[] = [
  {
    id: 1,
    title: "Profile completion improves recommendations",
  },
  {
    id: 2,
    title: "2 new schemes added this month",
  },
  {
    id: 3,
    title: "Financial review available",
  },
]

export const recommendationSummary: RecommendationSummary = {
  eligibleSchemes: 12,
  highMatchSchemes: 4,
  recentlyViewed: 2,
}