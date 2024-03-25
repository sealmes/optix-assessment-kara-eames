import {useMovieByIdQuery} from "../queries/movies";
import React, {useMemo, useState} from "react";
import {useSubmitReviewMutation} from "../queries/review";
import {z} from "zod";
import {Alert, Box, Button, CircularProgress, FormControl, FormHelperText, Input, InputLabel} from "@mui/material";

/**
 * Shows the form to allow the user to leave a review for a movie
 * @param movieId The ID of the movie to leave a review for
 * @constructor
 */
export const ReviewFormComponent = ({movieId}: { movieId: string }) => {
  const movieQuery = useMovieByIdQuery(movieId);

  const [review, setReview] = useState('');
  const [score, setScore] = useState(5);


  const submitMutation = useSubmitReviewMutation(movieId, () => {
    // Clear the form and refetch the movie data to show the new review
    movieQuery.refetch();
    setReview('');
    setScore(5);
  });

  const hasReview = useMemo(() => {
    return review.length > 0;
  }, [review])
  const validationResult = useMemo(() => {
    const result = z.object({
      review: z.string().min(1, 'Review cannot be nothing').max(100, 'Review cannot be longer than 100 characters'),
      score: z.number().min(1).max(10).int('Score must be an whole number between 1 and 10')
    }).safeParse({review, score});

    if (result.success) {
      return {success: true, errors: {}};
    } else {
      return {success: false, errors: result.error.formErrors.fieldErrors};
    }
  }, [review, score]);

  const onSubmit = async (e: React.SyntheticEvent) => {
    submitMutation.mutate([review, score]);
    e.preventDefault();
  }
  return <form onSubmit={onSubmit}>
    <Box sx={{display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center'}}>
      <h3>Leave a review of {movieQuery.data?.title}</h3>

      <FormControl error={!!validationResult.errors.score} variant="standard" sx={{maxWidth: 500}}>
        <InputLabel htmlFor="score">Overall Score</InputLabel>
        <Input
          type="number"
          id="score"
          value={score}
          onChange={(e) => setScore(parseInt(e.target.value))}
          aria-describedby="score-error"
        />
        {validationResult.errors.score &&
            <FormHelperText id="score-error">{validationResult.errors.score}</FormHelperText>}
      </FormControl>
    </Box>

    <FormControl error={hasReview && !!validationResult.errors.review} variant="standard" fullWidth>
      <InputLabel htmlFor="review-text">Your Review</InputLabel>
      <Input
        multiline
        minRows={4}
        fullWidth
        id="review-text"
        placeholder="The best movie ever!"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        aria-describedby="review-text-error"
      />
      {hasReview && validationResult.errors.review &&
          <FormHelperText id="review-text-error">{validationResult.errors.review}</FormHelperText>}

    </FormControl>

    <Button onClick={onSubmit} disabled={!validationResult.success} variant='contained' fullWidth sx={{marginTop: 2}}>
      {submitMutation.isPending ? <CircularProgress size={24} color={'secondary'}/> : 'Submit Review'}
    </Button>

    {submitMutation.isError && <Alert severity={'error'} sx={{marginTop: 2}}>
      {submitMutation.error.message}
    </Alert>}

    {submitMutation.isSuccess && <Alert severity={'success'} sx={{marginTop: 2}}>
      {submitMutation.data?.message}
    </Alert>}
  </form>
}