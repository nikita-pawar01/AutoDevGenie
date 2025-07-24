"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Bot, ArrowLeft, User, Code, Server, Layers, Github, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    experience: "",
    projectList: "",
    githubUsername: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/employees/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          experience: parseInt(formData.experience, 10),
          projectList: formData.projectList.split(',').map(p => p.trim()).filter(Boolean),
        }),
      })
      if (response.ok) {
        setShowSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        // handle error (optional: show error message)
      }
    } catch (error) {
      // handle error (optional: show error message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "frontend":
        return <Code className="h-5 w-5" />
      case "backend":
        return <Server className="h-5 w-5" />
      case "devops":
        return <Layers className="h-5 w-5" />
      default:
        return <User className="h-5 w-5" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "frontend":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "backend":
        return "text-green-600 bg-green-50 border-green-200"
      case "devops":
        return "text-purple-600 bg-purple-50 border-purple-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardContent className="pt-8 pb-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-4">Employee has been added to your team.</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AutoDevGenie</h1>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-gray-300 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Registration Form */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <User className="h-4 w-4" />
              <span>Team Registration</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Register New Employee</h2>
            <p className="text-gray-600">Add a new team member to your AutoDevGenie workspace</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">Employee Information</CardTitle>
              <CardDescription>Fill in the details to add a new team member</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-semibold">
                    Role
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select role">
                        {formData.role && (
                          <div
                            className={`flex items-center space-x-2 px-3 py-1 rounded-md border ${getRoleColor(formData.role)}`}
                          >
                            {getRoleIcon(formData.role)}
                            <span className="capitalize font-medium">{formData.role} Developer</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">
                        <div className="flex items-center space-x-3">
                          <Code className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium">Frontend Developer</div>
                            <div className="text-xs text-gray-500">React, Vue, Angular</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="backend">
                        <div className="flex items-center space-x-3">
                          <Server className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="font-medium">Backend Developer</div>
                            <div className="text-xs text-gray-500">Node.js, Python, Java</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="devops">
                        <div className="flex items-center space-x-3">
                          <Layers className="h-5 w-5 text-purple-600" />
                          <div>
                            <div className="font-medium">DevOps Engineer</div>
                            <div className="text-xs text-gray-500">Docker, Kubernetes, CI/CD</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience and GitHub in a row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-semibold">
                      Years of Experience
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="experience"
                        type="number"
                        placeholder="e.g., 3"
                        min="0"
                        max="50"
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        className="h-12 pl-11 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="githubUsername" className="text-sm font-semibold">
                      GitHub Username
                    </Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="githubUsername"
                        type="text"
                        placeholder="e.g., johndoe"
                        value={formData.githubUsername}
                        onChange={(e) => handleInputChange("githubUsername", e.target.value)}
                        className="h-12 pl-11 text-base"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Project List Field */}
                <div className="space-y-2">
                  <Label htmlFor="projectList" className="text-sm font-semibold">
                    Project Experience
                  </Label>
                  <Textarea
                    id="projectList"
                    placeholder="e.g., E-commerce Platform, Mobile Banking App, Analytics Dashboard"
                    value={formData.projectList}
                    onChange={(e) => handleInputChange("projectList", e.target.value)}
                    rows={4}
                    className="text-base resize-none"
                  />
                  <p className="text-sm text-gray-500 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>Enter project names separated by commas</span>
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base font-semibold shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Registering Employee...</span>
                    </div>
                  ) : (
                    "Register Employee"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
