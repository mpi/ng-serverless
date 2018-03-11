import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public api = 'No response';

  constructor(private $http: HttpClient) {}

  ngOnInit(): void {
    this.$http.get('/api/hello')
      .subscribe((data) => {
        console.log('data from server', data);
        this.api = JSON.stringify(data, null, 2);
      });
  }
}
