export interface AIInsight {
  id: number
  title: string
  message: string
  type: "warning" | "info" | "success"
}

export interface RecommendationSummaryData {
  eligibleSchemes: number
  highMatchSchemes: number
  recentlyViewed: number
}

export interface DashboardAlert {
  id: number
  title: string
}