import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  NewspaperIcon,
  LinkIcon,
  FileTextIcon,
  SmileIcon,
  MehIcon,
  FrownIcon,
  ScaleIcon,
  CopyIcon,
  DownloadIcon,
  UserIcon,
  LogOutIcon,
  SettingsIcon
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AnalysisResult {
  summaries: {
    neutral: string;
    facts: string;
    child: string;
  };
  bias: {
    sentiment: "positive" | "negative" | "neutral";
    score: number;
    factors: string[];
  };
}

export default function Index() {
  const { user, logout } = useAuth();
  const [inputType, setInputType] = useState<"url" | "text">("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [activeTone, setActiveTone] = useState<"neutral" | "facts" | "child">("neutral");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");
    const content = inputType === "url" ? urlInput : textInput;

    if (!content.trim()) {
      setError("Please provide a URL or text to analyze");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          type: inputType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze content");
      }

      const result = await response.json();
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze content. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.summaries[activeTone]);
    }
  };

  const handleDownload = () => {
    if (result) {
      const content = `Summary (${activeTone}):\n${result.summaries[activeTone]}\n\nBias Analysis:\nSentiment: ${result.bias.sentiment}\nScore: ${result.bias.score}%\nFactors: ${result.bias.factors.join(', ')}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'news-analysis.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <SmileIcon className="h-5 w-5 text-green-500" />;
      case "negative": return <FrownIcon className="h-5 w-5 text-red-500" />;
      default: return <MehIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-green-100 text-green-800 border-green-200";
      case "negative": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary rounded-lg">
                <NewspaperIcon className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">News Summarizer & Bias Detector</CardTitle>
            <CardDescription>
              AI-powered news analysis tool for unbiased reporting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please sign in to access the platform
            </p>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      {/* Header */}
      <header className="border-b border-white/20 bg-white/90 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <NewspaperIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">News Summarizer</h1>
                <p className="text-xs text-slate-500 font-medium">& Bias Detector</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user.isAdmin && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Admin
                  </Link>
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2">
                    <LogOutIcon className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Input Section */}
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <FileTextIcon className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                  Analyze News Content
                </span>
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Paste a news URL or article text to get AI-powered summary and bias analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Type Toggle */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                <Button
                  variant={inputType === "url" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setInputType("url")}
                  className={`flex items-center gap-2 flex-1 transition-all duration-200 ${
                    inputType === "url"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : "hover:bg-white/50"
                  }`}
                >
                  <LinkIcon className="h-4 w-4" />
                  URL
                </Button>
                <Button
                  variant={inputType === "text" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setInputType("text")}
                  className={`flex items-center gap-2 flex-1 transition-all duration-200 ${
                    inputType === "text"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : "hover:bg-white/50"
                  }`}
                >
                  <FileTextIcon className="h-4 w-4" />
                  Text
                </Button>
              </div>

              {/* Input Field */}
              {inputType === "url" ? (
                <div className="space-y-2">
                  <Label htmlFor="url">News Article URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com/news-article"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="text">News Article Text</Label>
                  <Textarea
                    id="text"
                    placeholder="Paste the full article text here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={6}
                  />
                </div>
              )}


              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {isAnalyzing && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                {isAnalyzing ? "Analyzing..." : "✨ Summarize & Analyze"}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Multi-Tone Summary Card */}
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm lg:col-span-2 hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                        <FileTextIcon className="h-5 w-5 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold">
                        AI Summary
                      </span>
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy} className="hover:bg-emerald-50 hover:border-emerald-300 transition-colors">
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload} className="hover:bg-emerald-50 hover:border-emerald-300 transition-colors">
                        <DownloadIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Switch between different summary styles instantly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tone Tabs */}
                  <div className="flex gap-1 p-1.5 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTone("neutral")}
                      className={`flex-1 transition-all duration-300 ${
                        activeTone === "neutral"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105"
                          : "hover:bg-white/70"
                      }`}
                    >
                      🎯 Neutral
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTone("facts")}
                      className={`flex-1 transition-all duration-300 ${
                        activeTone === "facts"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105"
                          : "hover:bg-white/70"
                      }`}
                    >
                      📊 Facts Only
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTone("child")}
                      className={`flex-1 transition-all duration-300 ${
                        activeTone === "child"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105"
                          : "hover:bg-white/70"
                      }`}
                    >
                      🎈 Simple
                    </Button>
                  </div>

                  {/* Summary Content */}
                  <div className="min-h-[200px] p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200/50 shadow-inner">
                    <p className="text-sm leading-relaxed text-slate-700 font-medium">
                      {result.summaries[activeTone]}
                    </p>
                  </div>

                  {/* Tone Description */}
                  <div className="text-xs text-muted-foreground">
                    {activeTone === "neutral" && "Balanced overview without bias"}
                    {activeTone === "facts" && "Key facts and data points only"}
                    {activeTone === "child" && "Simplified explanation for easy understanding"}
                  </div>
                </CardContent>
              </Card>

              {/* Bias Analysis Card */}
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                      <ScaleIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                      Bias Analysis
                    </span>
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    AI-powered sentiment detection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sentiment</span>
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(result.bias.sentiment)}
                      <Badge variant="outline" className={getSentimentColor(result.bias.sentiment)}>
                        {result.bias.sentiment}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Bias Score</span>
                      <span className="text-sm text-muted-foreground">{result.bias.score}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
                        style={{ width: `${result.bias.score}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium mb-2 block">Key Factors</span>
                    <div className="space-y-1">
                      {result.bias.factors.map((factor, index) => (
                        <Badge key={index} variant="secondary" className="text-xs block">
                          {factor}
                        </Badge>
                      ))}
                    </div>
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
