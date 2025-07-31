"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Eye, Calendar, Users, FileText, Trash2, FolderOpen } from "lucide-react"
import Link from "next/link"

interface Project {
  id: number
  name: string
  description: string
  developers: number[]
  files: Array<{
    name: string
    size: number
    type: string
    path: string
  }>
  createdAt: string
}

const availableDevelopers = [
  { id: 1, name: "John Doe", avatar: "JD" },
  { id: 2, name: "Jane Smith", avatar: "JS" },
  { id: 3, name: "Mike Johnson", avatar: "MJ" },
  { id: 4, name: "Sarah Wilson", avatar: "SW" },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem("autodevgenie-projects") || "[]")
    setProjects(savedProjects)
  }, [])

  const deleteProject = (projectId: number) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId)
    setProjects(updatedProjects)
    localStorage.setItem("autodevgenie-projects", JSON.stringify(updatedProjects))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getProjectDevelopers = (developerIds: number[]) => {
    return availableDevelopers.filter((dev) => developerIds.includes(dev.id))
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
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                  <FolderOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">My Projects</h1>
                  <p className="text-sm text-gray-600">View and manage your existing projects</p>
                </div>
              </div>
            </div>
            <Link href="/create-project">
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                Create New Project
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-fit mx-auto mb-6">
              <FolderOpen className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Projects Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by creating your first project. Upload your code and let our AI detect bugs automatically.
            </p>
            <Link href="/create-project">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
              >
                Create Your First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Projects ({projects.length})</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>All Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 group-hover:text-purple-700 transition-colors">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">{project.description}</CardDescription>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => deleteProject(project.id)}>
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{project.files.length} files</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="h-3 w-3" />
                        <span>Team ({project.developers.length})</span>
                      </div>
                      <div className="flex -space-x-2">
                        {getProjectDevelopers(project.developers)
                          .slice(0, 3)
                          .map((dev) => (
                            <Avatar key={dev.id} className="h-8 w-8 ring-2 ring-white">
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-xs">
                                {dev.avatar}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        {project.developers.length > 3 && (
                          <div className="h-8 w-8 bg-gray-100 rounded-full ring-2 ring-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{project.developers.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href={`/code-viewer?project=${project.id}`}>
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                          <Eye className="h-4 w-4 mr-2" />
                          Open Project
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
