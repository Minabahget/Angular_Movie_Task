import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../../Service/movie.service';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { IMovie } from '../../Helper/IMovie';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule,RouterLink],
  providers: [MovieService],
 
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit {
  // Variable to store movie details
  movie: IMovie | undefined;

  // Variable to store error or informational message
  message: string = '';

  // Variable to store API URL from environment
  localHost: string = environment.apiUrl;

  constructor(
    private myService: MovieService,
    private route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Extract movie ID from route parameter
    const movieId = this.route.snapshot.params['id'];

    // Fetch movie details by ID
    this.myService.getMovieById(movieId).subscribe({
      next: (movie: IMovie) => {
        // Assign fetched movie details to local variable
        this.movie = movie;
      },
      error: (error: any) => {
        // Set error message if fetching movie details fails
        this.message = 'Failed to load movie details.';
        console.error('Error fetching movie details:', error);
      }
    });
  }

  // Method to delete a movie
  deleteMovie(id: any) {
    // Call service method to delete movie
    this.myService.deleteMovie(id).subscribe({
      next: (data) => {
        console.log(data); // Log success message if movie is deleted successfully
        console.log("deleted");
      },
      error: (error) => {
        console.log(" Error while delete movie:", error); // Log error message if deletion fails
      },
      complete: () => {
        this.ngOnInit(); // Refresh movie details after deletion
        console.log("complete"); // Log completion message
        this.router.navigate(['/']); // Navigate back to home page after deletion
      }
    });
  }
}


