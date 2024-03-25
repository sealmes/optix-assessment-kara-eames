import {useMovieQuery} from "../queries/movies";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import {MovieComponent} from "./MovieComponent";
import React from "react";
import {IMovie} from "../interfaces/IMovie";
import {ArrowDownward, ArrowUpward} from "@mui/icons-material";

export interface MovieTableComponentProps {
  selectedMovie: string | undefined;
  setSelectedMovie: (id: string | undefined) => void;
}

/**
 * Columns available to sort by
 */
enum SortByColumn {
  Title,
  Release,
  Score,
  FilmCompany
}

/**
 * Takes a column and the sorting order and compares two movies based on that column
 * @param movieA The first movie to compare
 * @param movieB The second movie to compare
 * @param ascending Whether to sort in ascending order
 * @param column The column to sort by
 */
function compare(movieA: IMovie, movieB: IMovie, ascending: boolean, column: SortByColumn) {
  const ascendingModifier = ascending ? 1 : -1; // Multiply by -1 to reverse the sort order
  switch (column) {
    case SortByColumn.Title:
      return movieA.title.localeCompare(movieB.title) * ascendingModifier;
    case SortByColumn.Release:
      return (movieA.releaseYear - movieB.releaseYear) * ascendingModifier;
    case SortByColumn.Score:
      const movieAScore = movieA.reviews.reduce((acc, review) => acc + review, 0) / movieA.reviews.length;
      const movieBScore = movieB.reviews.reduce((acc, review) => acc + review, 0) / movieB.reviews.length;
      return (movieAScore - movieBScore) * ascendingModifier;
    case SortByColumn.FilmCompany:
      return movieA.filmCompanyId.localeCompare(movieB.filmCompanyId) * (ascending ? 1 : -1);

  }
}

/**
 * Shows the table of movies
 * @param selectedMovie the ID of the selected movie
 * @param setSelectedMovie the function to call when a movie is selected
 * @constructor
 */
export const MovieTableComponent = ({selectedMovie, setSelectedMovie}: MovieTableComponentProps) => {
  const movieDataQuery = useMovieQuery();

  if (!movieDataQuery.data) {
    return null;
  }

  const [sortBy, setSortBy] = React.useState<SortByColumn>(SortByColumn.Title);

  const [ascending, setAscending] = React.useState(true);

  const toggleSort = (column: SortByColumn) => {
    if (column === sortBy) {
      setAscending(!ascending);
    } else {
      setAscending(true);
      setSortBy(column);
    }
  }

  const SortArrow = ({column}: { column: SortByColumn }) => {
    if (column !== sortBy) {
      return null;
    }

    return ascending ? <>↑</> : <>↓</>;
  }

  const records = movieDataQuery.data || [];

  records.sort((a, b) => compare(a, b, ascending, sortBy));

  return <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell variant='head' onClick={() => toggleSort(SortByColumn.Title)}>Title <SortArrow column={SortByColumn.Title} /></TableCell>
          <TableCell variant='head' onClick={() => toggleSort(SortByColumn.Release)}>Release <SortArrow column={SortByColumn.Release} /></TableCell>
          <TableCell variant='head' onClick={() => toggleSort(SortByColumn.Score)}>Score <SortArrow column={SortByColumn.Score} /></TableCell>
          <TableCell variant='head' onClick={() => toggleSort(SortByColumn.FilmCompany)}>Film Company <SortArrow column={SortByColumn.FilmCompany} /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {records.map((movie: any) =>
          <MovieComponent
            isSelected={selectedMovie === movie.id}
            onClick={setSelectedMovie} id={movie.id}/>)
        }
      </TableBody>
    </Table></TableContainer>;

}