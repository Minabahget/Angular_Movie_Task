import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../../Service/movie.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ICategory } from '../../Helper/ICategory';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, HttpClientModule, NgbDropdownModule, CommonModule],
  providers: [MovieService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  // Injecting MovieService and HttpClient via constructor
  constructor(private service: MovieService, private http: HttpClient) {}

  // Array to store categories
  categories: ICategory[] = [];

  // Variable to store temperature
  temperature: number | undefined;

  // Lifecycle hook - ngOnInit is called after the component is initialized
  ngOnInit(): void {
    // Call getLocation method to get user's location and temperature
    this.getLocation();

    // Fetch all categories from MovieService
    this.service.getAllCategory().subscribe({
      next: (res) => {
        this.categories = res; // Assign fetched categories to local variable
      },
      error: (err) => {
        console.log('Error while fetching data', err); // Log error if fetching fails
      },
      complete: () => {
        console.log('completed fetching data'); // Log completion of fetching data
      },
    });
  }

  // Method to get user's current location
  getLocation(): void {
    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
      // If supported, get current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude; // Get latitude
          const longitude = position.coords.longitude; // Get longitude
          // Call getTemperature method with latitude and longitude
          this.getTemperature(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location', error); // Log error if getting location fails
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  // Method to get temperature based on latitude and longitude
  getTemperature(latitude: number, longitude: number): void {
    const apiKey = 'e9cd2f68fba2e3e7bf8149396b576da3'; // OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    // HTTP GET request to OpenWeatherMap API
    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
       this.temperature=data.main.temp
        console.log('Temperature:', data.main.temp); // Log the fetched temperature
      },
      error: (error) => {
        console.error('Error fetching temperature', error); // Log error if fetching temperature fails
      }
    }
    );
  }
}
