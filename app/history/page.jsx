'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Eye, Trash2, Video, Clock, Globe, Play, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Loading from '../loading';

export default function HistoryPage() {
  const router = useRouter();
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummaries();
  }, []);

  const loadSummaries = () => {
    try {
      const savedSummaries = localStorage.getItem('summaryHistory');
      if (savedSummaries) {
        const parsedSummaries = JSON.parse(savedSummaries);
        // Sort by timestamp in descending order (newest first)
        const sortedSummaries = parsedSummaries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setSummaries(sortedSummaries);
      }
    } catch (error) {
      console.error('Error loading summaries:', error);
      toast.error('Failed to load summary history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSummary = (summary) => {
    // Navigate to summary page with the selected summary data
    const params = new URLSearchParams({
      // summary: encodeURIComponent(summary.summary),
      url: summary.url || '',
      language: summary.languageName || 'english',
      fromGeneration: 'true'
    });
    
    router.push(`/summary?${params.toString()}`);
  };

  const handleDeleteSummary = (indexToDelete) => {
    try {
      const updatedSummaries = summaries.filter((_, index) => index !== indexToDelete);
      setSummaries(updatedSummaries);
      
      // Update localStorage
      localStorage.setItem('summaryHistory', JSON.stringify(updatedSummaries));
      
      toast.success('Summary deleted successfully!');
    } catch (error) {
      console.error('Error deleting summary:', error);
      toast.error('Failed to delete summary');
    }
  };

  const handleBackHome = () => {
    router.push('/');
  };

  const handleOpenVideo = (url) => {
    if (url && url !== 'N/A') {
      window.open(url, '_blank', 'noopener,noreferrer');
      toast.success('Opening video in new tab!');
    } else {
      toast.error('Video URL not available');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getVideoIcon = (url) => {
    if (!url || url === 'N/A') return Video;
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return Play;
    } else if (url.includes('vimeo.com')) {
      return Video;
    } else {
      return Video;
    }
  };

  const getVideoIconColor = (url) => {
    if (!url || url === 'N/A') return 'from-gray-500 to-gray-600';
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'from-red-500 to-red-600';
    } else if (url.includes('vimeo.com')) {
      return 'from-blue-500 to-blue-600';
    } else {
      return 'from-purple-500 to-purple-600';
    }
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-ping duration-[3000ms]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={handleBackHome}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-center animate-in fade-in duration-700">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-2xl mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Summary History
            </h1>
            <p className="text-gray-300 text-lg">
              Your AI-generated video summaries ({summaries.length} total)
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="max-w-6xl mx-auto">
          {summaries.length === 0 ? (
            <div className="text-center py-16 animate-in fade-in duration-700">
              <div className="bg-black/20 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/10">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-gray-300">No Summaries Yet</h3>
                <p className="text-gray-400 mb-6">
                  Start analyzing videos to build your summary history!
                </p>
                <Button
                  onClick={handleBackHome}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Analyze Your First Video
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 animate-in fade-in duration-700">
              {summaries.map((summary, index) => {
                const VideoIconComponent = getVideoIcon(summary.url);
                const videoIconColor = getVideoIconColor(summary.url);
                const hasValidUrl = summary.url && summary.url !== 'N/A';
                
                return (
                  <div
                    key={index}
                    className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-3xl group"
                  >
                    <div className="flex items-start justify-between gap-6">
                      {/* Video Icon - Left Side */}
                      <div className="flex-shrink-0">
                        <div
                          className={`relative group/video cursor-pointer transition-all duration-300 ${
                            hasValidUrl ? 'hover:scale-110' : 'cursor-not-allowed opacity-60'
                          }`}
                          onClick={() => hasValidUrl && handleOpenVideo(summary.url)}
                          title={hasValidUrl ? 'Click to open video' : 'Video URL not available'}
                        >
                          <div className={`w-16 h-16 bg-gradient-to-r ${videoIconColor} rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 ${
                            hasValidUrl ? 'group-hover/video:shadow-2xl group-hover/video:shadow-red-500/25' : ''
                          }`}>
                            <VideoIconComponent className="w-8 h-8 text-white" />
                            {hasValidUrl && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
                                <ExternalLink className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                          
                          {/* Pulsing Ring Effect */}
                          {hasValidUrl && (
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/30 opacity-0 group-hover/video:opacity-100 animate-ping pointer-events-none"></div>
                          )}
                          
                          {/* Video Status Indicator */}
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                            hasValidUrl ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-300'
                          }`}>
                            {hasValidUrl ? '✓' : '✕'}
                          </div>
                        </div>
                      </div>

                      {/* Content - Middle */}
                      <div className="flex-1 min-w-0">
                        {/* Header Info */}
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            {formatTimestamp(summary.timestamp)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Globe className="w-4 h-4" />
                            <span className="flex items-center gap-1">
                              {summary.languageName || "English"}
                            </span>
                          </div>
                        </div>

                        {/* URL section removed - no longer displaying URL on cards */}

                        {/* Summary Preview */}
                        <div className="text-gray-200 leading-relaxed">
                          <p className="line-clamp-3">
                            {truncateText(summary.summary.replace(/\*\*(.*?)\*\*/g, '$1'))}
                          </p>
                        </div>
                      </div>

                      {/* Actions - Right Side */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          onClick={() => handleViewSummary(summary)}
                          className="bg-green-600 hover:bg-green-700 p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 group-hover:shadow-xl"
                          title="View full summary"
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              className="bg-red-600 hover:bg-red-700 p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 group-hover:shadow-xl"
                              title="Delete summary"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-900 border-gray-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white flex items-center gap-2">
                                <Trash2 className="w-5 h-5 text-red-500" />
                                Delete Summary
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-300">
                                Are you sure you want to delete this summary? This action cannot be undone and the summary will be permanently removed from your history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteSummary(index)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}