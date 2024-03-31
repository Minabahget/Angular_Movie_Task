import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MovieService } from '../../../Service/movie.service';
import { HttpClientModule } from '@angular/common/http';
import { IMovie } from '../../Helper/IMovie';
import { CommonModule, JsonPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ICategory } from '../../Helper/ICategory';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [HttpClientModule, CommonModule, JsonPipe, RouterModule],
  providers: [MovieService],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent implements OnInit {
  // Array to store all movies
  movies: IMovie[] = [];

  // Array to store filtered movies based on category
  filteredMovies: IMovie[] = [];

  // Variable to store current category
  category!: ICategory;

  // Variable to store error or informational message
  message: string = '';

  // Variable to store API URL from environment
  localHost: string = environment.apiUrl;

  // Variable to store category ID from route parameter
  CategoryId!: number;

  constructor(private myService: MovieService, private route: ActivatedRoute) {}

  // Lifecycle hook - ngOnInit is called after the component is initialized
  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.route.params.subscribe((params) => {
      // Extract category ID from route parameter
      this.CategoryId = +params['id'];
      // Load movies based on category ID
      this.loadMovies();
    });
  }

  // Method to load movies based on category
  loadMovies(): void {
    // Fetch all movies
    this.myService.getAllMovie().subscribe({
      next: (data) => {
        // Assign fetched movies to local variable
        this.movies = data;
        // Filter movies by category
        this.filterMoviesByCategory();
      },
      error: (err) => {
        console.log(err); // Log error if fetching movies fails
      },
      complete: () => {
        console.log('complete'); // Log completion of fetching movies
      },
    });
  }

  // Method to filter movies by category
  filterMoviesByCategory(): void {
    // Check if category ID exists
    if (this.CategoryId) {
      // Fetch category by ID
      this.myService.getCategoryById(this.CategoryId).subscribe({
        next: (data) => {
          // Assign fetched category to local variable
          this.category = data;
          console.log('Category:', this.category);
          // Filter movies by category name
          this.filteredMovies = this.movies.filter((movie) =>
            movie.categories.includes(this.category.name)
          );
          // Set message if no movies found for this category
          if (this.filteredMovies.length == 0) {
            this.message = 'No movies found for this category';
          }
        },
        error: (err) => {
          console.log(err); // Log error if fetching category fails
        },
      });
    } else {
      // If no category ID is provided, display all movies
      this.filteredMovies = this.movies;
    }
  }
}

