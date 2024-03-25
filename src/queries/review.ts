import {API_BASE_URL} from "../consts";
import {useMutation} from "@tanstack/react-query";

const submitReviewKey = ['submitReview'];

const fetchSubmitReview = async (review: string, score: number) => {
  const url = `${API_BASE_URL}/submitReview`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ review, score })
  });

  if (!response.ok) {
    throw new Error(`Failed to submit review: ${response.statusText}`);
  }

  return await response.json() as { message: string };
}

export const useSubmitReviewMutation = (movieId: string, onSuccess: () => void) => {
  return useMutation({
    mutationKey: [...submitReviewKey, movieId],
    mutationFn: ([review, score]: [review: string, score: number]) =>  fetchSubmitReview(review, score),
    onSuccess
  });
}