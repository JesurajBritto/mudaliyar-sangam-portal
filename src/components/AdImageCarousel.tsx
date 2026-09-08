import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Pause, Play } from 'lucide-react';

interface AdImageCarouselProps {
  images: string[];
  title: string;
  autoPlayIntervalMs?: number;
  aspectRatioClass?: string;
}

export const AdImageCarousel: React.FC<AdImageCarouselProps> = ({
  images,
  title,
  autoPlayIntervalMs = 3500,
  aspectRatioClass = 'aspect-video'
}) => {
  // Ensure we have a valid list of images (fallback to single placeholder if empty)
  const validImages = images && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Automatic slide and loop
  useEffect(() => {
    if (validImages.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, autoPlayIntervalMs);

    return () => clearInterval(timer);
  }, [validImages.length, isPaused, autoPlayIntervalMs]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const goToSlide = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <div
      className={`relative w-full ${aspectRatioClass} bg-zinc-950 overflow-hidden group select-none`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Slide Images */}
      {validImages.map((imgUrl, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={imgUrl}
            alt={`${title} - Slide ${idx + 1}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Subtle Gradient Overlays for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10 pointer-events-none" />

      {/* Slide Counter Badge (Top Right) */}
      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-white text-[11px] font-mono shadow-sm">
        <ImageIcon className="w-3 h-3 text-amber-400" />
        <span>
          {currentIndex + 1} / {validImages.length}
        </span>
        {validImages.length > 1 && (
          <span className="text-[10px] text-zinc-400 border-l border-zinc-600 pl-1">
            {isPaused ? <Pause className="w-2.5 h-2.5 inline" /> : <Play className="w-2.5 h-2.5 inline" />}
          </span>
        )}
      </div>

      {/* Manual Navigation Controls (shown on hover or touch) */}
      {validImages.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity shadow-md hover:scale-105"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity shadow-md hover:scale-105"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dot Indicators at Bottom */}
      {validImages.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-xs">
          {validImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={(e) => goToSlide(idx, e)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-4 bg-amber-400'
                  : 'w-1.5 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
