import React, { useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Use CDN for worker to avoid build system issues in this environment
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  signedUrl: string;
  originalName: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ isOpen, onClose, signedUrl, originalName }) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && signedUrl) {
      setLoading(true);
      setError(null);
      setPageNum(1);

      const loadingTask = pdfjsLib.getDocument(signedUrl);
      loadingTask.promise
        .then((doc) => {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading PDF:", err);
          setError("Failed to load PDF document.");
          setLoading(false);
        });
    }
    
    // Cleanup
    return () => {
      setPdfDoc(null);
    };
  }, [isOpen, signedUrl]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d');

        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;
        }
      } catch (err) {
        console.error("Error rendering page:", err);
      }
    };

    renderPage();
  }, [pdfDoc, pageNum, scale]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-panel-dark w-[90%] h-[90%] max-w-6xl rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
        
        {/* Header / Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-panel-dark z-10">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate max-w-md" title={originalName}>
              {originalName}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {pageNum} of {numPages}
            </span>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mr-4">
                <button 
                  onClick={() => setPageNum(p => Math.max(1, p - 1))}
                  disabled={pageNum <= 1}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                <button 
                  onClick={() => setPageNum(p => Math.min(numPages, p + 1))}
                  disabled={pageNum >= numPages}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
             </div>

             <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mr-4">
                <button 
                  onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <ZoomOut size={18} />
                </button>
                <span className="text-xs w-12 text-center font-mono">{Math.round(scale * 100)}%</span>
                <button 
                  onClick={() => setScale(s => Math.min(3.0, s + 0.2))}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <ZoomIn size={18} />
                </button>
             </div>

             <button 
               onClick={onClose}
               className="p-2 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-full transition-colors"
             >
               <X size={24} />
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 flex justify-center p-8 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-gray-100/50 dark:bg-gray-900/50">
               <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          )}
          
          {error ? (
             <div className="flex flex-col items-center justify-center text-red-500">
               <p>{error}</p>
             </div>
          ) : (
             <canvas ref={canvasRef} className="shadow-xl" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
