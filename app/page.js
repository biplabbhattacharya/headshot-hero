'use client';

import React, { useState } from 'react';

function HeadshotHero() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [error, setError] = useState(null);

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          file: file,
          preview: e.target.result,
          name: file.name
        });
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateHeadshots = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', uploadedImage.file);

      console.log('Sending image to AI...');

      const response = await fetch('/api/generate-headshots', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate headshots');
      }

      console.log('AI generation successful!', result);
      setProcessedImages(result.images);
      
    } catch (error) {
      console.error('Generation failed:', error);
      setError(error.message || 'Failed to generate headshots. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const resetApp = () => {
    setUploadedImage(null);
    setProcessedImages([]);
    setIsProcessing(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header with Glassmorphism Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-3 shadow-lg">
                  <span className="text-white text-2xl">📸</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Headshot Hero
                </h1>
                <p className="text-sm text-gray-500 font-medium">Powered by AI</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full border border-indigo-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Professional AI Headshots</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Display with Modern Styling */}
        {error && (
          <div className="mb-8 relative">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-500 text-lg">⚠️</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Generation Failed</h3>
                  <p className="text-red-700 mb-4">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-all duration-200 shadow-sm"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!uploadedImage && !processedImages.length && (
          // Hero Upload Section with Modern Design
          <div className="text-center mb-12">
            <div className="mb-8">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Transform your selfies
                </span>
                <br />
                <span className="text-gray-800">to professional headshots</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Upload your selfie and get multiple professional headshot styles powered by cutting-edge AI technology
              </p>
            </div>

            {/* Modern Upload Area with Floating Effect */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-white rounded-3xl p-12 shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
                  <div className="space-y-6">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">📤</span>
                    </div>
                    <div>
                      <p className="text-xl text-gray-700 mb-6 font-medium">
                        Drop your selfie here or click to browse
                      </p>
                      <label className="relative inline-flex items-center">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                          <span className="mr-3">✨</span>
                          Choose Your Selfie
                        </div>
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e.target.files[0])}
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full inline-block">
                      Supports JPG, PNG, and other image formats (max 10MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {uploadedImage && !isProcessing && processedImages.length === 0 && (
          // Modern Preview Section
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800">Ready to Transform! 🚀</h3>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="relative group">
                      <img
                        src={uploadedImage.preview}
                        alt="Your selfie"
                        className="w-full h-80 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                        Your Selfie
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{uploadedImage.name}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold text-gray-800">What you'll get:</h4>
                    <div className="space-y-4">
                      {[
                        '4 professional headshot styles',
                        'AI-enhanced facial features',
                        'High-resolution downloads',
                        'Professional lighting & backgrounds'
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-6 space-y-4">
                      <button
                        onClick={generateHeadshots}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <span className="mr-3">✨</span>
                        Generate Professional Headshots
                      </button>
                      <button
                        onClick={resetApp}
                        className="w-full text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                      >
                        Choose Different Photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isProcessing && (
          // Modern Processing Section
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto">
                  <div className="w-full h-full border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Creating Your Professional Headshots</h3>
              <p className="text-gray-600 mb-6 text-lg">Our AI is analyzing your photo and generating stunning professional headshots...</p>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 inline-flex items-center space-x-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium">Processing with advanced AI (usually 1-2 minutes)</span>
              </div>
            </div>
          </div>
        )}

        {processedImages.length > 0 && (
          // Modern Results Section
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Your Professional Headshots Are Ready! 🎉
                </span>
              </h3>
              <p className="text-xl text-gray-600">Click any image to download the high-resolution version</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {processedImages.map((image) => (
                <div key={image.id} className="group">
                  <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="relative overflow-hidden">
                      <img
                        src={image.url}
                        alt={`${image.style} headshot`}
                        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => downloadImage(image.url, `headshot-${image.style.toLowerCase()}.jpg`)}
                          className="bg-white text-gray-900 px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                          <span>⬇️</span>
                          <span>Download HD</span>
                        </button>
                      </div>
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-800">
                        {image.style}
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{image.style} Style</h4>
                      <p className="text-gray-600">AI-generated professional headshot ready for LinkedIn, resumes, and more</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-8">
              <button
                onClick={resetApp}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Create New Headshots
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modern Footer with Your Credit */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <span>🚀 Powered by Advanced AI</span>
              <span>⚡ Lightning Fast Processing</span>
              <span>🔒 Secure & Private</span>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-600 mb-2">
                &copy; 2025 Headshot Hero. Transform your selfies with AI.
              </p>
              <p className="text-sm text-gray-500">
                Created by{' '}
                <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Biplab Bhattacharya
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return <HeadshotHero />;
}
