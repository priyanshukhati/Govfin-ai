"use client"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/dashboard/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Mail,
  Phone,
  Calendar,
  Edit,
  CheckCircle2,
  User,
  MapPinned,
  BadgeInfo,
  Accessibility,
} from "lucide-react"

const defaultProfile = {
  name: "Rahul Kumar",
  email: "rahul@example.com",
  phone: "+91 98765 43210",
  dateOfBirth: "15 August 1990",
  gender: "Male",
  state: "Maharashtra",
  category: "OBC",
  disability: "No",
  occupation: "Small Business Owner",
  monthlyIncome: "45000",
  familySize: "4",
  verified: true,
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState(defaultProfile)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const savedProfile = localStorage.getItem("govfin_profile")
  
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile)
        setUserProfile({
          ...defaultProfile,
          ...parsedProfile,
        })
      } catch (error) {
        console.error("Invalid profile data", error)
        setUserProfile(defaultProfile)
      }
    }
  }, [])

  const saveProfile = () => {
    const income = Number(userProfile.monthlyIncome)
    const family = Number(userProfile.familySize)

    if (userProfile.name.trim() === "") {
      alert("Full Name is required")
      return
    }
  
    if (
      userProfile.monthlyIncome.trim() === "" ||
      isNaN(income) ||
      income < 0
    ) {
      alert("Enter valid Monthly Income")
      return
    }
  
    if (
      userProfile.familySize.trim() === "" ||
      isNaN(family) ||
      family < 1
    ) {
      alert("Enter valid Family Size")
      return
    }
  
    localStorage.setItem(
      "govfin_profile",
      JSON.stringify(userProfile)
    )
  
    setShowModal(false)
  }
  
  return (
    <>
      <Navbar title="Profile" />
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Profile Header */}
          <Card className="rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <Avatar className="size-20">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-semibold">
                    {userProfile.name
                      .trim()
                      .split(" ")
                      .filter(Boolean)
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2) || "RK"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col items-center gap-2 sm:flex-row">
                    <h2 className="text-xl font-semibold text-foreground">
                      {userProfile.name}
                    </h2>
                    {userProfile.verified && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle2 className="mr-1 size-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {userProfile.occupation}
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
                    <span className="flex items-center gap-1 break-all">
                      <Mail className="size-4" />
                      {userProfile.email}
                    </span>
                    <span className="flex items-center gap-1 break-all">
                      <Phone className="size-4" />
                      {userProfile.phone}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowModal(true)}
                >
                  <Edit className="size-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Personal Information */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Full Name</Label>
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" />
                      <Input value={userProfile.name} readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="size-4 text-muted-foreground" />
                      <Input value={userProfile.email} readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-muted-foreground" />
                      <Input value={userProfile.phone} readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Date of Birth</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      <Input value={userProfile.dateOfBirth} readOnly />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Gender</Label>
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" />
                      <Input value={userProfile.gender} readOnly />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">State</Label>
                    <div className="flex items-center gap-2">
                      <MapPinned className="size-4 text-muted-foreground" />
                      <Input value={userProfile.state} readOnly />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Category</Label>
                    <div className="flex items-center gap-2">
                      <BadgeInfo className="size-4 text-muted-foreground" />
                      <Input value={userProfile.category} readOnly />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Disability</Label>
                    <div className="flex items-center gap-2">
                      <Accessibility className="size-4 text-muted-foreground" />
                      <Input value={userProfile.disability} readOnly />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Information */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    Financial Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Occupation</Label>
                    <Input value={userProfile.occupation} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Monthly Income</Label>
                    <Input value={userProfile.monthlyIncome} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Family Size</Label>
                    <Input value={userProfile.familySize.toString()} readOnly />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
      </main>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            const savedProfile = localStorage.getItem("govfin_profile")
          
            if (savedProfile) {
              try {
                const parsedProfile = JSON.parse(savedProfile)

                setUserProfile({
                  ...defaultProfile,
                  ...parsedProfile,
                })
              } catch (error) {
                console.error("Invalid profile data", error)
                setUserProfile(defaultProfile)
              }
            } else {
              setUserProfile(defaultProfile)
            }
          
            setShowModal(false)
          }}
        >
          <Card
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Edit Profile
              </CardTitle>
            </CardHeader>
      
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Input
                placeholder="Full Name"
                value={userProfile.name}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    name: e.target.value,
                  })
                }
              />
      
              <Input
                placeholder="Email"
                value={userProfile.email}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    email: e.target.value,
                  })
                }
              />
      
              <Input
                placeholder="Phone"
                value={userProfile.phone}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    phone: e.target.value,
                  })
                }
              />
      
              <Input
                type="date"
                placeholder="Date of Birth"
                value={userProfile.dateOfBirth}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    dateOfBirth: e.target.value,
                  })
                }
              />
      
              <Input
                placeholder="Gender"
                value={userProfile.gender}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    gender: e.target.value,
                  })
                }
              />
      
              <Input
                placeholder="State"
                value={userProfile.state}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    state: e.target.value,
                  })
                }
              />
      
              <Input
                placeholder="Category"
                value={userProfile.category}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    category: e.target.value,
                  })
                }
              />
      
              <Input
                placeholder="Disability"
                value={userProfile.disability}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    disability: e.target.value,
                  })
                }
              />
      
              <Input
                placeholder="Occupation"
                value={userProfile.occupation}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    occupation: e.target.value,
                  })
                }
              />
      
              <Input
                type="number"
                min="0"
                placeholder="Monthly Income"
                value={userProfile.monthlyIncome}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    monthlyIncome: e.target.value,
                  })
                }
              />
      
              <Input
                type="number"
                min="1"
                placeholder="Family Size"
                value={userProfile.familySize}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    familySize: e.target.value,
                  })
                }
              />
      
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const savedProfile = localStorage.getItem("govfin_profile")
                
                    if (savedProfile) {
                      try {
                        const parsedProfile = JSON.parse(savedProfile)

                        setUserProfile({
                          ...defaultProfile,
                          ...parsedProfile,
                        })
                      } catch (error) {
                        console.error("Invalid profile data", error)
                        setUserProfile(defaultProfile)
                      }
                    } else {
                      setUserProfile(defaultProfile)
                    }
                
                    setShowModal(false)
                  }}
                >
                  Cancel
                </Button>
      
                <Button onClick={saveProfile}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
