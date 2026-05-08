interface FinancialHealthResult {
  score: number
  status: string
  message: string
  savings: number
  savingsRate: number
}

export function calculateFinancialHealth(
  income: number,
  expenses: number
): FinancialHealthResult {

  const savings = income - expenses

  const savingsRate =
    income > 0
      ? Math.max(
          Math.round((savings / income) * 100),
          0
        )
      : 0

  // CRITICAL CONDITION
  if (savings < 0) {
    return {
      score: 20,
      status: "Critical",
      message: "You are spending more than your income.",
      savings,
      savingsRate,
    }
  }

  // EXCELLENT
  if (savingsRate >= 30) {
    return {
      score: 85,
      status: "Excellent",
      message: "Excellent savings habit. Keep it up.",
      savings,
      savingsRate,
    }
  }

  // GOOD
  if (savingsRate >= 20) {
    return {
      score: 72,
      status: "Good",
      message: "Good financial balance this month.",
      savings,
      savingsRate,
    }
  }

  // AVERAGE
  if (savingsRate >= 10) {
    return {
      score: 58,
      status: "Average",
      message: "Savings are average. Try to improve.",
      savings,
      savingsRate,
    }
  }

  // LOW SAVINGS
  return {
    score: 40,
    status: "Needs Attention",
    message: "Your savings are low. Reduce extra expenses.",
    savings,
    savingsRate,
  }
}