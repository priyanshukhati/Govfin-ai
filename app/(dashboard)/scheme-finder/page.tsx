"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/dashboard/navbar"
import { SchemeCard } from "@/components/dashboard/scheme-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, User, ChevronUp, Sparkles, SearchX } from "lucide-react"
import { predictSchemes, searchSchemes, filterSchemes } from "@/services/api"
import { getGovfinState, setGovfinState, clearGovfinState } from "@/utils/storage"

type Scheme = {
  id: number
  name: string
  category_type: string
  description: string
  benefits?: string
  eligibility?: {
    max_income?: number
    occupation?: string[]
    category?: string[]
    state?: string[]
  }
}

const allSchemes = [
  {
    id: 1,
    name: "PM Svanidhi - Street Vendor Loan",
    category: "Financial Aid",
    benefit:
      "Get collateral-free working capital loan up to ₹50,000 at subsidized interest rates.",
    highlighted: false,
  },
  {
    id: 2,
    name: "PM Kisan Samman Nidhi",
    category: "Agriculture",
    benefit:
      "Income support of ₹6,000 per year in three equal installments for small and marginal farmers.",
    highlighted: false,
  },
  {
    id: 3,
    name: "Ayushman Bharat Yojana",
    category: "Healthcare",
    benefit:
      "Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care.",
    highlighted: false,
  },
  {
    id: 4,
    name: "MUDRA Loan Scheme",
    category: "Business",
    benefit:
      "Loans up to ₹10 lakh for non-corporate, non-farm small/micro enterprises.",
    highlighted: false,
  },
  {
    id: 5,
    name: "Sukanya Samriddhi Yojana",
    category: "Savings",
    benefit:
      "High-interest savings scheme for girl child with tax benefits under Section 80C.",
    highlighted: false,
  },
  {
    id: 6,
    name: "PM Awas Yojana",
    category: "Housing",
    benefit:
      "Interest subsidy on home loans for economically weaker sections and low-income groups.",
    highlighted: false,
  },
]

const categories = [
  "All",
  "Financial Aid",
  "Agriculture",
  "Healthcare",
  "Business",
  "Savings",
  "Housing",
]

const states = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu and Kashmir","Ladakh","Puducherry","Chandigarh",
  "Andaman and Nicobar Islands","Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep"
]

// ---------------- OCCUPATION ----------------
const occupations = [
  "farmer",
  "self_employed",
  "salaried",
  "government_employee",
  "business",
  "student",
  "unemployed",
  "retired",
]

const categoryOptions = [
  "General",
  "SC",
  "ST",
  "OBC",
  "EWS",
]

export default function SchemeFinderPage() {
  const [showInputForm, setShowInputForm] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [hasSearchTriggered, setHasSearchTriggered] = useState(false)
  const [isSearchLoaded, setIsSearchLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [formData, setFormData] = useState({
  age: "",
  income: "",
  gender: "",
  occupation: "",
  state: "",
  category: "",
  disability: "",
})

const [searchQuery, setSearchQuery] = useState("")
const [searchResults, setSearchResults] = useState<Scheme[]>([])

const [selectedCategory, setSelectedCategory] = useState("All")

const [isCategoryLoaded, setIsCategoryLoaded] = useState(false)

const [bestScheme, setBestScheme] = useState<Scheme | null>(null)
const [recommended, setRecommended] = useState<Scheme[]>([])

const [profileBestScheme, setProfileBestScheme] = useState<Scheme | null>(null)
const [profileRecommended, setProfileRecommended] = useState<Scheme[]>([])

const [recommendationMode, setRecommendationMode] = useState("profile")

useEffect(() => {
  const isFirstLoad = sessionStorage.getItem("govfin_loaded")

  if (!isFirstLoad) {
    clearGovfinState()

    sessionStorage.setItem("govfin_loaded", "true")
  }

  const saved = getGovfinState()

  if (saved?.recommendation) {
    setRecommendationMode(saved.recommendation.mode || "manual")
  } else {
    setRecommendationMode("profile")
  }

}, [])

useEffect(() => {
  const saved = getGovfinState()

  if (saved?.recommendation) {
    const data = saved.recommendation

    setBestScheme(data.bestScheme || null)
    setRecommended(Array.isArray(data.recommended) ? data.recommended : [])
    setFormData(data.formData || {
      age: "",
      income: "",
      gender: "",
      occupation: "",
      state: "",
      category: "",
      disability: "",
    })

    setHasSearched(
      data.mode === "manual"
    )
    setRecommendationMode(data.mode || "manual")
  }
}, [])

useEffect(() => {
  const savedSearch = getGovfinState()

  if (savedSearch?.search) {
    setSearchQuery(savedSearch.search.query || "")
    setSearchResults(Array.isArray(savedSearch.search.results) ? savedSearch.search.results : [])
    setHasSearchTriggered(true)
  }
  setIsSearchLoaded(true)
}, [])

useEffect(() => {
  if (!isSearchLoaded || !isCategoryLoaded) return

  if (!(searchQuery || "").trim() && selectedCategory === "All") {
    setSearchResults([])
    setHasSearchTriggered(false)

    const prev = getGovfinState() || {}

    setGovfinState({
      ...prev,
      search: null
    })
  }
}, [searchQuery, selectedCategory, isSearchLoaded, isCategoryLoaded])

useEffect(() => {
  if (!isSearchLoaded) return

  const saved = getGovfinState()

  if (saved?.category) {
    setSelectedCategory(saved.category.selected || "All")
    setSearchResults(Array.isArray(saved.category.results) ? saved.category.results : [])
    setHasSearchTriggered(true)
  }

  setIsCategoryLoaded(true) // ✅ IMPORTANT
}, [isSearchLoaded])

useEffect(() => {
  try {
    const profile = JSON.parse(
      localStorage.getItem("govfin_profile") || "{}"
    )

    const complete = Boolean(
      profile.dateOfBirth &&
      profile.gender &&
      profile.monthlyIncome !== undefined &&
      profile.occupation &&
      profile.state &&
      profile.category &&
      profile.disability
    )

    setIsProfileComplete(complete)

  } catch {
    setIsProfileComplete(false)
  }
}, [])

useEffect(() => {
  if (recommendationMode === "manual") return
  const fetchProfileSchemes = async () => {
    try {
      const savedProfile = localStorage.getItem("govfin_profile")

      if (!savedProfile) return

      let profile: any = {}

      try {
        profile = JSON.parse(savedProfile)
      } catch {
        profile = {}
      }

      const calculatedAge = profile.dateOfBirth
        ? new Date().getFullYear() -
          new Date(profile.dateOfBirth).getFullYear()
        : 30

      const data = await predictSchemes({
        age: calculatedAge,
        income: Number(profile.monthlyIncome || 0),
        gender: profile.gender?.toLowerCase() || "male",
        occupation: profile.occupation || "self_employed",
        state: profile.state || "Maharashtra",
        category: profile.category || "General",
        disability: profile.disability?.toLowerCase() || "no",
      })

      const best = data?.best_scheme ?? null
      const rec = Array.isArray(data?.recommended) ? data.recommended : []
      
      setProfileBestScheme(best)
      setProfileRecommended(rec)

      setGovfinState({
        recommendation: {
          bestScheme: best,
          recommended: rec,
          mode: "profile"
        }
      })

    } catch (error) {
      console.error("Profile recommendation failed", error)
    }
  }

  fetchProfileSchemes()
}, [recommendationMode])

const handleFindSchemes = async () => {
  try {
    if (!isFormValid) return

    setIsLoading(true)

    setRecommendationMode("manual")

    const data = await predictSchemes({
      age: Number(formData.age),
      income: Number(formData.income),
      gender: formData.gender,
      occupation: formData.occupation,
      state: formData.state,
      category: formData.category,
      disability: formData.disability,
    })

    console.log("API Response:", data)

    const best = data?.best_scheme ?? null
    const rec = Array.isArray(data?.recommended) ? data.recommended : []
    
    setBestScheme(best)
    setRecommended(rec)

    setHasSearched(true)
    setShowInputForm(false)

    // ✅ SAVE TO LOCAL STORAGE
    setGovfinState({
      recommendation: {
        bestScheme: best,
        recommended: rec,
        formData: formData,
        mode: "manual"
      }
    })

  } catch (error) {
    console.error("Error:", error)
    alert("Something went wrong. Try again.") // ✅ USER FEEDBACK
  } finally {
    setIsLoading(false)
  }
}

const handleSearch = async () => {
  if (!searchQuery.trim()) {
    alert("Please enter something to search")
    return
  }

  setSelectedCategory("All")

  try {
    setIsLoading(true)

    const data = await searchSchemes(searchQuery)

    setSearchResults(data?.results || [])
    setHasSearchTriggered(true)

    const prev = getGovfinState() || {}

    setGovfinState({
      ...prev,
      search: {
        query: searchQuery,
        results: data?.results || []
      }
    })
  } catch (error) {
    console.error("Search Error:", error)
    alert("Search failed. Try again.")
  }finally {
    setIsLoading(false)   // ✅ ADD HERE
  }
}

const handleCategoryClick = async (category: string) => {
  // Reset UI cleanly
  setSelectedCategory(category)
  setSearchQuery("")
  setSearchResults([])
  setHasSearchTriggered(false)
  
  // Reset storage safely
  const prev = getGovfinState() || {}
  setGovfinState({
    ...prev,
    category: null,
    search: null
  })

  // 👉 If "All", reset results
  if (category === "All") {
    setSearchResults([])
    setHasSearchTriggered(false)
    return
  }

  try {
    setIsLoading(true)

    const data = await filterSchemes(category)

    setSearchResults(data?.results || [])
    setHasSearchTriggered((data?.results || []).length > 0)

    const prev = getGovfinState() || {}

    setGovfinState({
      ...prev,
      category: {
        selected: category,
        results: data?.results || []
      }
    })

  } catch (error) {
    console.error("Filter Error:", error)
    alert("Filtering failed")
  } finally {
    setIsLoading(false)
  }
}

  const isFormValid =
  Number(formData.age) > 0 &&
  !isNaN(Number(formData.income)) && Number(formData.income) >= 0 &&
  formData.gender !== "" &&
  formData.occupation !== "" &&
  formData.state !== "" &&
  formData.category !== "" &&
  formData.disability !== ""

  const finalBestScheme =
    recommendationMode === "manual"
      ? bestScheme
      : profileBestScheme
  
  const recommendedSchemes =
    recommendationMode === "manual"
      ? recommended
      : profileRecommended

  const hasRecommendations =
    recommendedSchemes.length > 0 || !!finalBestScheme 

  let savedProfile: {
    monthlyIncome?: number
    occupation?: string
    category?: string
    state?: string
    gender?: string
    disability?: string
  } = {}
  
  if (typeof window !== "undefined") {
    try {
      savedProfile = JSON.parse(
        localStorage.getItem("govfin_profile") || "{}"
      )
    } catch {
      savedProfile = {}
    }
  }      

  const reasonUser =
    recommendationMode === "manual"
      ? {
          income: Number(formData.income || 0),
          occupation: formData.occupation,
          category: formData.category,
          state: formData.state,
        }
      : {
          income: Number(savedProfile.monthlyIncome || 0),
          occupation: savedProfile.occupation || "",
          category: savedProfile.category || "",
          state: (savedProfile.state || ""),
        }

function getRecommendationReasons(user: any, scheme: Scheme) {
  const reasons: string[] = []

  if (!scheme?.eligibility) return reasons

  const eligibility = scheme.eligibility

  if (typeof eligibility.max_income === "number" &&  user.income <= eligibility.max_income) {
    reasons.push("Your income matches the scheme criteria")
  }

  if (
    Array.isArray(eligibility.occupation) &&
    (
      (user.occupation && eligibility.occupation.includes(user.occupation)) ||
      eligibility.occupation.includes("all")
    )
  ) {
    reasons.push("Your occupation is eligible")
  }

  if (
    Array.isArray(eligibility.category) &&
    (eligibility.category.includes(user.category) ||
      eligibility.category.includes("all"))
  ) {
    reasons.push("Your category is supported")
  }

  if (
    Array.isArray(eligibility.state) &&
    (eligibility.state.includes(user.state) ||
      eligibility.state.includes("all"))
  ) {
    reasons.push("Available in your state")
  }

  return reasons
}

  return (
    <>
      <Navbar title="Scheme Finder" />
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Profile Status Banner - Subtle */}
          {!isProfileComplete && (
            <div className="flex items-center justify-between gap-2 rounded-md border border-amber-100/80 bg-amber-50/40 px-3 py-1.5">
              <div className="flex items-center gap-2">
                <User className="size-3.5 text-amber-400" />
                <p className="text-xs text-amber-600/90">
                  Complete your profile to get better recommendations
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-6 px-2.5 text-xs font-medium text-amber-600 hover:bg-amber-100/60 hover:text-amber-700">
                <Link href="/profile">Complete Profile</Link>
              </Button>
            </div>
          )}

          {/* Search and Filter Section */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Find Government Schemes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search schemes by name, category, or benefit..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* ✅ NEW SEARCH BUTTON */}
                <Button onClick={handleSearch} disabled={isLoading} className="gap-2">
                  <Search className="size-4" />
                  Search
                </Button>
                <Button variant="outline" className="gap-2">
                  <Filter className="size-4" />
                  Filters
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-blue-100"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 🔍 SEARCH RESULTS SECTION */}
          {(hasSearchTriggered || selectedCategory !== "All") && (
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {searchQuery
                    ? "Search Results"
                    : selectedCategory !== "All"
                    ? `${selectedCategory} Schemes`
                    : ""}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? `Showing results for "${searchQuery}"`
                    : selectedCategory !== "All"
                    ? `Showing ${selectedCategory} schemes`
                    : ""}
                </p>
              </div>
          
              {searchResults.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? `No schemes found for "${searchQuery}"`
                    : selectedCategory !== "All"
                    ? `No ${selectedCategory} schemes found`
                    : ""}
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {searchResults.map((scheme) => (
                    <SchemeCard
                      key={scheme.id}
                      id={scheme.id}
                      name={scheme.name}
                      category={scheme.category_type}
                      benefit={
                        scheme.description?.replace("â‚¹", "₹") ||
                        "No description available"
                      }
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Recommended Schemes Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Recommended for You
                </h2>
                <p className="text-sm text-muted-foreground">
                  {recommendationMode === "manual"
                    ? "Based on your refined inputs"
                    : "Based on your saved profile"}
                </p>
              </div>

              <div className="flex items-center gap-2 ml-auto">  
                {hasSearched && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      clearGovfinState()

                      setRecommendationMode("profile")
                      setBestScheme(null)
                      setRecommended([])
                      setSearchResults([])   // ✅ ADD
                      setSearchQuery("")     // ✅ ADD
                      setHasSearched(false)
                      setHasSearchTriggered(false)
                      setSelectedCategory("All")
                      setIsCategoryLoaded(true)
              
                      setFormData({
                        age: "",
                        income: "",
                        gender: "",
                        occupation: "",
                        state: "",
                        category: "",
                        disability: "",
                      })
              
                      setShowInputForm(false)
                    }}
                  >
                    Clear Results
                  </Button>
                )}
              
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                  onClick={() => setShowInputForm(!showInputForm)}
                >
                  {showInputForm ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  Refine Results
                </Button>
              </div>
            </div>

            {/* Input Form */}
            {showInputForm && (
              <Card className="rounded-2xl border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Sparkles className="size-4 text-blue-600" />
                    Enter Your Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Age
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Gender
                      </label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          setFormData({ ...formData, gender: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                        </Select>
                      </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Annual Income
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter annual income (₹)"
                        value={formData.income}
                        onChange={(e) =>
                          setFormData({ ...formData, income: e.target.value })
                        }
                      />
                       {/* ✅ HELPER TEXT */}
                       {(formData.occupation === "student" ||
                         formData.occupation === "unemployed") && (
                         <p className="text-xs text-muted-foreground">
                           Enter 0 if you don’t have income
                         </p>
                       )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Occupation
                      </label>
                      <Select
                        value={formData.occupation}
                        onValueChange={(value) =>
                          setFormData({ ...formData, occupation: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Occupation" />
                        </SelectTrigger>
                        <SelectContent>
                          {occupations.map((occ) => (
                            <SelectItem key={occ} value={occ}>
                              {occ.replaceAll("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        State
                      </label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) =>
                          setFormData({ ...formData, state: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Category
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Disability
                      </label>
                      <Select
                        value={formData.disability}
                        onValueChange={(value) =>
                          setFormData({ ...formData, disability: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Disability Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleFindSchemes}
                      disabled={!isFormValid || isLoading}
                      className="gap-2"
                    >
                      <Sparkles className="size-4" />
                      {isLoading ? "Finding..." : "Find Schemes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 py-12">
                  <Spinner className="size-5 text-blue-600" />
                  <p className="text-sm text-muted-foreground">
                    {/* Finding best schemes for you... */}
                    {searchQuery
                      ? "Searching schemes..."
                      : selectedCategory !== "All"
                      ? "Filtering schemes..."
                      : "Finding best schemes for you..."}
                  </p>
                </div>
                {/* Skeleton Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="rounded-2xl">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="h-5 w-48 animate-pulse rounded bg-muted" />
                          <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="h-4 w-full animate-pulse rounded bg-muted" />
                          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                        </div>
                        <div className="h-8 w-28 animate-pulse rounded bg-muted" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {recommendationMode === "manual" && hasSearched && !isLoading && recommendedSchemes.length === 0 && (
              <Card className="rounded-2xl border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                    <SearchX className="size-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">
                    No schemes found
                  </h3>
                  <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                    No schemes found based on your inputs. Try adjusting your details or explore all available schemes below.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowInputForm(true)}
                  >
                    <Sparkles className="size-4" />
                    Refine Results
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Recommended Results */}
            {hasRecommendations && !isLoading && (
              <div className="space-y-4">
                {/* Best Match */}
                <div>
                  {finalBestScheme ? (
                    <SchemeCard
                      id={finalBestScheme?.id || 0}
                      name={finalBestScheme.name || "No Name"}
                      category={finalBestScheme?.category_type || "General"}
                      benefit={finalBestScheme?.description?.replace("â‚¹", "₹") || "No description available"}
                      isBestMatch
                    />
                  ) : (
                    hasSearched && (
                      <p className="text-sm text-muted-foreground">
                        No suitable scheme found based on your details.
                      </p>
                    )
                  )}
                </div>

                {/* Other Recommendations */}
                {recommendedSchemes.length > 0 && (
                  <div>
                    <p className="mb-3 text-sm font-medium text-muted-foreground">
                      Other Recommended Schemes
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                        {recommendedSchemes
                          .filter((s) => s.id !== finalBestScheme?.id)
                          .map((scheme) => {
                            const reasons = getRecommendationReasons(reasonUser, scheme)                          
                            return (
                              <SchemeCard
                                key={scheme.id}
                                id={scheme.id}
                                name={scheme.name || "No Name"}
                                category={scheme.category_type || "General"}
                                benefit={
                                  scheme.description
                                    ? scheme.description.replace("â‚¹", "₹")
                                    : "No description available"
                                }
                                showWhyRecommended
                                reasons={reasons}   // ✅ ADD THIS LINE
                              />
                            )
                          })
                        }                            
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Explore All Schemes Section - Reduced Visual Importance */}
          <section className="border-t border-border pt-6">
            <div className="mb-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                Explore All Schemes ({allSchemes.length})
              </h2>
              <p className="text-xs text-muted-foreground/70">
                Browse the complete list of available government schemes
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {allSchemes.map((scheme) => (
                <SchemeCard
                  key={scheme.id}
                  id={scheme.id}
                  name={scheme.name}
                  category={scheme.category}
                  benefit={scheme.benefit}
                  compact
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
