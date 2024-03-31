import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MovieComponent } from './Component/movie/movie.component';
import { HeaderComponent } from './Component/header/header.component';
import { AddCategoryComponent } from './Component/add-category/add-category.component';
import { CategoriesComponent } from './Component/categories/categories.component';
import { UpdateCategoryComponent } from './Component/update-category/update-category.component';
import { AddMovieComponent } from './Component/add-movie/add-movie.component';
import { UpdateMovieComponent } from './Component/update-movie/update-movie.component';
import { MovieDetailsComponent } from './Component/movie-details/movie-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
     RouterOutlet,
     MovieComponent,
     HeaderComponent,
     UpdateCategoryComponent,
     CategoriesComponent,
     AddCategoryComponent,
     AddMovieComponent,
     UpdateMovieComponent,
     MovieDetailsComponent,
   
     
     
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
