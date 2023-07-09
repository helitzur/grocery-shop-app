import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'grocery-shop-app';
  selectedDateRange: string = '';

  updateDateRange(dateRange: { fromDate: string, toDate: string }) {
    setTimeout(() => {
      const formattedFromDate = this.formatDate(dateRange.fromDate);
      const formattedToDate = this.formatDate(dateRange.toDate);
      this.selectedDateRange = `${formattedFromDate} - ${formattedToDate}`;
    });
  }
  

  formatDate(date: string): string {
    const parts = date.split("-");
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    return formattedDate;
  }
}
