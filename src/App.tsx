import React, {useState} from 'react';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Alert, Box, CircularProgress, createTheme, CssBaseline, Paper, ThemeProvider} from "@mui/material";
import {useMovieQuery} from "./queries/movies";
import {useMovieCompanyQuery} from "./queries/movieCompanies";
import {ReviewFormComponent} from "./components/ReviewFormComponent";
import {MovieTableComponent} from "./components/MovieTableComponent";
import {RefreshButtonComponent} from "./components/RefreshButtonComponent";

export const Home = () =>  {
  const [selectedMovie, setSelectedMovie] = useState<undefined | string>(undefined);

  const movieCompaniesQuery = useMovieCompanyQuery();

  const movieDataQuery = useMovieQuery();


  const isLoading = movieCompaniesQuery.isPending || movieDataQuery.isPending;

   if (isLoading) {
    return <Box minHeight='100vh' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
      <CircularProgress />
      <h3>Loading movies</h3>
    </Box>
  }


  return (
    <Box minHeight='100vh' padding={10} display='flex'
         flexDirection={'column'}
         alignItems='stretch'
         gap={2}
    >
      <Paper sx={{padding: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        { movieCompaniesQuery.data?.length ?<p>Found {movieCompaniesQuery.data?.length} Movies</p> : <p>No movies found</p> }
        <RefreshButtonComponent />
      </Paper>

      {movieCompaniesQuery.isError && <Alert severity={'error'}>
        {movieCompaniesQuery.error.message}
      </Alert>}

      {movieDataQuery.isError && <Alert severity={'error'}>
        {movieDataQuery.error.message}
      </Alert>}

      <MovieTableComponent selectedMovie={selectedMovie} setSelectedMovie={setSelectedMovie} />
      {(selectedMovie !== undefined) && <Paper sx={{padding: 2}}><ReviewFormComponent movieId={selectedMovie}/></Paper>}
    </Box>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      structuralSharing: true,
      retryOnMount: false,

    }
  }
});

const theme = createTheme({
   palette: {
    background: {
      paper: '#fff',
      default: '#636a7a'
    }
   }
})
export const App = () => {
    return <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <Home />
      </ThemeProvider>
    </QueryClientProvider>
}
