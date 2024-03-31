import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MovieService } from '../../../Service/movie.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ICategory } from '../../Helper/ICategory';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  providers: [MovieService],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.css',
})
export class AddMovieComponent implements OnInit {
  // Form group for adding a movie
  addMovieForm: FormGroup;

  // Variables for validation messages
  validTitle: string = '';
  validDescription: string = '';
  validDuration: string = '';
  validRate: string = '';
  validCreatedDate: string = '';
  validImage: string = '';
  validCategories: string = '';

  // Array to store categories
  categories: ICategory[] = [];

  // Variable to store selected image file
  image!: File;

  constructor(private myService: MovieService, private route: Router) {
    // Initialize form controls with validators
    this.addMovieForm = new FormGroup({
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
      createdDate: new FormControl('', [Validators.required]),
      categories: new FormControl([], [Validators.required]), // Use an array to store selected categories
      image: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    // Fetch all categories when component initializes
    this.myService.getAllCategory().subscribe((categories) => {
      this.categories = categories;
    });
  }

  // Method triggered on form submission
  onSubmit(): void {
    if (this.addMovieForm.valid) {
      // If form is valid, prepare form data for submission
      const formData = new FormData();
      formData.append('title', this.addMovieForm.value.title);
      formData.append('description', this.addMovieForm.value.description);
      formData.append('duration', this.addMovieForm.value.duration);
      formData.append('rate', this.addMovieForm.value.rate);
      formData.append('createdDate', this.addMovieForm.value.createdDate);
      formData.append('image', this.image);

      // Append selected categories to FormData
      const selectedCategories = this.addMovieForm.value.categories;
      for (let categoryId of selectedCategories) {
        formData.append('categories', categoryId);
      }

      // Call service method to add movie
      this.myService.addMovie(formData).subscribe({
        next: (data) => {
          console.log(data);
          // Clear the form after successful submission
          this.addMovieForm.reset();
        },
        error: (error) => {
          console.error('Error adding movie:', error);
        },
        complete: () => {
          console.log('Movie added successfully');
          alert('Movie added successfully');
          this.route.navigate(['Movies/0']); // Navigate to movies list page
        },
      });
    } else {
      // Handle form validation errors
      // Check each form control for validation errors and set corresponding validation message
      // This can be optimized further by iterating over form controls
      if (this.addMovieForm.controls['title'].invalid) {
        this.validTitle = 'Title is required';
      }
      if (this.addMovieForm.controls['description'].invalid) {
        
        this.validDescription = 'Description is required';
      }
      if (this.addMovieForm.controls['duration'].invalid) {
        this.validDuration = 'Duration is required';
      }
      if (this.addMovieForm.controls['rate'].invalid) {
        this.validRate = 'Rate is required';
      }
      if (this.addMovieForm.controls['createdDate'].invalid) {
        this.validCreatedDate = 'Created date is required';
      }
      if (this.addMovieForm.controls['categories'].invalid) {
        this.validCategories = 'At least one category must be selected';
      }
      if (this.addMovieForm.controls['image'].invalid) {
        this.validImage = 'Image is required';
      }
      if (this.addMovieForm.controls['rate'].hasError('max')) {
        this.validRate = 'Maximum rate allowed is 10';
      }
    }
  }

  // Method to handle image selection
  convertImage(event: any) {
    this.image = event.target.files[0]; // Get selected image file
    const reader = new FileReader();
    reader.onload = () => reader.readAsDataURL(this.image!); // Read image as data URL
  }
}
