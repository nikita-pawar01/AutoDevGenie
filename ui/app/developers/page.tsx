"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, ArrowLeft, Users, Mail, Code } from "lucide-react"
import Link from "next/link"

const initialDevelopers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Frontend Developer",
    skills: ["React", "TypeScript", "CSS", "JavaScript"],
    experience: "5 years",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40&text=JD",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    phone: "+1 (555) 234-5678",
    role: "Backend Developer",
    skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
    experience: "7 years",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40&text=JS",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    phone: "+1 (555) 345-6789",
    role: "Full Stack Developer",
    skills: ["React", "Node.js", "MongoDB", "Docker"],
    experience: "4 years",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40&text=MJ",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    phone: "+1 (555) 456-7890",
    role: "DevOps Engineer",
    skills: ["Kubernetes", "AWS", "CI/CD", "Terraform"],
    experience: "6 years",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40&text=SW",
  },
  {
    id: 5,
    name: "Alex Chen",
    email: "alex.chen@company.com",
    phone: "+1 (555) 567-8901",
    role: "Mobile Developer",
    skills: ["React Native", "Swift", "Kotlin", "Flutter"],
    experience: "3 years",
    status: "Inactive",
    avatar: "/placeholder.svg?height=40&width=40&text=AC",
  },
]

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState(initialDevelopers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newDeveloper, setNewDeveloper] = useState({
    name: "",
    email: "",
    role: "",
    skills: "",
    experience: "",
  })

  const filteredDevelopers = developers.filter((dev) => {
    const matchesSearch =
      dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = filterRole === "all" || dev.role === filterRole
    return matchesSearch && matchesRole
  })

  const addDeveloper = () => {
    if (newDeveloper.name && newDeveloper.email && newDeveloper.role) {
      const developer = {
        id: Date.now(),
        ...newDeveloper,
        skills: newDeveloper.skills.split(",").map((s) => s.trim()),
        status: "Active",
        avatar: newDeveloper.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
      }
      setDevelopers([...developers, developer])
      setNewDeveloper({ name: "", email: "", role: "", skills: "", experience: "" })
      setIsAddingNew(false)
    }
  }

  const deleteDeveloper = (id: number) => {
    setDevelopers(developers.filter((dev) => dev.id !== id))
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "frontend developer":
        return "bg-blue-100 text-blue-700"
      case "backend developer":
        return "bg-green-100 text-green-700"
      case "full stack developer":
        return "bg-purple-100 text-purple-700"
      case "devops engineer":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Developer Management</h1>
                  <p className="text-sm text-gray-600">Manage your development team</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsAddingNew(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Developer
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search developers by name, email, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 border-purple-200 focus:border-purple-400"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-full sm:w-48 bg-white/70 border-purple-200">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
              <SelectItem value="Backend Developer">Backend Developer</SelectItem>
              <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
              <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
              <SelectItem value="Mobile Developer">Mobile Developer</SelectItem>
              <SelectItem value="QA Engineer">QA Engineer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add Developer Form */}
        {isAddingNew && (
          <Card className="mb-8 border-0 bg-white/70 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-purple-700">Add New Developer</CardTitle>
              <CardDescription>Fill in the developer's information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={newDeveloper.name}
                    onChange={(e) => setNewDeveloper({ ...newDeveloper, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newDeveloper.email}
                    onChange={(e) => setNewDeveloper({ ...newDeveloper, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={(value) => setNewDeveloper({ ...newDeveloper, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                      <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                      <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                      <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                      <SelectItem value="Mobile Developer">Mobile Developer</SelectItem>
                      <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select onValueChange={(value) => setNewDeveloper({ ...newDeveloper, experience: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior">Junior (0-2 years)</SelectItem>
                      <SelectItem value="Mid-level">Mid-level (2-5 years)</SelectItem>
                      <SelectItem value="Senior">Senior (5+ years)</SelectItem>
                      <SelectItem value="Lead">Lead (8+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    placeholder="e.g., React, Node.js, Python, Docker"
                    value={newDeveloper.skills}
                    onChange={(e) => setNewDeveloper({ ...newDeveloper, skills: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={addDeveloper} className="bg-gradient-to-r from-purple-500 to-purple-600">
                  Add Developer
                </Button>
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Developers Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Team Members ({developers.length})</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>All Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((developer) => (
              <Card
                key={developer.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-purple-100">
                        <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${developer.avatar}`} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold">
                          {developer.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{developer.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span>{developer.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(developer.id)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteDeveloper(developer.id)}>
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Badge className={`${getRoleColor(developer.role)} border-0`}>{developer.role}</Badge>
                    <Badge variant="outline" className="ml-2">
                      {developer.experience}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Code className="h-3 w-3" />
                      <span>Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {developer.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {developers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No developers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add a new developer.</p>
          </div>
        )}
      </div>
    </div>
  )
}
