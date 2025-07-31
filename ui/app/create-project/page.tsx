"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, FolderOpen, File, Plus, X } from "lucide-react"
import Link from "next/link"

const availableDevelopers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@company.com",
    role: "Frontend Developer",
    skills: ["React", "TypeScript", "CSS"],
    avatar: "JD",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@company.com",
    role: "Backend Developer",
    skills: ["Node.js", "Python", "PostgreSQL"],
    avatar: "JS",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@company.com",
    role: "Full Stack Developer",
    skills: ["React", "Node.js", "MongoDB"],
    avatar: "MJ",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@company.com",
    role: "DevOps Engineer",
    skills: ["Docker", "Kubernetes", "AWS"],
    avatar: "SW",
  },
]

export default function CreateProjectPage() {
  const [projectName, setProjectName] = useState("")
  const [projectDesc, setProjectDesc] = useState("")
  const [selectedDevelopers, setSelectedDevelopers] = useState<number[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadType, setUploadType] = useState<"files" | "folder" | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const handleDeveloperToggle = (developerId: number) => {
    setSelectedDevelopers((prev) =>
      prev.includes(developerId) ? prev.filter((id) => id !== developerId) : [...prev, developerId],
    )
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(files)
    setUploadType("files")
  }

  const handleFolderUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(files)
    setUploadType("folder")
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    return <File className="h-4 w-4 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const createProject = () => {
    if (projectName && projectDesc && selectedDevelopers.length > 0 && uploadedFiles.length > 0) {
      // Store project data in localStorage for demo purposes
      const projectData = {
        id: Date.now(),
        name: projectName,
        description: projectDesc,
        developers: selectedDevelopers,
        files: uploadedFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          path: file.webkitRelativePath || file.name,
        })),
        createdAt: new Date().toISOString(),
      }

      const existingProjects = JSON.parse(localStorage.getItem("autodevgenie-projects") || "[]")
      localStorage.setItem("autodevgenie-projects", JSON.stringify([...existingProjects, projectData]))

      // Redirect to code viewer with project data
      window.location.href = `/code-viewer?project=${projectData.id}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Create New Project</h1>
                <p className="text-sm text-gray-600">Set up your project for AI-powered bug detection</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Project Details */}
        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-purple-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Project Information
            </CardTitle>
            <CardDescription>Provide basic details about your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-desc">Project Description *</Label>
                <Textarea
                  id="project-desc"
                  placeholder="Describe your project"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Selection */}
        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-purple-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Select Team Members
            </CardTitle>
            <CardDescription>Choose developers from your team ({selectedDevelopers.length} selected)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDevelopers.map((developer) => (
                <div
                  key={developer.id}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedDevelopers.includes(developer.id)
                      ? "border-purple-300 bg-purple-50"
                      : "border-gray-200 hover:border-purple-200"
                  }`}
                  onClick={() => handleDeveloperToggle(developer.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedDevelopers.includes(developer.id)}
                      onChange={() => handleDeveloperToggle(developer.id)}
                      className="data-[state=checked]:bg-purple-600"
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        {developer.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{developer.name}</p>
                      <p className="text-sm text-gray-600">{developer.role}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {developer.skills.slice(0, 2).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {developer.skills.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{developer.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-purple-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Upload Project Files
            </CardTitle>
            <CardDescription>
              Upload individual files or entire project folder ({uploadedFiles.length} files uploaded)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full h-24 border-2 border-dashed border-purple-300 hover:border-purple-400 hover:bg-purple-50 bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <Upload className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <p className="font-medium text-purple-700">Upload Files</p>
                    <p className="text-xs text-gray-600">Select multiple files</p>
                  </div>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.php,.rb,.go,.rs,.swift,.kt,.dart,.vue,.html,.css,.scss,.json,.xml,.yaml,.yml,.md,.txt"
                />
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full h-24 border-2 border-dashed border-purple-300 hover:border-purple-400 hover:bg-purple-50 bg-transparent"
                  onClick={() => folderInputRef.current?.click()}
                >
                  <div className="text-center">
                    <FolderOpen className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <p className="font-medium text-purple-700">Upload Folder</p>
                    <p className="text-xs text-gray-600">Select entire project folder</p>
                  </div>
                </Button>
                <input
                  ref={folderInputRef}
                  type="file"
                  webkitdirectory=""
                  className="hidden"
                  onChange={handleFolderUpload}
                />
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Uploaded Files</h4>
                  <Badge variant="secondary">{uploadedFiles.length} files</Badge>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 bg-gray-50 rounded-lg p-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getFileIcon(file.name)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.webkitRelativePath || file.name}
                          </p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Project Button */}
        <div className="flex justify-end">
          <Button
            onClick={createProject}
            disabled={!projectName || !projectDesc || selectedDevelopers.length === 0 || uploadedFiles.length === 0}
            size="lg"
            className="px-8 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
          >
            Create Project & Start Analysis
          </Button>
        </div>
      </div>
    </div>
  )
}
