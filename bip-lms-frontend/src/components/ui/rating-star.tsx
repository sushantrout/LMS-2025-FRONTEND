import React from "react";
import { Star } from "lucide-react";

interface RatingStarProps {
  rating: number; // e.g., 3.5, 4.2, etc.
}

export default function RatingStar({ rating }: RatingStarProps) {
  const fullStars = Math.floor(rating);
  const hasFraction = rating - fullStars > 0 && rating - fullStars < 1;
  const starsToRender = 5;

  return (
    <div className="flex items-center">
      {[...Array(starsToRender)].map((_, index) => {
        const star = index + 1;

        if (star <= fullStars) {
          // Full star
          return (
            <Star
              key={star}
              className="h-4 w-4 fill-yellow-500 text-yellow-500 "
            />
          );
        } else if (star === fullStars + 1 && hasFraction) {
          // Half star
          return (
            <div key={star} className="relative w-4 h-4">
              <Star className="absolute top-0 left-0 w-4 h-4 text-white " />
              <div
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: `${(rating - fullStars) * 100}%` }}
              >
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 " />
              </div>
            </div>
          );
        } else {
          // Empty star
          return (
            <Star
              key={star}
              className="h-4 w-4 text-white "
            />
          );
        }
      })}
    </div>
  );
}
