"use client"

import { useEffect, useState } from "react"

import { getGovfinState }
from "@/utils/storage"

interface DashboardScheme {
  id: number
  name: string
  category_type?: string
  description?: string
}

export function useDashboardRecommendation() {

  const [scheme, setScheme] =
    useState<DashboardScheme | null>(null)

  useEffect(() => {

    const loadRecommendation = () => {

      try {

        const saved = getGovfinState()

        if (!saved?.recommendation) {
          setScheme(null)
          return
        }

        const bestScheme =
          saved.recommendation.bestScheme

        if (bestScheme) {
          setScheme(bestScheme)
        }

      } catch (error) {

        console.error(
          "Dashboard recommendation load failed",
          error
        )

        setScheme(null)
      }
    }

    loadRecommendation()

    window.addEventListener(
      "focus",
      loadRecommendation
    )

    return () => {
      window.removeEventListener(
        "focus",
        loadRecommendation
      )
    }

  }, [])

  return scheme
}