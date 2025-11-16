import React, { useId } from 'react';

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  className?: string;
  starClassName?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRate, readOnly = false, className = '', starClassName = 'h-5 w-5' }) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  const id = useId();

  const handleRate = (rateValue: number) => {
    if (!readOnly && onRate) {
      onRate(rateValue);
    }
  };

  const handleMouseEnter = (rateValue: number) => {
    if (!readOnly) {
      setHoverRating(rateValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  return (
    <div className={`flex items-center ${readOnly ? '' : 'cursor-pointer'} ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const displayRating = hoverRating > 0 ? hoverRating : rating;
        const fillPercentage = readOnly 
          ? Math.max(0, Math.min(1, displayRating - star + 1)) * 100
          : displayRating >= star ? 100 : 0;
        
        const uniqueId = `star-grad-${id}-${star}`;
        const yellowColor = '#facc15'; // Tailwind yellow-400
        const grayColor = '#4b5563';   // Tailwind gray-600
        const strokeColor = '#fcd34d'; // Tailwind yellow-300

        return (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
            className={`transition-transform duration-200 ${!readOnly ? 'hover:scale-125' : ''} ${starClassName}`}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            style={{ color: strokeColor }}
          >
            <svg className="w-full h-full" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1}>
                <defs>
                    <linearGradient id={uniqueId}>
                        <stop offset={`${fillPercentage}%`} stopColor={yellowColor} />
                        <stop offset={`${fillPercentage}%`} stopColor={grayColor} />
                    </linearGradient>
                </defs>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill={`url(#${uniqueId})`} />
            </svg>
          </button>
        );
      })}
    </div>
  );
};
