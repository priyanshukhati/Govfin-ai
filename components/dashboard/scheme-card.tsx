import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Star } from "lucide-react"
import Link from "next/link"

interface SchemeCardProps {
  id: number
  name: string
  category: string
  benefit: string
  highlighted?: boolean
  compact?: boolean
  isBestMatch?: boolean
  showWhyRecommended?: boolean
  reasons?: string[]
}

export function SchemeCard({
  id,
  name,
  category,
  benefit,
  highlighted = false,
  compact = false,
  isBestMatch = false,
  showWhyRecommended = false,
  reasons = [],
}: SchemeCardProps) {

  const saveRecentlyViewed = () => {

    try {
  
      const existing =
        localStorage.getItem(
          "recently_viewed_schemes"
        )
  
      let viewedSchemes =
        existing
          ? JSON.parse(existing)
          : []
  
      // REMOVE DUPLICATES
      viewedSchemes =
        viewedSchemes.filter(
          (schemeId: number) =>
            schemeId !== id
        )
  
      // ADD NEWEST TO FRONT
      viewedSchemes.unshift(id)
  
      // LIMIT TO 10
      viewedSchemes =
        viewedSchemes.slice(0, 10)
  
      localStorage.setItem(
        "recently_viewed_schemes",
        JSON.stringify(viewedSchemes)
      )
      window.dispatchEvent(
        new Event("govfin-data-updated")
      )
  
    } catch (error) {
  
      console.error(
        "Failed to save recently viewed scheme",
        error
      )
    }
  }

  // Compact (unchanged)
  if (compact) {
    return (
      <Card className="rounded-2xl bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-semibold">{name}</CardTitle>
            <Badge className="bg-gray-100 text-xs text-gray-600">
              {category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 line-clamp-2">{benefit}</p>
          <Link href={`/scheme/${id}`}>
          <Button variant="ghost" size="sm" className="px-0 text-xs mt-2">
            View Details <ArrowRight className="size-3" />
          </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  // MAIN CARD (RESTORED STYLE)
  return (
    <Card
      className={`rounded-2xl p-4 shadow-sm transition hover:shadow-md 
      ${isBestMatch || highlighted ? "bg-blue-50 border-blue-200" : "bg-white"}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-2">
            {(isBestMatch || highlighted) && (
              <Star className="size-4 text-yellow-400 fill-yellow-400" />
            )}
            <CardTitle className="text-base font-semibold">
              {name}
            </CardTitle>
          </div>

          {/* BADGE */}
          <Badge className="bg-green-100 text-green-700 text-xs">
            {category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-gray-600">
          {benefit}
        </p>

        {showWhyRecommended && reasons && reasons.length > 0 && (
          <div className="text-xs text-blue-600 space-y-1">
            <p className="font-medium">Why this scheme?</p>
            <ul className="list-disc ml-4">
              {reasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        <Link href={`/scheme/${id}`}>
        <Button
          variant="ghost"
          size="sm"
          className="px-0 text-sm text-gray-800 hover:text-blue-600"
          onClick={saveRecentlyViewed}
        >
          View Details <ArrowRight className="size-4" />
        </Button>
        </Link>
      </CardContent>
    </Card>
  )
}