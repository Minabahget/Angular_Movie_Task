import { Routes } from '@angular/router';
import { AddCategoryComponent } from './Component/add-category/add-category.component';
import { CategoriesComponent } from './Component/categories/categories.component';
import { UpdateCategoryComponent } from './Component/update-category/update-category.component';
import { AddMovieComponent } from './Component/add-movie/add-movie.component';
import { UpdateMovieComponent } from './Component/update-movie/update-movie.component';
import { MovieComponent } from './Component/movie/movie.component';
import { MovieDetailsComponent } from './Component/movie-details/movie-details.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: MovieComponent },
    { path:"updateCategry/:id",component:UpdateCategoryComponent},
    { path:"addCategory",component:AddCategoryComponent},
    { path:"categories",component:CategoriesComponent},
    { path:"addMovie",component:AddMovieComponent},
    {path:"updateMovie/:id",component:UpdateMovieComponent},
    {path:"Movies/:id",component:MovieComponent},
    {path:"movieDetails/:id",component:MovieDetailsComponent},
    { path: '**', redirectTo: '/Movies' } 

    

];
