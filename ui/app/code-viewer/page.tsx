"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, ChevronDown, File, Bug, Users, FolderOpen, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const availableDevelopers = [
  { id: 1, name: "John Doe", email: "john@company.com", role: "Frontend Developer", avatar: "JD" },
  { id: 2, name: "Jane Smith", email: "jane@company.com", role: "Backend Developer", avatar: "JS" },
  { id: 3, name: "Mike Johnson", email: "mike@company.com", role: "Full Stack Developer", avatar: "MJ" },
  { id: 4, name: "Sarah Wilson", email: "sarah@company.com", role: "DevOps Engineer", avatar: "SW" },
]

export default function CodeViewer() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get("project")
  
  const [project, setProject] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [expandedFolders, setExpandedFolders] = useState(new Set(["root"]))
  const [bugsDetected, setBugsDetected] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (projectId) {
      const savedProjects = JSON.parse(localStorage.getItem("autodevgenie-projects") || "[]")
      const foundProject = savedProjects.find((p: any) => p.id === Number.parseInt(projectId))
      if (foundProject) {
        setProject(foundProject)
        // Build file tree from uploaded files
        buildFileTree(foundProject.files)
      }
    }
  }, [projectId])

  const buildFileTree = (files: any[]) => {
    // For demo purposes, we'll create a simple file structure
    // In a real app, you'd parse the file paths to build a proper tree
    if (files.length > 0) {
      setSelectedFile({
        name: files[0].name,
        content: generateSampleCode(files[0].name),
        path: files[0].path
      })
    }
  }

  const generateSampleCode = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return `// ${fileName}
import React from 'react';

const Component = ({ data }) => {
  // Bug: Missing prop validation
  const handleClick = () => {
    console.log(data.name.toUpperCase()); // Potential null reference
  };

  return (
    <div onClick={handleClick}>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
};

export default Component;`
      
      case 'py':
        return `# ${fileName}
def process_data(data):
    # Bug: No error handling
    result = []
    for item in data:
        result.append(item['value'] * 2)  # KeyError if 'value' doesn't exist
    return result

def main():
    data = [{'value': 1}, {'value': 2}]
    processed = process_data(data)
    print(processed)`
      
      case 'java':
        return `// ${fileName}
public class DataProcessor {
    public void processArray(int[] arr) {
        // Bug: Array bounds not checked
        for (int i = 0; i <= arr.length; i++) {  // Should be < not <=
            System.out.println(arr[i] * 2);
        }
    }
    
    public String getName(User user) {
        // Bug: Null pointer potential
        return user.getName().toUpperCase();
    }
}`
      
      default:
        return `// ${fileName}
// Sample code content
// This file contains potential bugs that will be detected by our AI system
function example() {
  console.log("Hello World");
}`
    }
  }

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const renderFileTree = () => {
    if (!project) return null

    return (
      <div className="space-y-1">
        <div
          className="flex items-center gap-1 py-1 px-2 hover:bg-purple-50 cursor-pointer text-sm font-medium"
          onClick={() => toggleFolder("root")}
        >
          {expandedFolders.has("root") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <FolderOpen className="h-4 w-4 text-purple-600" />
          <span>{project.name}</span>
        </div>
        {expandedFolders.has("root") && (
          <div className="ml-4 space-y-1">
            {project.files.map((file: any, index: number) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-1 py-1 px-2 hover:bg-purple-50 cursor-pointer text-sm",
                  selectedFile?.name === file.name && "bg-purple-100"
                )}
                onClick={() => setSelectedFile({
                  name: file.name,
                  content: generateSampleCode(file.name),
                  path: file.path
                })}
              >
                <File className="h-4 w-4 text-gray-500" />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const findBugsAndAssign = async () => {
    setIsAnalyzing(true)

    setTimeout(() => {
      const detectedBugs = [
        {
          id: 1,
          file: selectedFile?.name || "example.js",
          line: 7,
          type: "Null Reference",
          severity: "High",
          description: "Potential null reference error when accessing object properties",
          assignedTo: availableDevelopers.find(dev => project?.developers.includes(dev.id)) || availableDevelopers[0],
        },
        {
          id: 2,
          file: selectedFile?.name || "example.js",
          line: 12,
          type: "Missing Validation",
          severity: "Medium",
          description: "Missing prop validation can cause runtime errors",
          assignedTo: availableDevelopers.find(dev => project?.developers.includes(dev.id)) || availableDevelopers[1],
        },
        {
          id: 3,
          file: "utils.js",
          line: 5,
          type: "Array Bounds",
          severity: "High",
          description: "Loop condition may cause array index out of bounds",
          assignedTo: availableDevelopers.find(dev => project?.developers.includes(dev.id)) || availableDevelopers[2],
        },
      ]

      setBugsDetected(detectedBugs)
      setIsAnalyzing(false)
    }, 3000)
  }

  const getProjectDevelopers = () => {
    if (!project) return []
    return availableDevelopers.filter(dev => project.developers.includes(dev.id))
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-white via-purple-50 to-purple-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                {project.name}
              </h1>
              <p className="text-gray-600">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">{getProjectDevelopers().length} team members</span>
            </div>
            <Button onClick={findBugsAndAssign} disabled={isAnalyzing} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Bug className="h-4 w-4 mr-2" />
                  Find Bugs and Assign
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <div className="w-80 border-r bg-white/50 backdrop-blur-sm">
          <div className="p-3 border-b bg-white/70">
            <h3 className="font-semibold text-sm text-purple-700">Project Explorer</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">{renderFileTree()}</div>
          </ScrollArea>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col bg-white/30">
          {selectedFile ? (
            <>
              <div className="border-b p-3 bg-white/70 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-gray-900">{selectedFile.name}</span>
                  <Badge variant="secondary" className="text-xs">{selectedFile.path}</Badge>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <pre className="p-4 text-sm font-mono bg-white/50 backdrop-blur-sm min-h-full border-r">
                  <code className="text-gray-800">{selectedFile.content}</code>
                </pre>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a file to view its contents</p>
              </div>
            </div>
          )}
        </div>

        {/* Team & Bugs Panel */}
        <div className="w-96 border-l bg-white/50 backdrop-blur-sm flex flex-col">
          {/* Team Members */}
          <div className="p-4 border-b bg-white/70">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-purple-700">
              <Users className="h-4 w-4" />
              Team Members
            </h3>
            <div className="space-y-2">
              {getProjectDevelopers().map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/70 backdrop-blur-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-xs">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-600 truncate">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detected Bugs */}
          <div className="flex-1 p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-purple-700">
              <Bug className="h-4 w-4" />
              Detected Bugs ({bugsDetected.length})
            </h3>
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                {bugsDetected.map((bug: any) => (
                  <Card key={bug.id} className="p-3 bg-white/70 backdrop-blur-sm border-0 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={bug.severity === "High" ? "destructive" : "secondary"} className="text-xs">
                          {bug.severity}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {bug.file}:{bug.line}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900">{bug.type}</h4>
                      <p className="text-sm text-gray-600">{bug.description}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {bug.assignedTo.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600">Assigned to {bug.assignedTo.name}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
