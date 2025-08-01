"use client"

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FolderPlus, Eye, Sparkles, Code, Bug, Zap, LogOut, User, Shield, Github } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, logout, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'project_manager':
        return 'Project Manager';
      case 'developer':
        return 'Developer';
      case 'qa':
        return 'QA Engineer';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  AutoDevGenie
                </h1>
                <p className="text-sm text-gray-600">Intelligent Bug Detection & Team Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>AI Powered</span>
              </div>
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Welcome, {user?.name}</span>
                  </div>
                  <Link href="/dashboard">
                    <Button size="sm" className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {isAuthenticated ? (
          // Authenticated User Welcome Section
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              <Zap className="h-4 w-4" />
              Welcome back, {user?.name}!
            </div>
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Ready to{" "}
              <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Manage Projects
              </span>
              <br />
              and Detect Bugs?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You're logged in as a {getRoleDisplayName(user?.role || '')}. Access your personalized dashboard to manage projects, 
              view bug reports, and collaborate with your team.
            </p>
          </div>
        ) : (
          // Non-authenticated User Welcome Section
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              <Zap className="h-4 w-4" />
              Powered by Advanced AI
            </div>
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Detect Bugs,{" "}
              <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Assign Tasks
              </span>
              <br />
              Boost Productivity
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload your projects, let our AI detect bugs automatically, and assign them to your team members. Support
              for all programming languages with intelligent code analysis.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Link href="/developers">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 cursor-pointer transform hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Manage Developers</CardTitle>
                <CardDescription className="text-gray-600">
                  Add, edit, and organize your development team members
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Team Management</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">
                    Manage Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/create-project">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 cursor-pointer transform hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                  <FolderPlus className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Create New Project</CardTitle>
                <CardDescription className="text-gray-600">
                  Upload your code and set up automated bug detection
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>AI Bug Detection</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0">
                    Create Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/projects">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 cursor-pointer transform hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">View Projects</CardTitle>
                <CardDescription className="text-gray-600">Browse and manage your existing projects</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span>Project Overview</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0">
                    View Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Features Section */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-purple-100">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Why Choose AutoDevGenie?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl w-fit mx-auto">
                <Code className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Multi-Language Support</h4>
              <p className="text-sm text-gray-600">
                Supports JavaScript, Python, Java, C++, and 50+ programming languages
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl w-fit mx-auto">
                <Bug className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Smart Bug Detection</h4>
              <p className="text-sm text-gray-600">
                AI-powered analysis detects syntax errors, logic bugs, and security vulnerabilities
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl w-fit mx-auto">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Team Collaboration</h4>
              <p className="text-sm text-gray-600">
                Automatically assign bugs to team members based on expertise and workload
              </p>
            </div>
          </div>
        </div>

      
      </div>
    </div>
  )
}
