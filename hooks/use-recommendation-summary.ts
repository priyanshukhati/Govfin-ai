"use client"

import { useEffect, useState } from "react"

import { getGovfinState }
from "@/utils/storage"

interface RecommendationSummaryData {

  eligibleSchemes: number

  highMatch: number

  recentlyViewed: number
}

export function useRecommendationSummary() {

  const [summary, setSummary] =
    useState<RecommendationSummaryData>({
      eligibleSchemes: 0,
      highMatch: 0,
      recentlyViewed: 0,
    })

  useEffect(() => {

    const loadSummary = () => {

      try {

        // -----------------------------
        // LOAD RECOMMENDATION DATA
        // -----------------------------

        const govfinState =
          getGovfinState()

        const recommended =
          govfinState?.recommendation
            ?.recommended || []

        // -----------------------------
        // ELIGIBLE SCHEMES
        // -----------------------------

        const eligibleSchemes =
          recommended.length

        // -----------------------------
        // HIGH MATCH
        // -----------------------------

        // SIMPLE MVP RULE:
        // Top 3 schemes considered
        // high match

        const highMatch =
          Math.min(
            recommended.length,
            3
          )

        // -----------------------------
        // RECENTLY VIEWED
        // -----------------------------

        const recentlyViewedData =
          localStorage.getItem(
            "recently_viewed_schemes"
          )

        let recentlyViewed = 0

        try {

          const parsed =
            recentlyViewedData
              ? JSON.parse(recentlyViewedData)
              : []

          recentlyViewed =
            Array.isArray(parsed)
              ? parsed.length
              : 0

        } catch {
          recentlyViewed = 0
        }

        // -----------------------------
        // UPDATE SUMMARY
        // -----------------------------

        setSummary({
          eligibleSchemes,
          highMatch,
          recentlyViewed,
        })

      } catch (error) {

        console.error(
          "Recommendation summary failed",
          error
        )
      }
    }

    // INITIAL LOAD
    loadSummary()

    // LIVE SYNC
    // window.addEventListener(
    //   "focus",
    //   loadSummary
    // )
    window.addEventListener(
      "govfin-data-updated",
      loadSummary
    )

    // return () => {
    //   window.removeEventListener(
    //     "focus",
    //     loadSummary
    //   )
    // }

    window.removeEventListener(
      "govfin-data-updated",
      loadSummary
    )

  }, [])

  return summary
}