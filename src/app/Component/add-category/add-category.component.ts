import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../../Service/movie.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ICategory } from '../../Helper/ICategory';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-category',
  imports: [HttpClientModule, ReactiveFormsModule, RouterModule],
  standalone: true,
  providers: [MovieService],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent {
  addForm: FormGroup; // Form group for category addition
  validDescription: string = ''; // Validation message for description
  ValidName: string = ''; // Validation message for name

  constructor(private movieService: MovieService, private route: Router) {
    // Initialize form controls with validators
    this.addForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
    });
  }

  // Method triggered on form submission
  onSubmit(): void {
    // Check if form is valid
    if (this.addForm.valid) {
      this.ValidName = ''; // Reset validation message for name
      this.validDescription = ''; // Reset validation message for description

      // Fetch all categories to check for name uniqueness
      this.movieService.getAllCategory().subscribe((categories) => {
        // Iterate over categories to check for name uniqueness
        categories.forEach((category) => {
          if (category.name === this.addForm.value.name) {
            this.ValidName = 'Category already exists'; // Set validation message if category name already exists
            return; // Stop the execution of the function
          }
        });

        // If ValidName is set, it means a category with the same name exists
        if (this.ValidName) {
          return; // Stop the execution of the function
        }

        // Create a new category object
        const newCategory: ICategory = {
          id: 0, // Assuming the ID is assigned by the backend
          name: this.addForm.value.name,
          description: this.addForm.value.description,
          movieNames: [], // Assuming movieNames are not added in this form
        };

        // Add the new category
        this.movieService.addCategory(newCategory).subscribe({
          next: () => {
            this.addForm.reset(); // Clear the form after successful submission
          },
          error: (error) => {
            console.error('Error adding category:', error); // Log error if category addition fails
          },
          complete: () => {
            alert('Category added successfully'); // Show success message
            this.route.navigate(['categories']); // Navigate to categories page
          },
        });
      });
    } else {
      // If form is invalid, set validation messages accordingly
      if (this.addForm.controls['name'].invalid) {
        this.ValidName = 'Name is required';
      }
      if (this.addForm.controls['description'].invalid) {
        this.validDescription = 'Description is required';
      }
    }
  }
}
