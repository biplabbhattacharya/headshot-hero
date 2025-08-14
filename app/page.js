'use client';

import React, { useState } from 'react';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    alert('Processing complete! (This is just a test)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* Header */}
      <header className="bg-white shadow-sm border-b rounded-lg mb-8 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Headshot Hero</h1>
        <p className="text-gray-600">Professional AI Headshots</p>
      </header>

      <main className="max-w-4xl mx-auto">
        {!uploadedImage ? (
          // Upload Section
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Transform Your Photos into Professional Headshots
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Upload your photo and get multiple professional headshot styles powered by AI
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>
                <div>
                  <p className="text-lg text-gray-600 mb-4">
                    Choose your photo to get started
                  </p>
                  <label className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
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
        ) : (
          // Preview Section
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Photo Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={uploadedImage.preview}
                  alt="Uploaded preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2">{uploadedImage.name}</p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Ready to generate!</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">4 professional headshot styles</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">High-resolution downloads</span>
                  </div>
                </div>
                <div className="pt-4 space-y-2">
                  <button
                    onClick={generateHeadshots}
                    disabled={isProcessing}
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                  >
                    {isProcessing ? 'Processing...' : 'Generate Professional Headshots'}
                  </button>
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="w-full text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Choose Different Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16 rounded-lg p-6">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 Headshot Hero. Transform your photos with AI.</p>
        </div>
      </footer>
    </div>
  );
}
