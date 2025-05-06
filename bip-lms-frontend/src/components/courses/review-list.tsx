import { CourseReview } from "@/types/model/course-review-model";
import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getTimeAgo } from "@/util/helpers/application-data-converter-util";
import RatingStar from "../ui/rating-star";
interface ReviewListProps {
  courseReviews: CourseReview[];
}

const ReviewList: React.FC<ReviewListProps> = ({ courseReviews }) => {
  return (
    <div className="space-y-6">
      {courseReviews.map((review, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {review.user.fullName
                    .split(" ")
                    .map((n) => n[0].toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{review.user.fullName}</div>
                <div className="text-xs text-muted-foreground">
                  {getTimeAgo(review.createdOn)}
                </div>
              </div>
            </div>
            <div className="flex">
              <RatingStar rating={review.rating} />
            </div>
          </div>
          <p className="text-muted-foreground">{review.feedback}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
