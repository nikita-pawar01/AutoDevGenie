import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Users, FolderOpen, GitBranch, Zap, Code2, Brain, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot className="h-10 w-10 text-blue-600" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AutoDevGenie</h1>
                <p className="text-xs text-gray-500">AI-Powered Development Assistant</p>
              </div>
            </div>
            <nav className="flex items-center space-x-3">
              <Link href="/register">
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50 bg-transparent">
                  Register Employee
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">Dashboard</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="h-4 w-4" />
            <span>Powered by Advanced AI Agents</span>
          </div>

          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Assistant for
            <br />
            <span className="text-blue-600">Agile Software Teams</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-10 leading-relaxed">
            Streamline your development lifecycle with intelligent agents that handle code reviews, test generation,
            sprint planning, and bug reproduction automatically. Transform your team's productivity with AutoDevGenie.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg px-8 py-3 text-lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-gray-300 px-8 py-3 text-lg bg-transparent">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
            <div className="text-gray-600">Faster Code Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">60%</div>
            <div className="text-gray-600">Reduced Bug Reports</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
            <div className="text-gray-600">Sprint Efficiency</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">AI Monitoring</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Team Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Register and manage your development team members with intelligent role-based insights and analytics
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <FolderOpen className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Smart Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Create and monitor projects with AI-powered insights, automated task assignment, and progress tracking
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                <Code2 className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Code Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Automated code reviews, intelligent test generation, and proactive bug detection using advanced AI
                agents
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Sprint Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                AI-powered sprint planning, automated task distribution, and intelligent deadline optimization
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* AI Agents Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet Your AI Development Team</h3>
            <p className="text-lg text-gray-600">
              Specialized AI agents working 24/7 to enhance your development workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="mx-auto mb-4 p-4 bg-blue-600 rounded-full w-fit">
                <Code2 className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-blue-900">CodeAgent</h4>
              <p className="text-blue-700">Automated code reviews, refactoring suggestions, and quality analysis</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="mx-auto mb-4 p-4 bg-green-600 rounded-full w-fit">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-green-900">TestAgent</h4>
              <p className="text-green-700">Intelligent test case generation and automated testing workflows</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-red-50 to-red-100">
              <div className="mx-auto mb-4 p-4 bg-red-600 rounded-full w-fit">
                <GitBranch className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-red-900">BugAgent</h4>
              <p className="text-red-700">Proactive bug detection, reproduction, and resolution assistance</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
