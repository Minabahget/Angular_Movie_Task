import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { MovieService } from '../../../Service/movie.service';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IMovie } from '../../Helper/IMovie';
import { ICategory } from '../../Helper/ICategory';
import { CommonModule, JsonPipe } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-update-movie',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, JsonPipe],
  providers: [MovieService],
  templateUrl: './update-movie.component.html',
  styleUrl: './update-movie.component.css',
})
export class UpdateMovieComponent implements OnInit {
  // Form group for updating movie
  updateForm: FormGroup;

  // Variables for form validation messages
  validTitle: string = '';
  validDescription: string = '';
  validDuration: string = '';
  validRate: string = '';
  validCategory: string = '';
  validImage: string = '';

  // Arrays to store categories and selected categories
  categories: ICategory[] = [];
  selectedCategories: string[] = [];

  // Variable to store image path and file
  imagePath: string = '';
  image!: File;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize update form with form controls and validators
    this.updateForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(300),
      ]),
      duration: new FormControl('', [Validators.required]),
      rate: new FormControl('', [Validators.required, Validators.max(10)]),
      category: new FormControl([], [Validators.required]),
      image: new FormControl(''),
    });
  }

  ngOnInit(): void {
    // Fetch movie details by ID
    this.route.params.subscribe((params) => {
      const movieId = params['id'];

      this.movieService.getMovieById(movieId).subscribe((movie) => {
        // Set image path and populate form with movie details
        this.imagePath = environment.apiUrl + movie.imagePath;
        this.updateForm.patchValue({
          title: movie.title,
          description: movie.description,
          duration: movie.duration,
          rate: movie.rate,
          category: movie.categories, // Assuming category ID is stored in movie object
          image: '', // Clear the image field initially
        });
        this.selectedCategories = movie.categories;
      });
    });

    // Fetch all categories
    this.movieService.getAllCategory().subscribe((categories) => {
      this.categories = categories;
    });
  }

  // Method to update movie
  updateMovie(): void {
    if (this.updateForm.valid) {
      // Create form data
      const formData = new FormData();
      formData.append('title', this.updateForm.value.title);
      formData.append('description', this.updateForm.value.description);
      formData.append('duration', this.updateForm.value.duration);
      formData.append('rate', this.updateForm.value.rate);

      // Append selected category IDs to form data
      for (let categoryId of this.updateForm.value.category.map(
        (name: string) => this.categories.find((cat) => cat.name == name)?.id
      )) {
        formData.append('categories', categoryId);
      }

      // Append image file to form data if it exists
      if (this.image) {
        formData.append('image', this.image);
      }

      // Update movie using movie service
      const movieId = this.route.snapshot.params['id'];
      this.movieService.updateMovie(movieId, formData).subscribe({
        next: (data) => {},
        error: (error) => {
          console.error('Error updating movie:', error);
          alert('An error occurred while updating the movie. Please try again later.');
        },
        complete: () => {
          this.ngOnInit();
          alert('Movie updated successfully');
          this.router.navigate(['/Movies/0']);
        },
      });
    } else {
      // Handle form validation errors
      this.validTitle = this.updateForm.controls['title'].invalid ? 'Title is required' : '';
      this.validDescription = this.updateForm.controls['description'].invalid ? 'Description is required' : '';
      this.validDuration = this.updateForm.controls['duration'].invalid ? 'Duration is required' : '';
      this.validRate = this.updateForm.controls['rate'].invalid ? 'Rate is required' : '';
      this.validCategory = this.updateForm.controls['category'].invalid ? 'Category is required' : '';
      this.validImage = this.updateForm.controls['image'].invalid ? 'Image is required' : '';
      this.validRate = this.updateForm.controls['rate'].hasError('max') ? 'Maximum rate allowed is 10' : '';
    }
  }

  // Method to handle image file selection
  convertImage(event: any): void {
    this.image = event.target.files[0];
  }

  // Method to get category selection
  getCheckboxes(name: string): void {
    this.selectedCategories = this.selectedCategories.includes(name)
      ? this.selectedCategories.filter((cat) => cat != name)
      : [...this.selectedCategories, name];
    this.updateForm.patchValue({
      category: this.selectedCategories,
    });
  }
}
