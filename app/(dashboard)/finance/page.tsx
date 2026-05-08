"use client"

import { useEffect, useMemo, useState } from "react"
import { Navbar } from "@/components/dashboard/navbar"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { FinancialSnapshot } from "@/components/dashboard/financial-snapshot"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"

import { calculateFinancialHealth }
from "@/utils/finance-health"

const recentTransactions = [
  { name: "Salary Credit", amount: "+₹45,000", type: "income", date: "Mar 1" },
  { name: "Rent Payment", amount: "-₹12,000", type: "expense", date: "Mar 2" },
  { name: "Grocery Shopping", amount: "-₹3,500", type: "expense", date: "Mar 5" },
  { name: "Electricity Bill", amount: "-₹1,800", type: "expense", date: "Mar 7" },
  { name: "Freelance Project", amount: "+₹8,000", type: "income", date: "Mar 10" },
]

const expenseBreakdown = [
  { category: "Housing", amount: "₹12,000", percentage: 37 },
  { category: "Food & Groceries", amount: "₹8,500", percentage: 26 },
  { category: "Transportation", amount: "₹4,000", percentage: 12 },
  { category: "Utilities", amount: "₹3,500", percentage: 11 },
  { category: "Entertainment", amount: "₹2,500", percentage: 8 },
  { category: "Others", amount: "₹2,000", percentage: 6 },
]

export default function FinancePage() {
  const DEFAULT_INCOME = 45000

  const [income, setIncome] = useState(DEFAULT_INCOME)
  const [expenses, setExpenses] = useState(0)
  
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  
  const [tempIncome, setTempIncome] = useState("")
  const [tempExpense, setTempExpense] = useState("")

  useEffect(() => {
    const loadFinanceData = () => {
      const savedExpense = localStorage.getItem("finance_expense")
      const savedProfile = localStorage.getItem("govfin_profile")
  
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile)
  
          const profileIncome = Number(profile.monthlyIncome)

          if (
            profile.monthlyIncome !== "" &&
            !isNaN(profileIncome) &&
            profileIncome >= 0
          ) {
            setIncome(profileIncome)
          }
        } catch (error) {
          console.error("Invalid profile data", error)
        }
      }
  
      if (savedExpense) {
        const parsedExpense = Number(savedExpense)
  
        if (!isNaN(parsedExpense)) {
          setExpenses(parsedExpense)
        }
      } else {
        setExpenses(0)
      }
    }
  
    loadFinanceData()
  
    window.addEventListener("focus", loadFinanceData)

    window.addEventListener("storage", loadFinanceData)
  
    return () => {
      window.removeEventListener("focus", loadFinanceData)
      window.removeEventListener("storage", loadFinanceData)
    }
  }, [])

  const savings = income - expenses

  const savingsPercent =
  income > 0 ? Math.max(Math.round((savings / income) * 100), 0) : 0

  const financeHealth =
  calculateFinancialHealth(income, expenses)

  // const financeHealth = (() => {
  //   if (savings < 0) {
  //     return {
  //       score: 20,
  //       status: "Critical",
  //       message: "You are spending more than your income.",
  //     }
  //   }
  
  //   if (savingsPercent >= 30) {
  //     return {
  //       score: 85,
  //       status: "Excellent",
  //       message: "Excellent savings habit. Keep it up.",
  //     }
  //   }
  
  //   if (savingsPercent >= 20) {
  //     return {
  //       score: 72,
  //       status: "Good",
  //       message: "Good financial balance this month.",
  //     }
  //   }
  
  //   if (savingsPercent >= 10) {
  //     return {
  //       score: 58,
  //       status: "Average",
  //       message: "Savings are average. Try to improve.",
  //     }
  //   }
  
  //   return {
  //     score: 40,
  //     status: "Needs Attention",
  //     message: "Your savings are low. Reduce extra expenses.",
  //   }
  // })()

  const kpiData = useMemo(() => [
  {
  title: "Total Balance",
  value: `₹${Math.max(100000 + savings, 0).toLocaleString("en-IN")}`,
  subtitle: "Estimated balance",
  icon: <IndianRupee className="size-5" />,
  },
  {
  title: "Income This Month",
  value: `₹${income.toLocaleString("en-IN")}`,
  subtitle: "Updated by user",
  icon: <TrendingUp className="size-5" />,
  trend: savings >= 0 ? "up" as const : "down" as const,
  },
  {
  title: "Expenses This Month",
  value: `₹${expenses.toLocaleString("en-IN")}`,
  subtitle: "Updated by user",
  icon: <TrendingDown className="size-5" />,
  trend: "down" as const,
  },
  {
  title: "Savings Goal",
  value: `${savingsPercent}%`,
  subtitle:
  savings >= 0
  ? `₹${savings.toLocaleString("en-IN")} saved`
  : `₹${Math.abs(savings).toLocaleString("en-IN")} deficit`,
  icon: <PiggyBank className="size-5" />,
  trend: savings >= 0 ? "up" as const : "down" as const,
  },
  ], [income, expenses, savings, savingsPercent])

  const financialSnapshot = useMemo(() => [
    {
      label: "Total Income",
      value: `₹${income.toLocaleString("en-IN")}`,
      type: "income" as const,
    },
    {
      label: "Total Expenses",
      value: `₹${expenses.toLocaleString("en-IN")}`,
      type: "expense" as const,
    },
    {
      label: savings >= 0 ? "Net Savings" : "Net Deficit",
      value: `₹${Math.abs(savings).toLocaleString("en-IN")}`,
      type: "savings" as const,
    },
  ], [income, expenses, savings])  

  const saveIncome = () => {
    if (tempIncome.trim() === "") return
  
    const value = Number(tempIncome)
  
    if (!isNaN(value) && value >= 0) {
      setIncome(value)
  
      const savedProfile = localStorage.getItem("govfin_profile")
  
      try {
        let profile = savedProfile
          ? JSON.parse(savedProfile)
          : {}
  
        profile.monthlyIncome = value.toString()
  
        localStorage.setItem(
          "govfin_profile",
          JSON.stringify(profile)
        )
      } catch (error) {
          console.error("Profile update failed", error)
        
          localStorage.setItem(
            "govfin_profile",
            JSON.stringify({
              monthlyIncome: value.toString(),
            })
          )
        }
  
      setShowIncomeModal(false)
      setTempIncome("")
    }
  }
  
  const saveExpense = () => {
    if (tempExpense.trim() === "") return
  
    const value = Number(tempExpense)
  
    if (!isNaN(value) && value >= 0) {
      setExpenses(value)
      localStorage.setItem("finance_expense", value.toString())
      setShowExpenseModal(false)
      setTempExpense("")
    }
  }  

  return (
    <>
      <Navbar title="Finance" />
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <Button className="gap-2" 
            onClick={() => {
              setTempIncome(income.toString())
              setShowIncomeModal(true)
            }}>
              <Plus className="size-4" />
              Update Income
            </Button>
            <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              setTempExpense(expenses.toString())
              setShowExpenseModal(true)
            }}
            >
              <Plus className="size-4" />
              Update Expense
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                const savedProfile = localStorage.getItem("govfin_profile")
              
                if (savedProfile) {
                  try {
                    const profile = JSON.parse(savedProfile)
              
                    const defaultIncome =
                      Number(profile.monthlyIncome) || DEFAULT_INCOME
              
                    setIncome(defaultIncome)
                    setExpenses(0)
              
                    localStorage.setItem("finance_expense", "0")
                  } catch (error) {
                      console.error("Reset failed", error)
                    
                      setIncome(DEFAULT_INCOME)
                      setExpenses(0)
                    
                      localStorage.setItem("finance_expense", "0")
                    }
                } else {
                  setIncome(DEFAULT_INCOME)
                  setExpenses(0)
              
                  localStorage.setItem("finance_expense", "0")
                }
              }}
            >
              Reset Values
            </Button>
          </div>

          {/* KPI Cards */}
          <section>
            <h2 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Financial Overview
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kpiData.map((kpi) => (
                <KpiCard key={kpi.title} {...kpi} />
              ))}
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Transactions */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      Recent Transactions
                    </CardTitle>
                    <Button variant="ghost" size="sm" disabled>
                    View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.name}
                        className="flex items-center justify-between rounded-xl bg-muted/50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-8 items-center justify-center rounded-lg ${
                              transaction.type === "income"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? (
                              <ArrowUpRight className="size-4" />
                            ) : (
                              <ArrowDownLeft className="size-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {transaction.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {transaction.date}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Expense Breakdown */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    Expense Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expenseBreakdown.map((item) => (
                      <div key={item.category} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">
                            {item.category}
                          </span>
                          <span className="text-muted-foreground">
                            {item.amount}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Monthly Summary
              </h2>
            
              <FinancialSnapshot items={financialSnapshot} />
            
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    Financial Health
                  </CardTitle>
                </CardHeader>
            
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold">
                    {financeHealth.score}/100
                  </div>
            
                  <div
                  className={`text-sm font-medium ${
                    financeHealth.status === "Critical"
                      ? "text-red-600"
                      : financeHealth.status === "Needs Attention"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                  >
                    {financeHealth.status}
                  </div>
            
                  <p className="text-sm text-muted-foreground">
                    {financeHealth.message}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      {showIncomeModal && (
      <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={() => {
        setShowIncomeModal(false)
        setTempIncome("")
      }}
      >
      <Card
      className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl"
      onClick={(e) => e.stopPropagation()}
      >
      <CardHeader>
      <CardTitle>Update Monthly Income</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
      <Input
      type="number"
      min="0"
      placeholder="Enter income"
      value={tempIncome}
      onChange={(e) => setTempIncome(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && saveIncome()}
      autoFocus
      />
      
      <div className="flex justify-end gap-2">
      <Button
      variant="outline"
      onClick={() => {
        setShowIncomeModal(false)
        setTempIncome("")
      }}
      >
      Cancel
      </Button>
      
      <Button onClick={saveIncome}>
      Save
      </Button>
      </div>
      </CardContent>
      </Card>
      </div>
      )}

      {showExpenseModal && (
      <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={() => {
        setShowExpenseModal(false)
        setTempExpense("")
      }}
      >
      <Card
      className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl"
      onClick={(e) => e.stopPropagation()}
      >
      <CardHeader>
      <CardTitle>Update Monthly Expense</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
      <Input
      type="number"
      min="0"
      placeholder="Enter expense"
      value={tempExpense}
      onChange={(e) => setTempExpense(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && saveExpense()}
      autoFocus
      />

      <div className="flex justify-end gap-2">
      <Button
      variant="outline"
      onClick={() => {
        setShowExpenseModal(false)
        setTempExpense("")
      }}
      >
      Cancel
      </Button>
      
      <Button onClick={saveExpense}>
      Save
      </Button>
      </div>
      </CardContent>
      </Card>
      </div>
      )}
    </>
  )
}
