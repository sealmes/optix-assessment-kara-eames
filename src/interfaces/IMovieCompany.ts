/**
 * Interface for a movie company - e.g. the company that produced a movie
 *
 * This is exactly as returned by the backend service
 */
export interface IMovieCompany {
  /**
   * The identifier of the movie company
   */
  id: string;
  /**
   * The name of the movie company
   */
  name: string;
}