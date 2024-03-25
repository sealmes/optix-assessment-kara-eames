/**
 * Represents a movie as returned by the backend service
 */
export interface IMovie {
  /**
   * Unique identifier of the movie.
   */
  id: string;
  /**
   * Review scores for the movie - this is a number between 1 and 10
   */
  reviews: number[];
  /**
   * Title of the movie.
   */
  title: string;
  /**
   * Cost of the movie in thousands of dollars.
   */
  cost: number;
  /**
   * Year the movie was released.
   */
  releaseYear: number;
  /**
   * Identifier of the company that produced the movie.
   *
   * {@see IMovieCompany}
   */
  filmCompanyId: string;
}