"use client"

import { useEffect, useState } from "react"

import { calculateFinancialHealth }
from "@/utils/finance-health"

interface DashboardData {
  financialHealthScore: number
  financialHealthStatus: string
  profileCompletion: number
  alertsCount: number
}

const defaultDashboardData: DashboardData = {
  financialHealthScore: 40,
  financialHealthStatus: "Needs Attention",
  profileCompletion: 0,
  alertsCount: 0,
}

export function useDashboardData() {

  const [dashboardData, setDashboardData] =
    useState<DashboardData>(defaultDashboardData)

  useEffect(() => {

    const loadDashboardData = () => {

      // ----------------------------
      // LOAD PROFILE
      // ----------------------------

      const savedProfile =
        localStorage.getItem("govfin_profile")

      const savedExpense =
        localStorage.getItem("finance_expense")

      let profile: any = {}

      try {
        profile = savedProfile
          ? JSON.parse(savedProfile)
          : {}
      } catch {
        profile = {}
      }

      // ----------------------------
      // PROFILE COMPLETION
      // ----------------------------

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

      // ----------------------------
      // FINANCIAL HEALTH
      // ----------------------------

      const income =
        Number(profile.monthlyIncome || 0)

      const expenses =
        Number(savedExpense || 0)

      const financeHealth =
        calculateFinancialHealth(income, expenses)

      // ----------------------------
      // ALERTS
      // ----------------------------

      let alertsCount = 0

      if (profileCompletion < 80) {
        alertsCount++
      }

      if (financeHealth.savingsRate < 20) {
        alertsCount++
      }

      setDashboardData({
        financialHealthScore:
          financeHealth.score,

        financialHealthStatus:
          financeHealth.status,

        profileCompletion,

        alertsCount,
      })
    }

    // INITIAL LOAD
    loadDashboardData()

    // LIVE UPDATE
    window.addEventListener(
      "focus",
      loadDashboardData
    )

    window.addEventListener(
      "storage",
      loadDashboardData
    )

    return () => {
      window.removeEventListener(
        "focus",
        loadDashboardData
      )

      window.removeEventListener(
        "storage",
        loadDashboardData
      )
    }

  }, [])

  return dashboardData
}