'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Globe,
  History,
  MapPin,
} from 'lucide-react';
import { getInfo } from '@/actions/info';
import { toast } from 'sonner';
import useFetch from './hooks/use-fetch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { indianLanguagesData } from '@/data/lang';
import { countryLanguage } from '@/data/contlang';

export default function HomePage() {
  const [languageType, setLanguageType] = useState('country'); // 'country' or 'indian'
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to 'en' for English
  const [input, setInput] = useState(''); // This should only be for URL input
  const router = useRouter();

  const {
    loading: generating,
    fn: generateSummaryFn,
    data: generatedSummary,
  } = useFetch(getInfo);

  // Get selected language name for display and API calls
  const getSelectedLanguageName = () => {
    const options = getCurrentLanguageOptions();
    const lang = options.find(l => l.code === selectedLanguage);
   
    return lang ? lang.name : 'English';
  };

  // Validate and sanitize language code
  const sanitizeLanguageCode = (code) => {
    if (!code || typeof code !== 'string') return 'en';
    // Ensure language code is reasonable length and contains only valid characters
    return code.slice(0, 10).replace(/[^a-zA-Z0-9-_]/g, '');
  };

  const handleClick = async () => {
    try {
      // Validate input
      if (!input.trim()) {
        toast.error("Please enter a valid URL");
        return;
      }

      // Get and validate the language
      const languageName = getSelectedLanguageName();
      console.log("Language1:", languageName);
      const sanitizedLanguageCode = sanitizeLanguageCode(selectedLanguage);
      
      console.log("Processing with:", {
        url: input,
        languageName,
        languageCode: sanitizedLanguageCode
      });
      
      await generateSummaryFn(input, languageName);
      
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate summary");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleClick();
    }
  };

  // Function to save summary to history
  const saveToHistory = (summaryData) => {
    try {
      // Get existing history
      const existingHistory = localStorage.getItem('summaryHistory');
      let historyArray = [];
      
      if (existingHistory) {
        historyArray = JSON.parse(existingHistory);
      }
      
      // Add new summary to the beginning of the array
      historyArray.unshift(summaryData);
      
      // Limit history to last 50 summaries to prevent localStorage from getting too large
      if (historyArray.length > 50) {
        historyArray = historyArray.slice(0, 50);
      }
      
      // Save back to localStorage
      localStorage.setItem('summaryHistory', JSON.stringify(historyArray));
      
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  };

  const handleGoToHistory = () => {
    router.push('/history');
  };

  // Handle language type change with proper reset
  const handleLanguageTypeChange = (type) => {
    console.log("Changing language type to:", type);
    setLanguageType(type);
    setSelectedLanguage('en'); // Reset to English ('en') when switching types
  };

  // Get current language options based on selected type
  const getCurrentLanguageOptions = () => {
    let options;
    
    try {
      options = languageType === 'indian' ? indianLanguagesData : countryLanguage;
      
      // Ensure options is an array
      if (!Array.isArray(options)) {
        console.warn("Language options is not an array:", options);
        options = [];
      }
      
      // Validate each option has required properties
      options = options.filter(lang => 
        lang && 
        typeof lang === 'object' && 
        lang.code && 
        lang.name &&
        typeof lang.code === 'string' &&
        typeof lang.name === 'string'
      );
      
      // Add English as the default option if it's not already in the list
      const hasEnglish = options.some(lang => lang.code === 'en');
      if (!hasEnglish) {
        return [{ code: 'en', name: 'English' }, ...options];
      }
      
      return options;
    } catch (error) {
      console.error("Error getting language options:", error);
      // Fallback to basic English option
      return [{ code: 'en', name: 'English' }];
    }
  };

  useEffect(() => {
    if (generatedSummary) {
      toast.success('Summary generated successfully!');
      console.log("Generated summary:", generatedSummary);
      
      const sanitizedLanguageCode = sanitizeLanguageCode(selectedLanguage);
      
      // Prepare summary data with FULL content
      const summaryData = {
        summary: generatedSummary.summary || generatedSummary,
        url: input,
        language: sanitizedLanguageCode,
        languageName: getSelectedLanguageName(),
        timestamp: new Date().toISOString()
      };
      console.log(" language code:", typeof(summaryData.languageName));
      
      console.log("Full summary data to save:", summaryData);
      
      try {
        // Save FULL summary to localStorage as backup (for current summary)
        localStorage.setItem('latestSummary', JSON.stringify(summaryData));
        
        // Save FULL summary to history
        saveToHistory(summaryData);
        
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
      
      // Navigate to summary page WITHOUT passing summary in URL
      // Instead, rely on localStorage for full content
      try {
        const params = new URLSearchParams({
          url: input.substring(0, 200), // Only pass URL for reference
          languageVal: getSelectedLanguageName(),
          fromGeneration: 'true' // Flag to indicate this is a fresh generation
        });
        
        console.log("Navigating with minimal params:", params.toString());
        router.push(`/summary?${params.toString()}`);
        
      } catch (urlError) {
        console.error("URL generation error:", urlError);
        // Fallback: navigate without params, rely on localStorage
        router.push('/summary');
      }
    }
  }, [generatedSummary, input, selectedLanguage, router]);

  // Validate current language selection on language type change
  useEffect(() => {
    const currentOptions = getCurrentLanguageOptions();
    const isValidSelection = currentOptions.some(lang => lang.code === selectedLanguage);
    
    if (!isValidSelection) {
      console.log("Invalid language selection, resetting to English");
      setSelectedLanguage('en');
    }
  }, [languageType]);

  
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
        {[...Array(20)].map((_, i) => (
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
      
      <div className="relative z-10 p-6 flex flex-col items-center justify-center min-h-screen">

      <div className="fixed top-6 right-6 z-50">
          <Button
            onClick={handleGoToHistory}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 rounded-2xl px-6 py-3 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25 active:scale-95 group"
          >
            <div className="flex items-center space-x-2">
              <div className="relative">
                <History className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <span className="font-semibold text-sm">History</span>
            </div>
          </Button>
        </div>
        

        {/* Main Content */}
        <div className="text-center mb-12 animate-in fade-in duration-700">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl mb-6 animate-bounce">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-in slide-in-from-bottom duration-700 delay-200">
            AI Video Genius
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom duration-700 delay-400">
            Transform any video URL into intelligent insights with our advanced AI analysis
          </p>
          <div className="flex items-center justify-center mt-6 space-x-2 animate-in fade-in duration-700 delay-600">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-black/20 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-3xl border border-white/10 animate-in fade-in slide-in-from-bottom duration-700 delay-800">
          
          {/* Language Type Selection */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-200 mb-3 flex items-center">
              <span className="mr-2 text-xl">🌏</span>
              Choose Language Region
            </label>
            <div className="flex space-x-4 mb-4">
              <Button
                variant={languageType === 'country' ? 'default' : 'ghost'}
                className={`flex-1 h-12 rounded-xl transition-all duration-300 ${
                  languageType === 'country' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
                onClick={() => handleLanguageTypeChange('country')}
              >
                <Globe className="h-4 w-4 mr-2" />
                Country Languages
              </Button>
              <Button
                variant={languageType === 'indian' ? 'default' : 'ghost'}
                className={`flex-1 h-12 rounded-xl transition-all duration-300 ${
                  languageType === 'indian' 
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
                onClick={() => handleLanguageTypeChange('indian')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Indian Languages
              </Button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-200 mb-3 flex items-center">
              <span className="mr-2 text-xl">🌐</span>
              Select Output Language
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({languageType === 'indian' ? 'Indian' : 'Global'} Languages)
              </span>
            </label>
            <Select 
              value={selectedLanguage} 
              onValueChange={(value) => {
                console.log("Language selection changed to:", value);
                setSelectedLanguage(value);
              }}
            >
              <SelectTrigger className="w-full bg-white/5 backdrop-blur-md border-white/20 text-white rounded-2xl h-14 text-lg hover:bg-white/10 transition-all duration-300">
                <SelectValue placeholder="Select output language">
                  {getSelectedLanguageName()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-transparent backdrop-blur-xl border-white/20 rounded-xl max-h-60 overflow-y-auto">
                {getCurrentLanguageOptions().map((lang) => (
                  <SelectItem 
                    key={`${languageType}-${lang.code}`} 
                    value={lang.code} 
                    className="text-white hover:bg-white/10 rounded-lg text-lg py-3"
                  >
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* URL Input */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <Input
                type="url"
                placeholder="Paste your video URL here (YouTube, Vimeo, etc.)"
                className="w-full h-16 pl-14 pr-6 text-lg bg-white/5 backdrop-blur-md text-white border-white/20 rounded-2xl placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 hover:bg-white/10"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            
            <Button
              disabled={!input.trim() || generating}
              className="h-16 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 font-semibold text-lg"
              onClick={handleClick}
            >
              {generating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>✨</span>
                  <span>Analyze</span>
                </div>
              )}
            </Button>
          </div>
          
          {!input.trim() && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10">
              <p className="text-gray-300 text-center flex items-center justify-center">
                <span className="mr-2 text-xl">🎬</span>
                Ready to unlock insights from your video? Just paste the URL above!
              </p>
            </div>
          )}

          {input.trim() && !generating && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl border border-green-400/30">
              <p className="text-green-300 text-center">
                <span className="flex items-center justify-center mb-2">
                  <span className="mr-2 text-xl">🚀</span>
                  URL detected! Click "Analyze" to get your AI-powered summary.
                </span>
                <span className="block text-green-200 text-sm">
                  <span className="mr-1">📝</span>
                  Summary will be in: <strong>{getSelectedLanguageName()}</strong>
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}