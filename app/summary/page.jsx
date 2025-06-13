'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  History, 
  Video, 
  Copy, 
  Check, 
  Menu,
  Home,
  Share2,
  Download,
  ExternalLink
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Loading from '../loading';

export default function SummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

useEffect(() => {
    // Always get summary data from localStorage, ignore search params for summary content
    const savedSummary = localStorage.getItem('latestSummary');
    
    if (savedSummary) {
      try {
        const parsedSummary = JSON.parse(savedSummary);
        setSummaryData(parsedSummary);
        console.log('Loaded summary from localStorage:', parsedSummary);
      } catch (error) {
        console.error('Error parsing saved summary from localStorage:', error);
        toast.error('Failed to load summary data');
        router.push('/');
      }
    } else {
      console.log('No summary found in localStorage');
      toast.error('No summary data found');
      router.push('/');
    }
    
    setLoading(false);
  }, [router]);

  const handleBackHome = () => {
    router.push('/');
  };

  const handleGoToHistory = () => {
    router.push('/history');
  };

  const handleCopySummary = async () => {
    if (!summaryData?.summary) return;
    
    try {
      // Remove HTML formatting for clean text copy
      const cleanText = summaryData.summary.replace(/\*\*(.*?)\*\*/g, '$1');
      await navigator.clipboard.writeText(cleanText);
      setCopied(true);
      toast.success('Summary copied to clipboard!');
      
      // Reset copy state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy summary');
    }
  };

  const handleShare = async () => {
    if (navigator.share && summaryData) {
      try {
        await navigator.share({
          title: 'AI Video Summary',
          text: summaryData.summary.replace(/\*\*(.*?)\*\*/g, '$1'),
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copy URL
        handleCopyUrl();
      }
    } else {
      handleCopyUrl();
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Summary URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleDownload = () => {
    if (!summaryData) return;
    
    const content = `AI Video Summary
Generated on: ${new Date(summaryData.timestamp || new Date()).toLocaleString()}
Video URL: ${summaryData.url}
Language: ${summaryData.language}

Summary:
${summaryData.summary.replace(/\*\*(.*?)\*\*/g, '$1')}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-summary-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Summary downloaded!');
  };

  const openVideoUrl = () => {
    if (summaryData.url && summaryData.url !== 'N/A') {
      window.open(summaryData.url, '_blank');
    } else {
      toast.error('No video URL available');
    }
  };

  if (loading) {
    return <Loading/>;
  }

  if (!summaryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex items-center justify-center px-4 sm:px-0">
        <div className="text-center animate-in fade-in duration-700 max-w-md sm:max-w-none">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl sm:rounded-3xl shadow-2xl mb-4 sm:mb-6">
              <Video className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
            No Summary Found
          </h2>
          <p className="text-gray-300 mb-6 text-base sm:text-lg px-4 sm:px-0">
            The summary you're looking for doesn't exist or has expired.
          </p>
          <Button 
            onClick={handleBackHome} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-pink-500/10 rounded-full blur-3xl animate-ping duration-[3000ms]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(window.innerWidth < 640 ? 8 : 15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 p-4 sm:p-6">

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-6 sm:mb-8 animate-in fade-in duration-700">
            <div className="mb-4 sm:mb-6">
              <div 
                className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl sm:rounded-3xl shadow-2xl mb-4 sm:mb-6 cursor-pointer hover:scale-110 hover:shadow-3xl transition-all duration-300 group animate-bounce"
                onClick={openVideoUrl}
                title="Click to open original video"
              >
                <Video className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-6xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-in slide-in-from-bottom duration-700 delay-200 leading-tight px-2 sm:px-0">
              AI Summary Ready
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom duration-700 delay-400 px-4 sm:px-0">
              Your intelligent video analysis is complete
            </p>
            
            {/* Summary Info Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center mt-4 sm:mt-6 space-y-3 sm:space-y-0 sm:space-x-6 animate-in fade-in duration-700 delay-600 px-4 sm:px-0">
              <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-md px-3 py-2 sm:px-4 rounded-full border border-white/10 text-sm sm:text-base">
                <span className="text-xl sm:text-2xl">🌐</span>
                <span className="text-gray-300 font-medium">{summaryData.languageName}</span>
              </div>
              {summaryData.url && summaryData.url !== 'N/A' && (
                <Button
                  onClick={openVideoUrl}
                  className="flex items-center space-x-2 bg-black/20 backdrop-blur-md px-3 py-2 sm:px-4 rounded-full border border-white/10 hover:bg-black/30 transition-all duration-300 group text-sm sm:text-base h-auto min-h-0"
                >
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300 group-hover:text-white transition-colors" />
                  <span className="text-gray-300 group-hover:text-white font-medium transition-colors">Open Video</span>
                </Button>
              )}
              {summaryData.timestamp && (
                <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-md px-3 py-2 sm:px-4 rounded-full border border-white/10 text-sm sm:text-base">
                  <span className="text-xl sm:text-2xl">⏰</span>
                  <span className="text-gray-300 font-medium">
                    {new Date(summaryData.timestamp).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Summary Content */}
          <div className="bg-black/20 backdrop-blur-xl p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 mb-6 sm:mb-8 animate-in slide-in-from-bottom duration-700 relative">
            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                <span className="mr-2 sm:mr-3 text-2xl sm:text-3xl">✨</span>
                Summary Analysis
              </h2>
              <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                <Button
                  onClick={handleCopySummary}
                  className="bg-transparent hover:bg-white/10 text-white p-2 sm:p-3 h-auto min-w-0 rounded-lg sm:rounded-xl transition-all duration-300 group border border-white/20 flex-1 sm:flex-none"
                  title="Copy summary to clipboard"
                >
                  {copied ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 transition-all duration-300 mx-auto" />
                  ) : (
                    <Copy className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300 mx-auto" />
                  )}
                </Button>
                <Button
                  onClick={handleShare}
                  className="bg-transparent hover:bg-white/10 text-white p-2 sm:p-3 h-auto min-w-0 rounded-lg sm:rounded-xl transition-all duration-300 group border border-white/20 flex-1 sm:flex-none"
                  title="Share summary"
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300 mx-auto" />
                </Button>
                <Button
                  onClick={handleDownload}
                  className="bg-transparent hover:bg-white/10 text-white p-2 sm:p-3 h-auto min-w-0 rounded-lg sm:rounded-xl transition-all duration-300 group border border-white/20 flex-1 sm:flex-none"
                  title="Download summary"
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300 mx-auto" />
                </Button>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="bg-gray-900/50 p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300">
                <div 
                  className="text-gray-100 leading-relaxed whitespace-pre-wrap text-sm sm:text-lg"
                  dangerouslySetInnerHTML={{
                    __html: summaryData.summary.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-300 font-semibold">$1</strong>')
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center animate-in fade-in duration-700 delay-200 px-4 sm:px-0">
            {/* Back to Home Button */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden">
                <div className="absolute inset-0 border-2 border-transparent rounded-2xl sm:rounded-3xl">
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl animate-border-line bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <Button
                onClick={handleBackHome}
                className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-0 w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 transition-transform group-hover:-translate-x-1" />
                <span className="relative z-10">Analyze Another</span>
              </Button>
            </div>

            {/* View History Button */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden">
                <div className="absolute inset-0 border-2 border-transparent rounded-2xl sm:rounded-3xl">
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl animate-border-line-reverse bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <Button
                onClick={handleGoToHistory}
                className="relative bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-gray-600 group-hover:border-transparent w-full sm:w-auto"
              >
                <History className="h-4 w-4 sm:h-5 sm:w-5 mr-2 transition-transform group-hover:rotate-12" />
                <span className="relative z-10">View History</span>
              </Button>
            </div>
          </div>

          {/* Custom CSS for animations */}
          <style jsx>{`
            @keyframes border-line {
              0% {
                clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
              }
              25% {
                clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%);
              }
              50% {
                clip-path: polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%);
              }
              75% {
                clip-path: polygon(100% 100%, 100% 100%, 0% 100%, 0% 100%);
              }
              100% {
                clip-path: polygon(0% 100%, 0% 100%, 0% 0%, 0% 0%);
              }
            }
            
            @keyframes border-line-reverse {
              0% {
                clip-path: polygon(100% 100%, 100% 100%, 100% 0%, 100% 0%);
              }
              25% {
                clip-path: polygon(100% 100%, 0% 100%, 0% 100%, 100% 100%);
              }
              50% {
                clip-path: polygon(0% 100%, 0% 100%, 0% 0%, 0% 0%);
              }
              75% {
                clip-path: polygon(0% 0%, 0% 0%, 100% 0%, 100% 0%);
              }
              100% {
                clip-path: polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%);
              }
            }
            
            .animate-border-line {
              animation: border-line 2s linear infinite;
            }
            
            .animate-border-line-reverse {
              animation: border-line-reverse 2s linear infinite;
            }
            
            @media (max-width: 640px) {
              .animate-border-line,
              .animate-border-line-reverse {
                animation: none;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}