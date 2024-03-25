/*
  Contains the tanstack queries and keys needed to grab information about movies from the API
 */


import {API_BASE_URL} from "../consts";

import {IMovie} from "../interfaces/IMovie";
import {useQuery} from "@tanstack/react-query";

export const moviesKey = ['movies'];

export const fetchMovies = async () => {
  const result = await fetch(`${API_BASE_URL}/movies`);

  if (result.status !== 200) {
    throw new Error("Couldn't fetch movies: " + result.statusText);
  }

  return await result.json() as IMovie[];
}

export const useMovieQuery = () => {
  return useQuery({
    queryKey: moviesKey,
    queryFn: fetchMovies,
  });
}

/**
 * Grabs data about a specific movie.
 *
 * The backend API doesn't support getting a single movie at a time, so this is really simple - it  just gets all
 * of them then filters to only the movie we care about
 * @param id
 */
export const useMovieByIdQuery = (id: string) => {
  return useQuery({
    queryKey: moviesKey,
    queryFn: fetchMovies,
    select: (movies) => {
      return movies.find((m: any) => m.id === id)
    },
  });
}
