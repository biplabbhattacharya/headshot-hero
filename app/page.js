'use client';

import React, { useState } from 'react';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          file: file,
          preview: e.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateHeadshots = async () => {
    setIsProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock generated headshots using the uploaded image
    const mockResults = [
      { id: 1, url: uploadedImage.preview, style: "Professional" },
      { id: 2, url: uploadedImage.preview, style: "Corporate" },
      { id: 3, url: uploadedImage.preview, style: "Casual" },
      { id: 4, url: uploadedImage.preview, style: "Executive" }
    ];
    
    setProcessedImages(mockResults);
    setIsProcessing(false);
  };

  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetApp = () => {
    setUploadedImage(null);
    setProcessedImages([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 rounded-lg p-2">
                <span className="text-white text-xl">📷</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Headshot Hero</h1>
            </div>
            <div className="text-sm text-gray-600">
              Professional AI Headshots
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!uploadedImage && !processedImages.length && (
          // Upload Section
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transform Your Photos into Professional Headshots
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Upload your photo and get multiple professional headshot styles powered by AI
            </p>

            {/* Upload Area */}
            <div className="relative border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg p-8 transition-colors">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📤</span>
                </div>
                <div>
                  <p className="text-lg text-gray-600">
                    Choose your photo to get started
                  </p>
                  <label className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
                    <span className="mr-2">📤</span>
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Supports JPG, PNG, and other image formats
                </p>
              </div>
            </div>
          </div>
        )}

        {uploadedImage && !isProcessing && processedImages.length === 0 && (
          // Preview and Generate Section
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Photo Preview</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <img
                  src={uploadedImage.preview}
                  alt="Uploaded preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2">{uploadedImage.name}</p>
              </div>
              <div className="flex-1 space-y-4">
                <h4 className="font-semibold text-gray-900">What you'll get:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">4 professional headshot styles</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">High-resolution downloads</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">Professional lighting & backgrounds</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">Corporate and casual styles</span>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    onClick={generateHeadshots}
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>✨</span>
                    <span>Generate Professional Headshots</span>
                  </button>
                  <button
                    onClick={resetApp}
                    className="w-full mt-2 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Choose Different Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isProcessing && (
          // Processing Section
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Creating Your Professional Headshots</h3>
            <p className="text-gray-600 mb-4">Our AI is working its magic... This usually takes 30-60 seconds.</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>🕐</span>
              <span>Processing your photo...</span>
            </div>
          </div>
        )}

        {processedImages.length > 0 && (
          // Results Section
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your Professional Headshots Are Ready!
              </h3>
              <p className="text-gray-600">Click any image to download the high-resolution version</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {processedImages.map((image) => (
                <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative group">
                    <img
                      src={image.url}
                      alt={`${image.style} headshot`}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <button
                        onClick={() => downloadImage(image.url, `headshot-${image.style.toLowerCase()}.jpg`)}
                        className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200"
                      >
                        <span>⬇️</span>
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900">{image.style} Style</h4>
                    <p className="text-sm text-gray-600">Perfect for professional use</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-6">
              <button
                onClick={resetApp}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Create New Headshots
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Headshot Hero. Transform your photos with AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
