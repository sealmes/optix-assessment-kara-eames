import {Box, Skeleton, TableCell, TableRow, Typography, useTheme} from "@mui/material";
import React, {useMemo} from "react";
import {useMovieCompanyByIdQuery} from "../queries/movieCompanies";
import {useMovieByIdQuery} from "../queries/movies";

/**
 * Calculates the average review score for a movie with the given ID
 *
 * This depends on the useMovieByIdQuery hook to get the movie data, but it does not cleanly handle the
 * error case. Errors from that query should be handled elsewhere on the page.
 *
 * If the movie data is not yet loaded or there was an error, this will return 0.
 * @param movieId The ID of the movie to calculate the average review score for
 */
const useAverageReviewScore = (movieId: string): number => {
  const movieQuery = useMovieByIdQuery(movieId)

  return useMemo(() => {
    if (!movieQuery.data) {
      return 0; // Can't calculate average if we don't have the data
    }

    const reviews = movieQuery.data.reviews;

    if (reviews.length === 0) {
      return 0; // No reviews, so the average is 0 - can't divide by 0
    }
    const meanScore= reviews.reduce((a: number, b: number) => a + b, 0) / reviews.length;

    // Round to 1 decimal place
    return Math.round(meanScore * 10) / 10;
  }, [movieQuery.status, movieId]);
}

export function MovieCompanyComponent(props: {
  id: string,
}) {
  const movieCompanyQuery = useMovieCompanyByIdQuery(props.id);

  if (movieCompanyQuery.isFetching) {
    return <Box padding={1}>
      <Skeleton variant="rectangular" width={100}/>
    </Box>
  }

  return <Box padding={1}>
          {movieCompanyQuery.data?.name}
  </Box>;
}

export function MovieComponent(props: {
  onClick: (id: string) => void,
  id: string,
  isSelected: boolean,
}) {
  const movieQuery = useMovieByIdQuery(props.id);
  const theme = useTheme();

  const averageScore = useAverageReviewScore(props.id);

  const styles = {
    backgroundColor: (props.isSelected ? theme.palette.secondary.light : theme.palette.common.white),
    color: (props.isSelected ? theme.palette.secondary.contrastText : theme.palette.common.black)
  }

  if (movieQuery.isFetching || !movieQuery.data) {
    return <TableRow>
      <TableCell><Skeleton variant="rectangular" width={100} height={100}/></TableCell>
      <TableCell><Skeleton variant="rectangular" width={100} height={100}/></TableCell>
      <TableCell><Skeleton variant="rectangular" width={100} height={100}/></TableCell>
      <TableCell><Skeleton variant="rectangular" width={100} height={100}/></TableCell>
    </TableRow>
  }


  const movie = movieQuery.data;
  return <TableRow onClick={() => props.onClick(props.id)} sx={styles}>
    <TableCell sx={styles}>{movie.title}</TableCell>
    <TableCell sx={styles}>{movie.releaseYear}</TableCell>
    <TableCell sx={styles}>{averageScore}</TableCell>
    <TableCell sx={styles}><MovieCompanyComponent id={movie.filmCompanyId} /></TableCell>
        </TableRow>;
}