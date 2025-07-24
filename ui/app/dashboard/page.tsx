"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Bot,
  Users,
  Plus,
  Code,
  Server,
  Layers,
  Github,
  Calendar,
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Star,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"

type Employee = {
  id: string
  name: string
  role: string
  experience: number
  projectList: string[]
  githubUsername: string
  createdAt?: string
  avatar?: string
}

type Project = {
  id: string
  name: string
  description: string
  assignedEmployees: string[]
  status: string
  progress: number
  createdAt?: string
}

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    assignedEmployees: [] as string[],
  })

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await fetch("http://localhost:8000/employees/")
      const data = await res.json()
      setEmployees(data)
    }
    const fetchProjects = async () => {
      const res = await fetch("http://localhost:8000/projects/")
      const data = await res.json()
      setProjects(data)
    }
    fetchEmployees()
    fetchProjects()
  }, [])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.name.trim()) return
    try {
      const response = await fetch("http://localhost:8000/projects/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProject,
          status: "planning",
          progress: 0,
        }),
      })
      if (response.ok) {
        const created = await response.json()
        setProjects([...projects, { ...newProject, id: created.id, status: "planning", progress: 0 }])
        setNewProject({ name: "", description: "", assignedEmployees: [] })
      }
    } catch (error) {
      // handle error (optional)
    }
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.githubUsername.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || employee.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "frontend":
        return <Code className="h-4 w-4" />
      case "backend":
        return <Server className="h-4 w-4" />
      case "devops":
        return <Layers className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "frontend":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "backend":
        return "bg-green-100 text-green-800 border-green-200"
      case "devops":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "planning":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AutoDevGenie Dashboard</h1>
                <p className="text-sm text-gray-500">Manage your AI-powered development team</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/register">
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50 bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-gray-300 bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                  <p className="text-sm text-gray-600">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                  <p className="text-sm text-gray-600">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">94%</p>
                  <p className="text-sm text-gray-600">Efficiency</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Code className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">1.2k</p>
                  <p className="text-sm text-gray-600">Code Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 pb-8">
        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-12 bg-white shadow-sm">
            <TabsTrigger value="employees" className="flex items-center space-x-2 text-base">
              <Users className="h-4 w-4" />
              <span>Team Members</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center space-x-2 text-base">
              <Plus className="h-4 w-4" />
              <span>Project Management</span>
            </TabsTrigger>
          </TabsList>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6">
            {/* Search and Filter */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                    >
                      <option value="all">All Roles</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="devops">DevOps</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employee Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <Card
                  key={employee.id}
                  className="hover:shadow-xl transition-all duration-300 border-0 shadow-md group"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {employee.avatar}
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-900">{employee.name}</CardTitle>
                          <p className="text-sm text-gray-500">@{employee.githubUsername}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={`${getRoleBadgeColor(employee.role)} border`}>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(employee.role)}
                          <span className="capitalize font-medium">{employee.role}</span>
                        </div>
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{employee.experience}y exp</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <Github className="h-4 w-4 text-gray-400" />
                      <a
                        href={`https://github.com/${employee.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        View Profile
                      </a>
                    </div>

                    {employee.projectList.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-2 text-gray-700">Recent Projects:</p>
                        <div className="flex flex-wrap gap-1">
                          {employee.projectList.slice(0, 2).map((project, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                              {project}
                            </Badge>
                          ))}
                          {employee.projectList.length > 2 && (
                            <Badge variant="outline" className="text-xs bg-gray-50">
                              +{employee.projectList.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Create New Project */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Create New Project</CardTitle>
                  <CardDescription>Set up a new project with AI-powered assistance</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName" className="text-sm font-semibold">
                        Project Name
                      </Label>
                      <Input
                        id="projectName"
                        placeholder="Enter project name"
                        value={newProject.name}
                        onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                        className="h-10"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectDescription" className="text-sm font-semibold">
                        Description
                      </Label>
                      <Textarea
                        id="projectDescription"
                        placeholder="Describe the project goals and requirements..."
                        value={newProject.description}
                        onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-10">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Existing Projects */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Active Projects</CardTitle>
                  <CardDescription>Monitor and manage your current projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{project.name}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                          </div>
                          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm mb-3">
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-600">
                              <Users className="h-4 w-4 inline mr-1" />
                              {project.assignedEmployees.length} members
                            </span>
                            <span className="text-gray-600">Progress: {project.progress}%</span>
                          </div>
                          <span className="text-gray-500">{new Date(project.createdAt || '').toLocaleDateString()}</span>
                        </div>

                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
