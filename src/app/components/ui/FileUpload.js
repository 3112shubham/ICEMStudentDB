// components/ui/FileUpload.js
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X } from 'lucide-react';
import { parseCSV } from '../../../lib/csvParser';

export default function CSVUpload({ onUpload, uploading }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        alert('Please upload a CSV file');
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
  if (!file) return;

  try {
    // ✅ Pass file directly — parseCSV will handle FileReader internally
    parseCSV(file, async (studentData) => {
      await onUpload(studentData);
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
    });
  } catch (error) {
    alert('Error parsing CSV file: ' + error.message);
  }
};


  const removeFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
      <h3 className="text-lg font-bold mb-4">Upload Student Data CSV</h3>
      
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          dragActive 
            ? 'border-cyan-400 bg-cyan-500/10' 
            : 'border-gray-400 hover:border-cyan-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
        />
        
        {!file ? (
          <div>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg mb-2">Drag & drop your CSV file here</p>
            <p className="text-gray-400 text-sm mb-4">or</p>
            <button
              onClick={() => inputRef.current?.click()}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-2xl transition-colors"
            >
              Browse Files
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between bg-white/5 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-cyan-400" />
              <div className="text-left">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>

      {file && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-2xl transition-colors flex items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Data
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-400">
        <p>CSV should contain columns: name, rollNumber, campus, gender, mobile, email, ssc, hsc, graduation, graduationCgpa, mbaSpecialization, aptitudePre, aptitudePost, aptitudeOverall, bizCommunication, genAI, linkedinBranding, resume, internal, external, academics, attendance, irpPhase1, irpPhase2, cldp, score, grade</p>
      </div>
    </div>
  );
}