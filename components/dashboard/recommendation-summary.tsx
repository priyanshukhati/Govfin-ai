import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { RecommendationSummaryData } from "@/types/dashboard"

interface RecommendationSummaryProps {
  data: RecommendationSummaryData
}

export function RecommendationSummary({
  data,
}: RecommendationSummaryProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Recommendation Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 p-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Eligible Schemes
            </p>

            <p className="text-lg font-semibold">
              {data.eligibleSchemes}
            </p>
          </div>

          <Sparkles className="size-5 text-blue-600" />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 p-4">
          <div>
            <p className="text-sm text-muted-foreground">
              High Match
            </p>

            <p className="text-lg font-semibold text-green-600">
              {data.highMatchSchemes}
            </p>
          </div>

          <Sparkles className="size-5 text-green-600" />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 p-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Recently Viewed
            </p>

            <p className="text-lg font-semibold">
              {data.recentlyViewed}
            </p>
          </div>

          <Sparkles className="size-5 text-orange-500" />
        </div>

      </CardContent>
    </Card>
  )
}