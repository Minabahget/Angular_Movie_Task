import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../../Service/movie.service';
import { HttpClientModule } from '@angular/common/http';
import { ICategory } from '../../Helper/ICategory';
import { FormControl, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [HttpClientModule,ReactiveFormsModule],
 providers:[MovieService],
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.css'
})
export class UpdateCategoryComponent implements OnInit {
  // Variables to store category ID, name, and description
  ID: number = 0;
  ValidName: any;
  validDescription: any;

  // Variable to store category details
  category!: ICategory;

  // Form group for updating category
  updateForm = new FormGroup({
    name: new FormControl("", [Validators.maxLength(30), Validators.required]),
    description: new FormControl("", [Validators.required, Validators.maxLength(100)])
  });

  constructor(
    private myactivate: ActivatedRoute,
    private myClient: MovieService,
    private route: Router
  ) {
    // Get category ID from route parameters
    this.ID = myactivate.snapshot.params['id'];
  }

  ngOnInit(): void {
    // Fetch category details by ID
    this.myClient.getCategoryById(this.ID).subscribe({
      next: (data) => {
        this.category = data; // Assign fetched category details to local variable
      },
      error: (error) => {
        console.log("Error occurred during category retrieval", error); // Log error if fetching category fails
      },
      complete: () => {
        // Set form controls with fetched category details
        this.updateForm.controls['name'].setValue(this.category.name);
        this.updateForm.controls['description'].setValue(this.category.description);
      }
    });
  }

  // Method to update category
  updatebtn() {
    if (this.updateForm.valid) {
      // Retrieve values from the form
      const name: string | null | undefined = this.updateForm.value.name;
      const description: string | null | undefined = this.updateForm.value.description;

      // Check if the values are not null or undefined before assigning them
      if (name !== null && name !== undefined && description !== null && description !== undefined) {
        // Create a new object of type ICategory and assign values from the form to it
        const updatedCategory: ICategory = {
          id: this.ID,
          name: name,
          description: description,
          movieNames: this.category.movieNames // Assuming movieNames are not updated in this form
        };

        // Call the updateCategory method passing the updatedCategory object
        this.myClient.updateCategory(this.ID, updatedCategory).subscribe({
          next: (data) => {
            console.log(data); // Log success message if category is updated successfully
          },
          error: () => {
            console.log("Error occurred during category update"); // Log error message if update fails
          },
          complete: () => {
            console.log("Category update completed"); // Log completion message
            alert("Category updated successfully"); // Show alert for successful update
            this.route.navigate(['/categories']); // Navigate back to categories page after update
          }
        });
      }
    } else {
      // Handle form validation errors
      if (this.updateForm.controls['name'].invalid) {
        this.ValidName = "Name is required";
      }
      if (this.updateForm.controls["description"].invalid) {
        this.validDescription = "Description is required";
      }
    }
  }
}
