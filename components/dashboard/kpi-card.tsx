// import { Card, CardContent } from "@/components/ui/card"
// import { cn } from "@/lib/utils"

// interface KpiCardProps {
//   title: string
//   value: string
//   subtitle?: string
//   icon?: React.ReactNode
//   trend?: "up" | "down" | "neutral"
//   className?: string
// }

// export function KpiCard({
//   title,
//   value,
//   subtitle,
//   icon,
//   trend,
//   className,
// }: KpiCardProps) {
//   return (
//     <Card className={cn("rounded-2xl", className)}>
//       <CardContent className="pt-6">
//         <div className="flex items-start justify-between">
//           <div className="space-y-1">
//             <p className="text-sm font-medium text-muted-foreground">{title}</p>
//             <p
//               className={cn(
//                 "text-2xl font-bold tracking-tight",
//                 trend === "up" && "text-green-600",
//                 trend === "down" && "text-red-600"
//               )}
//             >
//               {value}
//             </p>
//             {subtitle && (
//               <p className="text-xs text-muted-foreground">{subtitle}</p>
//             )}
//           </div>
//           {icon && (
//             <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
//               {icon}
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string
  subtitle?: string
  icon?: React.ReactNode
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: KpiCardProps) {

  return (
    <Card
      className={cn(
        "rounded-2xl",
        className
      )}
    >
      <CardContent className="p-4 sm:p-6">

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0 flex-1 space-y-1">

            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              {title}
            </p>

            <p
              className={cn(
                "text-2xl sm:text-3xl font-bold tracking-tight break-words",

                trend === "up" &&
                  "text-green-600",

                trend === "down" &&
                  "text-red-600"
              )}
            >
              {value}
            </p>

            {subtitle && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {icon && (
            <div className="shrink-0 rounded-xl bg-blue-50 p-2 sm:p-2.5 text-blue-600">
              {icon}
            </div>
          )}

        </div>

      </CardContent>
    </Card>
  )
}
