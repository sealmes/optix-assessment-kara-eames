/*
  Contains the tanstack queries and keys needed to grab information about movie companies from the API
 */

import {API_BASE_URL} from "../consts";
import {IMovieCompany} from "../interfaces/IMovieCompany";
import {useQuery} from "@tanstack/react-query";

export const movieCompaniesKey = ['movieCompanies'];

export const fetchMovieCompanies = async () => {
  const result = await fetch(`${API_BASE_URL}/movieCompanies`);

  if (result.status !== 200) {
    throw new Error("Couldn't fetch movie companies: " + result.statusText);
  }

  return await result.json() as IMovieCompany[];
}

export const useMovieCompanyQuery = () => {
  return useQuery({
    queryKey: movieCompaniesKey,
    queryFn: fetchMovieCompanies,
  });
}

/**
 * Grabs data about a specific movie company.
 *
 * The backend API doesn't support getting a single movie company at a time, so this is really simple - it just gets all
 * of them then filters to only the movie company we care about
 * @param id
 */
export const useMovieCompanyByIdQuery = (id: string) => {
  return useQuery({
    queryKey: movieCompaniesKey,
    queryFn: fetchMovieCompanies,
    select: (movieCompanies) => {
      return movieCompanies.find((f: any) => f.id === id)
    }
  });
}