"use client";

import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useDarkMode } from "@/context/DarkModeContext";

interface SignaturePadProps {
  onSave?: (signature: string | null) => void;
  title?: string;
  required?: boolean;
}

function SignaturePad({ 
  onSave, 
  title = "Firma", 
  required = false 
}: SignaturePadProps) {
  const { darkmode } = useDarkMode();
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  
  // Handle component mount for client-side rendering
  useEffect(() => {
    setIsMounted(true);
    
    // Handle window resize to adjust canvas size
    const handleResize = () => {
      if (sigCanvas.current) {
        const canvas = sigCanvas.current.getCanvas();
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d")?.scale(ratio, ratio);
        sigCanvas.current.clear(); // Clear and re-render when resizing
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial sizing
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Handle signature changes
  const handleChange = () => {
    if (sigCanvas.current) {
      setIsEmpty(sigCanvas.current.isEmpty());
      
      // Call onSave with signature data if provided
      if (onSave) {
        const signatureData = sigCanvas.current.isEmpty() 
          ? null 
          : sigCanvas.current.toDataURL('image/png');
        onSave(signatureData);
      }
    }
  };
  
  // Clear the signature pad
  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsEmpty(true);
      if (onSave) onSave(null);
    }
  };
  
  if (!isMounted) {
    return <div className="h-40 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>;
  }
  
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-sm font-medium dark:text-gray-300 text-gray-700">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h5>
      </div>
      
      <div className={`
        border rounded-md overflow-hidden relative
        ${darkmode ? 'border-gray-600' : 'border-gray-300'}
      `}>
        {/* Signature Canvas */}
        <div className="h-40 w-full">
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className: `${darkmode ? 'bg-gray-800' : 'bg-white'} w-full h-full`,
            }}
            backgroundColor={darkmode ? 'rgba(31, 41, 55, 0)' : 'rgba(255, 255, 255, 0)'}
            penColor={darkmode ? '#e5e7eb' : '#1f2937'}
            onEnd={handleChange}
          />
        </div>
        
        {/* Guide line */}
        <div className={`absolute bottom-8 left-0 right-0 h-px ${darkmode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
        
        {/* Controls */}
        <div className={`
          flex justify-between items-center px-3 py-2 
          ${darkmode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-700'}
          border-t ${darkmode ? 'border-gray-600' : 'border-gray-200'}
        `}>
          <span className="text-xs italic">
            {isEmpty ? 'Dibuje su firma aquí' : 'Firma registrada'}
          </span>
          <button
            type="button"
            onClick={handleClear}
            disabled={isEmpty}
            className={`
              px-3 py-1 text-xs rounded-md transition-colors
              ${isEmpty 
                ? `${darkmode ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-400'} cursor-not-allowed` 
                : `${darkmode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
            `}
          >
            Borrar
          </button>
        </div>
      </div>
      
      {/* Touch device hint */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic block md:hidden">
        Use su dedo o stylus para firmar
      </p>
    </div>
  );
}

export default SignaturePad;