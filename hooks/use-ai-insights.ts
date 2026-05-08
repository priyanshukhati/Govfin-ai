"use client"

import { useEffect, useState } from "react"

import { getGovfinState }
from "@/utils/storage"

import { calculateFinancialHealth }
from "@/utils/finance-health"

type InsightType =
  "info" |
  "warning" |
  "success"

interface AIInsight {
  id: number
  message: string
  type: InsightType
  priority: number
}

export function useAIInsights() {

  const [insights, setInsights] =
    useState<AIInsight[]>([])

  useEffect(() => {

    const generateInsights = () => {

      const generatedInsights: AIInsight[] = []

      try {

        // ---------------------------------
        // LOAD DATA
        // ---------------------------------

        const savedProfile =
          localStorage.getItem("govfin_profile")

        const savedExpense =
          localStorage.getItem("finance_expense")

        const govfinState =
          getGovfinState()

        let profile: any = {}

        try {
          profile = savedProfile
            ? JSON.parse(savedProfile)
            : {}
        } catch {
          profile = {}
        }

        // ---------------------------------
        // FINANCIAL HEALTH
        // ---------------------------------

        const income =
          Number(profile.monthlyIncome || 0)

        const expenses =
          Number(savedExpense || 0)

        const financeHealth =
          calculateFinancialHealth(
            income,
            expenses
          )

        // ---------------------------------
        // PROFILE COMPLETION
        // ---------------------------------

        const profileFields = [
          profile.name,
          profile.email,
          profile.phone,
          profile.gender,
          profile.state,
          profile.category,
          profile.occupation,
          profile.monthlyIncome,
        ]

        const completedFields =
          profileFields.filter(Boolean).length

        const profileCompletion =
          Math.round(
            (completedFields / profileFields.length) * 100
          )

        // ---------------------------------
        // RULE 1
        // LOW SAVINGS WARNING
        // ---------------------------------

        if (
          financeHealth.savingsRate < 20
        ) {

          generatedInsights.push({
            id: 1,

            message:
              "Your savings rate is below recommended levels. Reducing extra expenses may improve financial stability.",

            type: "warning",

            priority: 1,
          })
        }

        // ---------------------------------
        // RULE 2
        // PROFILE COMPLETION
        // ---------------------------------

        if (profileCompletion < 80) {

          generatedInsights.push({
            id: 2,

            message:
              "Complete your profile details to improve scheme recommendation accuracy.",

            type: "info",

            priority: 2,
          })
        }

        // ---------------------------------
        // RULE 3
        // RECOMMENDATION AVAILABLE
        // ---------------------------------

        if (
          govfinState?.recommendation?.bestScheme
        ) {

          generatedInsights.push({
            id: 3,

            message:
              `You appear highly eligible for ${govfinState.recommendation.bestScheme.name}.`,

            type: "success",

            priority: 3,
          })
        }

        // ---------------------------------
        // RULE 4
        // GOOD FINANCIAL HEALTH
        // ---------------------------------

        if (
          financeHealth.score >= 70
        ) {

          generatedInsights.push({
            id: 4,

            message:
              "Your financial health looks stable this month. Keep maintaining healthy savings habits.",

            type: "success",

            priority: 4,
          })
        }

        // ---------------------------------
        // SORT BY PRIORITY
        // ---------------------------------

        generatedInsights.sort(
          (a, b) =>
            a.priority - b.priority
        )

        // ---------------------------------
        // SHOW MAX 3 INSIGHTS
        // ---------------------------------

        setInsights(
          generatedInsights.slice(0, 3)
        )

      } catch (error) {

        console.error(
          "AI insight generation failed",
          error
        )

        setInsights([])
      }
    }

    // INITIAL LOAD
    generateInsights()

    // LIVE UPDATE
    window.addEventListener(
      "focus",
      generateInsights
    )

    return () => {
      window.removeEventListener(
        "focus",
        generateInsights
      )
    }

  }, [])

  return insights
}