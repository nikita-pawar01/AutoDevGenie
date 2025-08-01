"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, FolderOpen, File, Plus, X, Users } from "lucide-react"
import Link from "next/link"

interface Developer {
  id: number;
  name: string;
  email: string;
  role: string;
  skills: string[];
  experience: string;
  status: string;
  avatar: string;
}

export default function CreateProjectPage() {
  const [projectName, setProjectName] = useState("")
  const [projectDesc, setProjectDesc] = useState("")
  const [selectedDevelopers, setSelectedDevelopers] = useState<number[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadType, setUploadType] = useState<"files" | "folder" | null>(null)
  const [availableDevelopers, setAvailableDevelopers] = useState<Developer[]>([])
  const [isLoadingDevelopers, setIsLoadingDevelopers] = useState(true)
  const [showAddDeveloper, setShowAddDeveloper] = useState(false)
  const [newDeveloper, setNewDeveloper] = useState({
    name: "",
    email: "",
    role: "",
    skills: "",
    experience: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  // Fetch team members from backend
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setIsLoadingDevelopers(true)
        const response = await fetch("http://localhost:8000/employees/")
        if (response.ok) {
          const data = await response.json()
          const processed = data.map((dev: any) => ({
            ...dev,
            avatar: dev.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase(),
          }))
          setAvailableDevelopers(processed)
        } else {
          console.error("Failed to fetch developers")
          setAvailableDevelopers([])
        }
      } catch (error) {
        console.error("Error fetching developers:", error)
        setAvailableDevelopers([])
      } finally {
        setIsLoadingDevelopers(false)
      }
    }

    fetchDevelopers()
  }, [])

  const handleDeveloperToggle = (developerId: number) => {
    setSelectedDevelopers((prev) =>
      prev.includes(developerId) ? prev.filter((id) => id !== developerId) : [...prev, developerId],
    )
  }

  const handleAddDeveloper = async () => {
    if (!newDeveloper.name || !newDeveloper.email || !newDeveloper.role) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch("http://localhost:8000/employees/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newDeveloper.name,
          email: newDeveloper.email,
          role: newDeveloper.role,
          skills: newDeveloper.skills.split(",").map(s => s.trim()).filter(s => s),
          experience: newDeveloper.experience,
          status: "Active"
        })
      })

      if (response.ok) {
        const result = await response.json()
        // Refresh the developers list
        const updatedResponse = await fetch("http://localhost:8000/employees/")
        if (updatedResponse.ok) {
          const data = await updatedResponse.json()
          const processed = data.map((dev: any) => ({
            ...dev,
            avatar: dev.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase(),
          }))
          setAvailableDevelopers(processed)
        }
        
        // Reset form and hide
        setNewDeveloper({ name: "", email: "", role: "", skills: "", experience: "" })
        setShowAddDeveloper(false)
      } else {
        alert("Failed to add developer")
      }
    } catch (error) {
      console.error("Error adding developer:", error)
      alert("Failed to add developer")
    }
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
            {isLoadingDevelopers ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-gray-600">Loading team members...</span>
              </div>
            ) : availableDevelopers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">No team members found. Add your first team member to get started.</p>
                <Button onClick={() => setShowAddDeveloper(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            ) : (
              <>
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
                            {developer.skills.slice(0, 2).map((skill: string, index: number) => (
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
                
                {/* Add Developer Button */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button 
                    onClick={() => setShowAddDeveloper(true)} 
                    variant="outline" 
                    className="w-full border-dashed border-2 border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Team Member
                  </Button>
                </div>
              </>
            )}
            
            {/* Add Developer Modal */}
            {showAddDeveloper && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                  <h3 className="text-lg font-semibold mb-4">Add New Team Member</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dev-name">Name *</Label>
                      <Input
                        id="dev-name"
                        value={newDeveloper.name}
                        onChange={(e) => setNewDeveloper(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dev-email">Email *</Label>
                      <Input
                        id="dev-email"
                        type="email"
                        value={newDeveloper.email}
                        onChange={(e) => setNewDeveloper(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dev-role">Role *</Label>
                      <Input
                        id="dev-role"
                        value={newDeveloper.role}
                        onChange={(e) => setNewDeveloper(prev => ({ ...prev, role: e.target.value }))}
                        placeholder="e.g., Frontend Developer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dev-skills">Skills</Label>
                      <Input
                        id="dev-skills"
                        value={newDeveloper.skills}
                        onChange={(e) => setNewDeveloper(prev => ({ ...prev, skills: e.target.value }))}
                        placeholder="React, TypeScript, CSS (comma separated)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dev-experience">Experience</Label>
                      <Input
                        id="dev-experience"
                        value={newDeveloper.experience}
                        onChange={(e) => setNewDeveloper(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="e.g., 3 years"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button onClick={handleAddDeveloper} className="flex-1">
                      Add Developer
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAddDeveloper(false)
                        setNewDeveloper({ name: "", email: "", role: "", skills: "", experience: "" })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
