import { courseReviewService } from "@/http/course-review-service";
import { CourseReview } from "@/types/model/course-review-model";
import { showErrorToast, showSuccessToast } from "@/util/helpers/toast-helper";
import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function CommentForm({ courseId }) {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      let courseReview: CourseReview     = {
        feedback: comment,
        rating: rating,
        user: {
          id: "0KME2BNDQDWXH",
        },
        course: {
          id: courseId,
        },
      };
  
      courseReviewService
        .saveCourseReview(courseReview)
        .then((response) => {
          showSuccessToast("Thank you for your feedback!");
          setLoading(false);
          setComment("");
          setRating(0);
        })
        .catch((error) => {
          showErrorToast(error.response.data.message);
          setLoading(false);
        });
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= rating
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        <Textarea
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !rating || !comment.trim()}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    );
  }

