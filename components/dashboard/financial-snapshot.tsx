import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDownLeft, ArrowUpRight, PiggyBank } from "lucide-react"

interface SnapshotItem {
  label: string
  value: string
  type: "income" | "expense" | "savings"
}

interface FinancialSnapshotProps {
  items: SnapshotItem[]
  className?: string
}

const iconMap = {
  income: <ArrowUpRight className="size-4" />,
  expense: <ArrowDownLeft className="size-4" />,
  savings: <PiggyBank className="size-4" />,
}

const colorMap = {
  income: "text-green-600 bg-green-50",
  expense: "text-red-600 bg-red-50",
  savings: "text-blue-600 bg-blue-50",
}

export function FinancialSnapshot({ items, className }: FinancialSnapshotProps) {
  return (
    <Card className={cn("rounded-2xl", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Financial Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl bg-muted/50 p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg",
                    colorMap[item.type]
                  )}
                >
                  {iconMap[item.type]}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
              </div>
              <span
                className={cn(
                  "text-sm font-semibold",
                  item.type === "income" && "text-green-600",
                  item.type === "expense" && "text-red-600",
                  item.type === "savings" && "text-blue-600"
                )}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
