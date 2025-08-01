'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  FolderPlus, 
  Eye, 
  Sparkles, 
  LogOut, 
  User, 
  Shield, 
  Github, 
  Home, 
  Mail, 
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Code,
  Bug,
  Settings,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'project_manager':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'developer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'qa':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'project_manager':
        return <Users className="h-4 w-4" />;
      case 'developer':
        return <Code className="h-4 w-4" />;
      case 'qa':
        return <Bug className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'project_manager':
        return 'Lead project planning, team coordination, and resource management';
      case 'developer':
        return 'Write, test, and maintain code for software applications';
      case 'qa':
        return 'Ensure software quality through testing and quality assurance';
      default:
        return 'Member of the development team';
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
                <p className="text-sm text-gray-600">Personal Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Welcome, {user?.name}</span>
              </div>
              <Link href="/">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            Here's your personalized dashboard with all your account details and quick actions.
          </p>
        </div>

        {/* User Profile Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Profile
                </CardTitle>
                <CardDescription>
                  Complete overview of your account information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email Address</p>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Role</p>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getRoleColor(user?.role || '')} border`}>
                              <div className="flex items-center gap-1">
                                {getRoleIcon(user?.role || '')}
                                <span className="font-medium">{getRoleDisplayName(user?.role || '')}</span>
                              </div>
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {user?.githubUsername && (
                        <div className="flex items-center gap-3">
                          <Github className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">GitHub Profile</p>
                            <a
                              href={`https://github.com/${user.githubUsername}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:underline"
                            >
                              @{user.githubUsername}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Role Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Role Details
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Role Description</p>
                        <p className="text-sm text-gray-700">{getRoleDescription(user?.role || '')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Member Since</p>
                          <p className="font-medium">Today</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Star className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">0</p>
                      <p className="text-sm text-gray-600">Projects</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">0</p>
                      <p className="text-sm text-gray-600">Tasks</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">0h</p>
                      <p className="text-sm text-gray-600">Hours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Based on your role as a {getRoleDisplayName(user?.role || '')}, here are some actions you can take
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/developers">
                <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 cursor-pointer transform hover:-translate-y-2">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">Manage Team</CardTitle>
                    <CardDescription className="text-gray-600">
                      View and manage your development team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">
                      View Team
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/create-project">
                <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 cursor-pointer transform hover:-translate-y-2">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                      <FolderPlus className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">Create Project</CardTitle>
                    <CardDescription className="text-gray-600">
                      Start a new project with AI assistance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0">
                      Create Project
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/projects">
                <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 cursor-pointer transform hover:-translate-y-2">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">View Projects</CardTitle>
                    <CardDescription className="text-gray-600">
                      Browse and manage your projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0">
                      View Projects
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Role-specific Information */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Role-specific Features</CardTitle>
            <CardDescription>
              Features and capabilities available to you as a {getRoleDisplayName(user?.role || '')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {user?.role === 'project_manager' && (
                <>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team Management
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Create and manage development teams, assign roles, and track team performance
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Add and remove team members</li>
                      <li>• Assign roles and responsibilities</li>
                      <li>• Monitor team productivity</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <FolderPlus className="h-4 w-4" />
                      Project Oversight
                    </h4>
                    <p className="text-sm text-purple-700 mb-3">
                      Oversee project development, set milestones, and ensure timely delivery
                    </p>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Create and manage projects</li>
                      <li>• Set project timelines</li>
                      <li>• Track project progress</li>
                    </ul>
                  </div>
                </>
              )}
              {user?.role === 'developer' && (
                <>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Code Development
                    </h4>
                    <p className="text-sm text-green-700 mb-3">
                      Write, test, and maintain code with AI-powered assistance
                    </p>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Upload code for analysis</li>
                      <li>• Receive bug detection reports</li>
                      <li>• Access code optimization suggestions</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Bug className="h-4 w-4" />
                      Bug Tracking
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                      View assigned bugs and track their resolution status
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• View assigned bug reports</li>
                      <li>• Update bug status</li>
                      <li>• Collaborate on bug fixes</li>
                    </ul>
                  </div>
                </>
              )}
              {user?.role === 'qa' && (
                <>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                      <Bug className="h-4 w-4" />
                      Quality Assurance
                    </h4>
                    <p className="text-sm text-orange-700 mb-3">
                      Ensure software quality through comprehensive testing
                    </p>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Review bug reports</li>
                      <li>• Validate bug fixes</li>
                      <li>• Create test cases</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Testing Management
                    </h4>
                    <p className="text-sm text-red-700 mb-3">
                      Manage testing processes and ensure quality standards
                    </p>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Create test plans</li>
                      <li>• Execute test cases</li>
                      <li>• Report testing results</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
