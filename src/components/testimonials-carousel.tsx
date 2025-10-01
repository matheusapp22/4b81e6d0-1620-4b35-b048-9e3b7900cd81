import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Testimonial {
  id: string;
  image_url: string;
  client_name?: string;
  description?: string;
  rating?: number;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  className?: string;
}

export const TestimonialsCarousel = ({ testimonials, className = '' }: TestimonialsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swipe left - next testimonial
        nextTestimonial();
      } else {
        // Swipe right - previous testimonial
        prevTestimonial();
      }
    }

    // Reset values
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const currentTestimonial = testimonials[currentIndex];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-center">Depoimentos</h3>
      
      <div className="relative">
        <Card className="overflow-hidden">
          <CardContent 
            className="p-0"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Image */}
            <div className="aspect-square relative select-none">
              <img
                src={currentTestimonial.image_url}
                alt={`Depoimento de ${currentTestimonial.client_name || 'cliente'}`}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation buttons */}
              {testimonials.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
                    onClick={prevTestimonial}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
                    onClick={nextTestimonial}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              {/* Counter */}
              {testimonials.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {currentIndex + 1} / {testimonials.length}
                </div>
              )}
            </div>
            
            {/* Content */}
            {(currentTestimonial.client_name || currentTestimonial.description || currentTestimonial.rating) && (
              <div className="p-4 space-y-2">
                {currentTestimonial.rating && (
                  <div className="flex justify-center gap-1">
                    {renderStars(currentTestimonial.rating)}
                  </div>
                )}
                
                {currentTestimonial.client_name && (
                  <p className="font-semibold text-center">{currentTestimonial.client_name}</p>
                )}
                
                {currentTestimonial.description && (
                  <p className="text-sm text-muted-foreground text-center italic">
                    "{currentTestimonial.description}"
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Dots indicator */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};