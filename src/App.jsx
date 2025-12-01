import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download, Loader2, X } from 'lucide-react';

export default function App() {
  // CONFIGURATION: Ensure this matches your running Python backend URL
  const API_BASE_URL = "http://localhost:8000";

  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, success, error
  const [downloadUrl, setDownloadUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic validation for .docx
      if (!file.name.endsWith('.docx')) {
        setErrorMessage("Please select a .docx file.");
        setStatus('error');
        return;
      }
      setSelectedFile(file);
      setStatus('idle');
      setErrorMessage('');
      setDownloadUrl('');
    }
  };

  // Handle Drag and Drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.name.endsWith('.docx')) {
        setErrorMessage("Please select a .docx file.");
        setStatus('error');
        return;
      }
      setSelectedFile(file);
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Clear selection
  const clearFile = () => {
    setSelectedFile(null);
    setStatus('idle');
    setDownloadUrl('');
    setErrorMessage('');
  };

  // Submit file to backend
  const handleUpload = async () => {
    if (!selectedFile) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setStatus('processing'); // AI is running...
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || "Failed to process file");
      }

      // Success
      setDownloadUrl(`${API_BASE_URL}${data.download_url}`);
      setStatus('success');

    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "An error occurred connecting to the server.");
      setStatus('error');
    }
  };

  // Handle Download
  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <FileText className="w-8 h-8" />
            NeuroPhrase
          </h1>
          <p className="text-indigo-100 mt-2 text-sm">
            AI-Powered Document Humanizer
          </p>
        </div>

        <div className="p-8">
          
          {/* Upload Area */}
          {!selectedFile && (
            <div 
              className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-slate-600">Click to upload or drag & drop</p>
                <p className="text-xs text-slate-400 mt-1">.DOCX files only</p>
                <input 
                  type="file" 
                  accept=".docx" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
            </div>
          )}

          {/* Selected File State */}
          {selectedFile && status !== 'success' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-100 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-indigo-600 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
                {status !== 'uploading' && status !== 'processing' && (
                  <button onClick={clearFile} className="text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleUpload}
                disabled={status === 'uploading' || status === 'processing'}
                className={`w-full py-3 px-4 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2
                  ${(status === 'uploading' || status === 'processing') 
                    ? 'bg-indigo-300 cursor-not-allowed text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/30 active:scale-95'
                  }`}
              >
                {status === 'uploading' && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
                  </>
                )}
                {status === 'processing' && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Humanizing Text...
                  </>
                )}
                {status === 'idle' && (
                  <>
                    Humanize Document
                  </>
                )}
                {status === 'error' && (
                  <>
                    Retry Upload
                  </>
                )}
              </button>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Ready for Download!</h3>
                <p className="text-slate-500 mt-2 text-sm">Your document has been paraphrased successfully.</p>
              </div>
              
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Download className="w-5 h-5" />
                Download Result
              </button>

              <button 
                onClick={clearFile}
                className="text-sm text-slate-500 hover:text-indigo-600 underline decoration-dotted"
              >
                Process another file
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}