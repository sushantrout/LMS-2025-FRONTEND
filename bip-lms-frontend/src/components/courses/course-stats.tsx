import { CourseReviewStats } from "@/types/model/course-review-model";
import React from "react";
import RatingStar from "../ui/rating-star";
import { Progress } from "../ui/progress";
import { Star } from "lucide-react";
interface CourseStatsProps {
  courseStats: CourseReviewStats;
}

const CourseStats: React.FC<CourseStatsProps> = ({ courseStats }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Section: Average Rating */}
      <div className="md:w-1/3">
        <div className="text-center p-6 border rounded-lg">
          <div className="text-5xl font-bold mb-2">
            {courseStats.averageRating}
          </div>
          <div className="flex justify-center mb-4">
            <RatingStar rating={courseStats.averageRating} />
          </div>
          <div className="mt-1 font-medium">
            {courseStats.totalReviews} Reviews
          </div>
        </div>
      </div>

      {/* Right Section: Breakdown of Ratings */}
      <div className="md:w-2/3 space-y-6">
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const percentage =
              rating === 5
                ? courseStats.fiveStarReviews
                : rating === 4
                ? courseStats.fourStarReviews
                : rating === 3
                ? courseStats.threeStarReviews
                : rating === 2
                ? courseStats.twoStarReviews
                : courseStats.oneStarReviews;

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-20">
                  <span>{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                </div>
                <Progress value={percentage} className="h-2 flex-1" />
                <div className="w-12 text-right text-muted-foreground">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseStats;
