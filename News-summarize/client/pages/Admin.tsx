import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  SettingsIcon, 
  UsersIcon, 
  BarChart3Icon, 
  KeyIcon,
  NewspaperIcon,
  ArrowLeftIcon,
  SaveIcon,
  RefreshCwIcon,
  TrashIcon,
  PlusIcon,
  DatabaseIcon,
  ServerIcon,
  CheckCircleIcon,
  XCircleIcon
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SystemStatus {
  openRouterApi: boolean;
  database: boolean;
  biasDetection: boolean;
  summarization: boolean;
}

interface UserStats {
  totalUsers: number;
  activeToday: number;
  totalAnalyses: number;
  averageBiasScore: number;
}

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [systemStatus] = useState<SystemStatus>({
    openRouterApi: true,
    database: true,
    biasDetection: true,
    summarization: false
  });
  const [userStats] = useState<UserStats>({
    totalUsers: 1247,
    activeToday: 89,
    totalAnalyses: 5632,
    averageBiasScore: 67
  });
  const [apiKey, setApiKey] = useState("sk-or-v1-9829d5c090...hidden");
  const [systemMessage, setSystemMessage] = useState("");

  // Redirect if not admin
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleSaveApiKey = () => {
    setSystemMessage("API key updated successfully");
    setTimeout(() => setSystemMessage(""), 3000);
  };

  const handleTestConnection = () => {
    setSystemMessage("Testing connection...");
    setTimeout(() => setSystemMessage("Connection test successful"), 2000);
  };

  const handleClearLogs = () => {
    setSystemMessage("System logs cleared");
    setTimeout(() => setSystemMessage(""), 3000);
  };

  const handleRestartService = (service: string) => {
    setSystemMessage(`Restarting ${service} service...`);
    setTimeout(() => setSystemMessage(`${service} service restarted successfully`), 2000);
  };

  const StatusIndicator = ({ status, label }: { status: boolean; label: string }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {status ? (
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
        ) : (
          <XCircleIcon className="h-5 w-5 text-red-500" />
        )}
        <Badge variant={status ? "default" : "destructive"}>
          {status ? "Online" : "Offline"}
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Back to App
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <SettingsIcon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
                  <p className="text-xs text-muted-foreground">System Management</p>
                </div>
              </div>
            </div>
            
            <Badge variant="secondary">Admin Panel</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: BarChart3Icon },
              { id: "api", label: "API Settings", icon: KeyIcon },
              { id: "users", label: "Users", icon: UsersIcon },
              { id: "system", label: "System", icon: ServerIcon }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>

          {systemMessage && (
            <Alert className="mb-6">
              <AlertDescription>{systemMessage}</AlertDescription>
            </Alert>
          )}

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Stats Cards */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                  <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.activeToday}</div>
                  <p className="text-xs text-muted-foreground">+5% from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
                  <NewspaperIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.totalAnalyses}</div>
                  <p className="text-xs text-muted-foreground">+23% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Bias Score</CardTitle>
                  <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.averageBiasScore}%</div>
                  <p className="text-xs text-muted-foreground">-2% improvement</p>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="md:col-span-2 lg:col-span-4">
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Monitor service health and connectivity</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  <StatusIndicator status={systemStatus.openRouterApi} label="OpenRouter API" />
                  <StatusIndicator status={systemStatus.database} label="Database" />
                  <StatusIndicator status={systemStatus.biasDetection} label="Bias Detection" />
                  <StatusIndicator status={systemStatus.summarization} label="Summarization" />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "api" && (
            <div className="grid gap-6 max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>OpenRouter API Configuration</CardTitle>
                  <CardDescription>Manage API keys and connection settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="apiKey"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter OpenRouter API key"
                      />
                      <Button onClick={handleSaveApiKey}>
                        <SaveIcon className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleTestConnection} variant="outline">
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Model Settings</CardTitle>
                  <CardDescription>Configure AI model parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">Default Model</Label>
                    <Select defaultValue="gpt-4-turbo">
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Max Tokens</Label>
                    <Input id="maxTokens" type="number" defaultValue="2048" />
                  </div>

                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button size="sm">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                      <Button size="sm" variant="outline">
                        Export Users
                      </Button>
                    </div>

                    {/* User List Table Placeholder */}
                    <div className="border rounded-lg p-8 text-center text-muted-foreground">
                      <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>User management interface would be implemented here</p>
                      <p className="text-sm">Features: View users, edit permissions, usage analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "system" && (
            <div className="grid gap-6 max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>System Operations</CardTitle>
                  <CardDescription>Manage system services and maintenance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={() => handleRestartService("Summarization")} variant="outline">
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Restart Summarization
                    </Button>
                    <Button onClick={() => handleRestartService("Bias Detection")} variant="outline">
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Restart Bias Detection
                    </Button>
                    <Button onClick={handleClearLogs} variant="outline">
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Clear Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Toggles</CardTitle>
                  <CardDescription>Enable or disable system features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">New User Registration</span>
                      <p className="text-sm text-muted-foreground">Allow new users to sign up</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Bias Detection</span>
                      <p className="text-sm text-muted-foreground">Enable AI bias analysis</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Source Comparison</span>
                      <p className="text-sm text-muted-foreground">Compare multiple news sources</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Database Operations</CardTitle>
                  <CardDescription>Manage database maintenance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline">
                      <DatabaseIcon className="h-4 w-4 mr-2" />
                      Backup Database
                    </Button>
                    <Button variant="outline">
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Optimize Tables
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
