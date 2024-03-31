import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../../Service/movie.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ICategory } from '../../Helper/ICategory';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  providers: [MovieService],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  // Array to store categories
  categories: ICategory[] = [];

  constructor(
    private myService: MovieService,
    private readonly router: Router
  ) {}

  // Lifecycle hook - ngOnInit is called after the component is initialized
  ngOnInit(): void {
    // Fetch all categories when component initializes
    this.myService.getAllCategory().subscribe((data) => {
      this.categories = data; // Assign fetched categories to local variable
    });
  }

  // Method to delete a category
  delete(id: any) {
    console.log(id + ' delete');
    // Call service method to delete category
    this.myService.deleteCategory(id).subscribe({
      next: (data) => {
        console.log('deleted');
      },
      error: (error) => {
        console.log(' Error while deleting Category: ', error);
      },
      complete: () => {
        this.ngOnInit(); // Refresh category list after deletion
        this.router.navigate(['categories']); // Navigate back to categories page
      },
    });
  }
}
