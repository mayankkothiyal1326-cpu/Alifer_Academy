import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Bookmark, 
  Search, 
  Check, 
  FileText,
  BookOpen
} from 'lucide-react';

export const PdfViewerModal: React.FC = () => {
  const { activePdf, closePdfViewer, addDownload, updateDownloadPage, downloads } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchWord, setSearchWord] = useState('');
  const [isDownloaded, setIsDownloaded] = useState(false);

  const totalPages = activePdf?.pages || 12;

  // Restore remembered page from local history
  useEffect(() => {
    if (activePdf) {
      const existing = downloads.find(d => d.title === activePdf.title);
      if (existing && existing.lastOpenedPage) {
        setCurrentPage(existing.lastOpenedPage);
      } else if (activePdf.initialPage) {
        setCurrentPage(activePdf.initialPage);
      } else {
        try {
          const savedPage = localStorage.getItem(`pdf_page_${activePdf.title}`);
          if (savedPage) setCurrentPage(parseInt(savedPage, 10));
        } catch {
          // ignore
        }
      }
    }
  }, [activePdf, downloads]);

  // Save current page
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (activePdf) {
      try {
        localStorage.setItem(`pdf_page_${activePdf.title}`, newPage.toString());
      } catch {
        // ignore
      }
      const existing = downloads.find(d => d.title === activePdf.title);
      if (existing) {
        updateDownloadPage(existing.id, newPage);
      }
    }
  };

  const handleDownload = () => {
    if (!activePdf) return;
    addDownload({
      title: activePdf.title,
      courseName: activePdf.courseName || 'Alifer Academy Notes',
      type: 'pdf',
      fileSize: '4.2 MB',
      totalPages: activePdf.pages || 12,
      lastOpenedPage: currentPage,
      localPath: `/storage/notes/${encodeURIComponent(activePdf.title)}.pdf`,
    });
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  if (!activePdf) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Action Toolbar */}
      <div className="h-14 bg-[#0a0a0f] border-b border-zinc-800 px-4 flex items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={closePdfViewer}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
            title="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-semibold truncate text-zinc-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{activePdf.title}</span>
            </h3>
            <p className="text-[10px] text-zinc-400 truncate">
              {activePdf.courseName || 'Alifer Academy Official Study Notes'}
            </p>
          </div>
        </div>

        {/* Center: Page Controls */}
        <div className="hidden sm:flex items-center gap-2 bg-zinc-900/90 px-3 py-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1 text-zinc-300 hover:text-amber-400 disabled:opacity-40 disabled:hover:text-zinc-300"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono tabular-nums text-zinc-300">
            Page <span className="text-amber-400 font-bold">{currentPage}</span> of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1 text-zinc-300 hover:text-amber-400 disabled:opacity-40 disabled:hover:text-zinc-300"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Tools: Zoom, Search, Download */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setZoomLevel(prev => Math.max(75, prev - 25))}
              className="p-1 text-zinc-400 hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 text-zinc-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(175, prev + 25))}
              className="p-1 text-zinc-400 hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-medium transition-colors"
          >
            {isDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Saved</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Save Offline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Document Reading Canvas */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-[#07070a]">
        <div 
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="w-full max-w-3xl bg-[#121218] border border-zinc-800 text-zinc-100 rounded-xl shadow-2xl p-6 sm:p-10 transition-transform duration-150 min-h-[700px] flex flex-col justify-between"
        >
          {/* Header of simulated PDF page */}
          <div>
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-amber-400 text-sm tracking-wider">
                  ALIFER ACADEMY
                </span>
                <span className="text-xs text-zinc-400">· Official Lecture Notes</span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            {/* Simulated Content based on active page */}
            <div className="space-y-5 text-sm leading-relaxed text-zinc-200">
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4">
                <h4 className="text-amber-300 font-semibold text-sm mb-1">
                  Section {currentPage}.0: Key Principles & Formula Derivations
                </h4>
                <p className="text-xs text-zinc-400">
                  Concept clarity note: Master these core definitions and standard forms for examination problem solving.
                </p>
              </div>

              <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800/80 font-mono text-xs text-amber-200/90 leading-loose">
                <div className="text-zinc-400">// Standard Theorem #{currentPage}</div>
                <div>lim (x → a) [ (x^n - a^n) / (x - a) ] = n · a^(n - 1)</div>
                <div>d/dx [ e^(u(x)) ] = e^(u(x)) · u'(x)</div>
                <div>∫ [ f'(x) / f(x) ] dx = ln |f(x)| + C</div>
              </div>

              <h5 className="font-semibold text-white text-sm">
                Conceptual Walkthrough:
              </h5>
              <p className="text-xs text-zinc-300 leading-relaxed">
                When evaluating indeterminate structures, first test whether series expansions (Taylor/Maclaurin) or algebraic factorizations provide a more direct simplification before differentiating. Always verify that both left-hand and right-hand limits converge on the exact same real value before declaring the existence of the limit.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-800">
                  <span className="text-xs font-semibold text-amber-400 block mb-1">
                    Exam Strategy Tip
                  </span>
                  <p className="text-[11px] text-zinc-400">
                    Watch for removable vs jump discontinuities. A denominator of zero does not necessarily indicate a vertical asymptote if the factor cancels.
                  </p>
                </div>
                <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-800">
                  <span className="text-xs font-semibold text-cyan-400 block mb-1">
                    Related Practice
                  </span>
                  <p className="text-[11px] text-zinc-400">
                    Attempt Practice Test #1 in the Practice Zone after completing this chapter reading.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer of PDF page */}
          <div className="border-t border-zinc-800 pt-4 mt-8 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Alifer Academy · Learning For All · Er. Alifer Sir</span>
            <span className="font-mono">Page {currentPage} / {totalPages} (Auto-Saved)</span>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar for PDF Pages */}
      <div className="sm:hidden h-14 bg-[#0a0a0f] border-t border-zinc-800 px-4 flex items-center justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1.5 rounded-lg bg-zinc-900 text-xs text-zinc-200 disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-xs font-mono text-zinc-300">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1.5 rounded-lg bg-zinc-900 text-xs text-zinc-200 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};
