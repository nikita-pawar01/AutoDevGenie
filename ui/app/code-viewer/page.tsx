"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, ChevronDown, File, Bug, Users, FolderOpen, ArrowLeft, Lightbulb, AlertTriangle, CheckCircle, GitBranch, RefreshCw, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Local cache used before remote fetch completes
const FALLBACK_DEVELOPERS = [
  { id: 1, name: "John Doe", email: "john@company.com", role: "Frontend Developer", avatar: "JD" },
  { id: 2, name: "Jane Smith", email: "jane@company.com", role: "Backend Developer", avatar: "JS" },
  { id: 3, name: "Mike Johnson", email: "mike@company.com", role: "Full Stack Developer", avatar: "MJ" },
  { id: 4, name: "Sarah Wilson", email: "sarah@company.com", role: "DevOps Engineer", avatar: "SW" },
]

export default function CodeViewer() {
  type Developer = typeof FALLBACK_DEVELOPERS[number]
  
  const searchParams = useSearchParams()
  const projectId = searchParams.get("project")
  
  interface BugReport {
    id: number;
    file: string;
    line: number;
    type: string;
    severity: 'High' | 'Medium' | 'Low';
    description: string;
    assignedTo: Developer;
  }

  interface AnalysisResult {
    bugs: BugReport[];
    suggestions: string[];
    qualityScore: number;
    explanation: string;
  }

  const [project, setProject] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  
  // Debug: Log selectedFile changes
  useEffect(() => {
    console.log('Selected file changed:', selectedFile);
  }, [selectedFile]);
  const [expandedFolders, setExpandedFolders] = useState(new Set(["root"]))
  const [bugsDetected, setBugsDetected] = useState<BugReport[]>([])
  const [developers, setDevelopers] = useState<Developer[]>(FALLBACK_DEVELOPERS)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showGitHubModal, setShowGitHubModal] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [githubConfig, setGithubConfig] = useState({
    repository: "",
    branch: "main",
    accessToken: ""
  })

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

  // Fetch developers list once on mount
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const res = await fetch('http://localhost:8000/employees/')
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const devs = await res.json()
        // Expecting backend returns array with _id or id; normalise
        const formatted = devs.map((d: any, idx: number) => ({
          id: d.id || idx + 1,
          name: d.name,
          email: d.email,
          role: d.role,
          avatar: d.name.split(' ').map((n: string)=>n[0]).join('').substring(0,2).toUpperCase()
        }))
        setDevelopers(formatted)
      } catch (e) {
        console.error('Failed to fetch developers, using fallback', e)
      }
    }
    fetchDevelopers()
  }, [])

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
      
      case 'vue':
        return `<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>`
      
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`
      
      case 'css':
        return `/* ${fileName} */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`
      
      case 'json':
        return `{
  "name": "demo-app",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.3.4"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.3",
    "vite": "^4.4.5"
  }
}`
      
      case 'md':
        return `# ${fileName}

This is a sample README file for the project.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm run dev
\`\`\`

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct.

## License

This project is licensed under the MIT License.`
      
      case 'gitignore':
        return `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`
      
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
                onClick={() => {
                  // Try to get actual file content first, fallback to sample code
                  const fileContent = file.content || generateSampleCode(file.name);
                  console.log('Setting selected file:', {
                    name: file.name,
                    path: file.path,
                    hasActualContent: !!file.content,
                    contentLength: fileContent.length
                  });
                  setSelectedFile({
                  name: file.name,
                    content: fileContent,
                  path: file.path
                  });
                  // Clear previous analysis results when switching files
                  setBugsDetected([]);
                  setAnalysisResults([]);
                }}
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
    if (!selectedFile) {
      alert('Please select a file to analyze');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Get the actual project developers (names, not IDs)
      const projectDeveloperNames = getProjectDevelopers().map(dev => dev.name);
      
      // Prepare the payload with only the currently selected file
      const payload = {
        files: [{
          name: selectedFile.name,
          path: selectedFile.path,
          size: 1024, // Default size
          type: getMimeType(selectedFile.name) // Get MIME type from filename
        }],
        developers: projectDeveloperNames
      };

      // Log the payload for verification
      console.log('Sending payload to analyze:', payload);
      
      const response = await fetch('http://localhost:8000/analyze/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }
      
      const bugs = await response.json() as Array<{
        file: string;
        line: number;
        type: string;
        severity: string;
        description: string;
        assignedTo: string;
      }>;
      
      // Log the response for verification
      console.log('Received bugs:', bugs);
      
      // Map the response to match our frontend bug format
      const detectedBugs: BugReport[] = bugs.map((bug, index) => {
        // Find the developer by name from the backend response
        const assignedDeveloper = developers.find(d => d.name === bug.assignedTo) || developers[0];
        
        return {
        id: index + 1,
        file: bug.file,
        line: bug.line,
        type: bug.type,
        severity: bug.severity as 'High' | 'Medium' | 'Low',
        description: bug.description,
          assignedTo: assignedDeveloper
        };
      });
      
      setBugsDetected(detectedBugs);
      
      // Group results by file for better organization
      const resultsByFile = new Map<string, AnalysisResult>();
      
      bugs.forEach((bug, index) => {
        if (!resultsByFile.has(bug.file)) {
          resultsByFile.set(bug.file, {
            bugs: [],
            suggestions: [],
            qualityScore: 7, // Default score
            explanation: "Analysis completed"
          });
        }
        
        const fileResult = resultsByFile.get(bug.file)!;
        fileResult.bugs.push({
          id: index + 1,
          file: bug.file,
          line: bug.line,
          type: bug.type,
          severity: bug.severity as 'High' | 'Medium' | 'Low',
          description: bug.description,
          assignedTo: developers.find(d => d.name === bug.assignedTo) || developers[0]
        });
      });
      
      setAnalysisResults(Array.from(resultsByFile.values()));
    } catch (error) {
      console.error('Error analyzing code:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to analyze code: ${errorMessage}. Please check the console for details.`);      
    } finally {
      setIsAnalyzing(false);
    }
  }

  const getMimeType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'text/javascript'
      case 'ts':
      case 'tsx':
        return 'text/typescript'
      case 'py':
        return 'text/x-python'
      case 'java':
        return 'text/x-java-source'
      case 'html':
        return 'text/html'
      case 'css':
        return 'text/css'
      case 'json':
        return 'application/json'
      case 'xml':
        return 'application/xml'
      case 'md':
        return 'text/markdown'
      case 'txt':
        return 'text/plain'
      default:
        return 'text/plain'
    }
  }

  const getProjectDevelopers = () => {
    if (!project) return []
    return developers.filter(dev => project.developers.includes(dev.id))
  }

  const syncWithGitHub = async () => {
    if (!githubConfig.repository || !githubConfig.accessToken) {
      alert('Please configure GitHub repository and access token')
      return
    }

    setIsSyncing(true)
    try {
      // Call backend to sync with GitHub
      const response = await fetch('http://localhost:8000/sync-github/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repository: githubConfig.repository,
          branch: githubConfig.branch,
          accessToken: githubConfig.accessToken,
          projectId: projectId
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to sync: ${response.statusText}`)
      }

      const result = await response.json()
      
      // Update project files with new data from GitHub
      if (result.files && result.files.length > 0) {
        const updatedProject = {
          ...project,
          files: result.files
        }
        setProject(updatedProject)
        
        // Update localStorage
        const existingProjects = JSON.parse(localStorage.getItem("autodevgenie-projects") || "[]")
        const updatedProjects = existingProjects.map((p: any) => 
          p.id === Number.parseInt(projectId!) ? updatedProject : p
        )
        localStorage.setItem("autodevgenie-projects", JSON.stringify(updatedProjects))
        
        // Clear analysis results since files have changed
        setBugsDetected([])
        setAnalysisResults([])
        
        alert(`Successfully synced ${result.files.length} files from GitHub!`)
      }
    } catch (error) {
      console.error('Error syncing with GitHub:', error)
      alert(`Failed to sync with GitHub: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSyncing(false)
      setShowGitHubModal(false)
    }
  }

  const handleGitHubConfig = () => {
    setShowGitHubModal(true)
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
            <Button 
              onClick={handleGitHubConfig} 
              variant="outline" 
              className="border-gray-300 hover:border-purple-400"
            >
              <GitBranch className="h-4 w-4 mr-2" />
              Sync GitHub
            </Button>
            <Button 
              onClick={findBugsAndAssign} 
              disabled={isAnalyzing || !selectedFile} 
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing {selectedFile?.name}...
                </>
              ) : (
                <>
                  <Bug className="h-4 w-4 mr-2" />
                  {selectedFile ? `Analyze ${selectedFile.name}` : 'Select a file to analyze'}
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
          <code className="text-gray-800">
            {selectedFile.content || '// No content available for this file.'}
          </code>
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

          {/* AI Analysis Results */}
          <div className="flex-1 p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-purple-700">
              <Bug className="h-4 w-4" />
              AI Analysis Results
              {selectedFile && (
                <span className="text-sm font-normal text-gray-600">
                  for {selectedFile.name}
                </span>
              )}
              <span className="text-sm font-normal text-gray-500">
                ({bugsDetected.length} issues found)
              </span>
            </h3>
            {/* Scrollable results container */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {analysisResults.length > 0 ? (
                analysisResults.map((result, fileIndex) => (
                  <Card key={fileIndex} className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-sm">
              <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">File Analysis</h4>
                        <Badge variant="outline" className="text-xs">
                          Quality Score: {result.qualityScore}/10
                        </Badge>
                      </div>
                      {/* Bugs Section */}
                      {result.bugs.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-red-700 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Bugs Found:
                          </h5>
                          {result.bugs.map((bug) => (
                            <div key={bug.id} className="pl-3 border-l-2 border-red-200 bg-red-50/50 p-2 rounded">
                              <div className="flex items-center justify-between mb-1">
                                <Badge variant={bug.severity === "High" ? "destructive" : "secondary"} className="text-xs">
                                  {bug.severity}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  Line {bug.line}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{bug.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="text-xs">
                                    {bug.assignedTo.name.split(' ').map((n: string) => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-600">Assigned to {bug.assignedTo.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Suggestions Section */}
                      {result.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-blue-700 flex items-center gap-1">
                            <Lightbulb className="h-3 w-3" />
                            Suggestions:
                          </h5>
                          {result.suggestions.map((suggestion, index) => (
                            <div key={index} className="pl-3 border-l-2 border-blue-200 bg-blue-50/50 p-2 rounded">
                              <p className="text-sm text-gray-700">{suggestion}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Explanation */}
                      {result.explanation && (
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-600">{result.explanation}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              ) : bugsDetected.length > 0 ? (
                // Fallback to old format if analysis results not available
                bugsDetected.map((bug: any) => (
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
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Bug className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {selectedFile 
                      ? "No analysis results yet. Click the analyze button to start analysis."
                      : "Select a file from the project explorer to analyze it."
                    }
                  </p>
                </div>
              )}
              </div>
          </div>
        </div>
      </div>

      {/* GitHub Configuration Modal */}
      {showGitHubModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              GitHub Repository Sync
            </h3>
            <div className="space-y-4">
              <div>
                <Label
                 htmlFor="repo-url">Repository URL *</Label>
                <Input
                  id="repo-url"
                  value={githubConfig.repository}
                  onChange={(e) => setGithubConfig(prev => ({ ...prev, repository: e.target.value }))}
                  placeholder="https://github.com/username/repository"
                />
              </div>
              <div>
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  value={githubConfig.branch}
                  onChange={(e) => setGithubConfig(prev => ({ ...prev, branch: e.target.value }))}
                  placeholder="main"
                />
              </div>
              <div>
                <Label htmlFor="access-token">GitHub Access Token *</Label>
                <Input
                  id="access-token"
                  type="password"
                  value={githubConfig.accessToken}
                  onChange={(e) => setGithubConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Create a personal access token in GitHub Settings → Developer settings → Personal access tokens
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={syncWithGitHub} 
                disabled={isSyncing}
                className="flex-1"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <GitBranch className="h-4 w-4 mr-2" />
                    Sync Repository
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowGitHubModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
