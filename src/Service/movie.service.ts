import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMovie } from '../app/Helper/IMovie';
import { ICategory } from '../app/Helper/ICategory';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private myClient: HttpClient) { }
  private APi_Category_Url=environment.apiUrl+"api/Category";
  private APi_Movie_Url=environment.apiUrl+"api/Movie";
  
  getAllCategory():Observable<ICategory[]> {
    return this.myClient.get<ICategory[]>(this.APi_Category_Url);
  }
  addCategory(category:any){
    return this.myClient.post(this.APi_Category_Url,category);
  }
  deleteCategory(id:number){
    return this.myClient.delete(this.APi_Category_Url+"/"+id);
  }
  updateCategory(id: number, category: ICategory): Observable<ICategory> {
    return this.myClient.put<ICategory>(`${this.APi_Category_Url}/${id}`, category);
  }
  
  getCategoryById(id:number):Observable<ICategory>{
    return this.myClient.get<ICategory>(this.APi_Category_Url+"/"+id);
  }



getMovieById(id:number):Observable<IMovie>{
  return this.myClient.get<IMovie>(this.APi_Movie_Url+"/"+id);
}
  getAllMovie():Observable<IMovie[]> {
    return this.myClient.get<IMovie[]> (this.APi_Movie_Url);
  }
  addMovie(movie:any){
    return this.myClient.post(this.APi_Movie_Url,movie,{ responseType: 'text' });
  }
  deleteMovie(id:number){
    return this.myClient.delete(this.APi_Movie_Url+"/"+id,{ responseType: 'text' });
  }
  updateMovie(id:number,movie:any):Observable<IMovie>{
    return this.myClient.put<IMovie>(this.APi_Movie_Url+"/"+id,movie);
  }


}
