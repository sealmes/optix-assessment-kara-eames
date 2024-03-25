import {movieCompaniesKey, useMovieCompanyQuery} from "../queries/movieCompanies";
import {moviesKey, useMovieQuery} from "../queries/movies";
import {IconButton} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import React from "react";
import {useQueryClient} from "@tanstack/react-query";

export const RefreshButtonComponent = () => {
  const queryClient = useQueryClient();

  return <IconButton color="secondary" aria-label="refresh" onClick={() => {
    queryClient.refetchQueries({
      queryKey: movieCompaniesKey
    });
    queryClient.refetchQueries({
      queryKey: moviesKey
    });
  }}>
    <RefreshIcon/>
  </IconButton>
}