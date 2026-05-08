import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Info, Sparkles } from "lucide-react"

type InsightType = "info" | "warning" | "success"

interface Insight {
  message: string
  type: InsightType
}

interface AiInsightsProps {
  insights: Insight[]
  className?: string
}

const insightStyles: Record<
  InsightType,
  { bg: string; border: string; icon: React.ReactNode; iconColor: string }
> = {
  info: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    icon: <Info className="size-4" />,
    iconColor: "text-blue-600",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-100",
    icon: <AlertCircle className="size-4" />,
    iconColor: "text-amber-600",
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-100",
    icon: <CheckCircle2 className="size-4" />,
    iconColor: "text-green-600",
  },
}

export function AiInsights({ insights, className }: AiInsightsProps) {
  return (
    <Card className={cn("rounded-2xl", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Sparkles className="size-5 text-blue-600" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => {
          const style = insightStyles[insight.type]
          return (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-3",
                style.bg,
                style.border
              )}
            >
              <span className={cn("mt-0.5", style.iconColor)}>{style.icon}</span>
              <p className="text-sm text-foreground leading-relaxed">
                {insight.message}
              </p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
