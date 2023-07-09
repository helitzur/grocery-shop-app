import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Output() dateRangeChanged = new EventEmitter<{ fromDate: string, toDate: string }>();

  data: any[]=[];
  fromDate: string = '';
  toDate: string = '';
  view: [number, number] = [700, 300];
  // Options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Income/Outcome';
  timeline: boolean = true;

  lineChartCustomColors =  [
    { name: "Income", value: '#ff0000' },
    { name: "Outcome", value: '#0000ff' },
    { name: "Revenue", value: '#008000' }
  ];

  constructor(private http: HttpClient) {}
  ngOnInit() {
   this.setDefaultDates();
   this.filterChartData();
  }
  setDefaultDates() {
    this.fromDate = '2021-06-01';
    this.toDate = '2021-12-31';
  }
  fetchChartData() {
    const apiUrl = `http://localhost:5119/Data/getData?fromDate=${this.fromDate}&toDate=${this.toDate}`;
  
    this.http.get(apiUrl).subscribe((data: Object) => {
      const responseData = data as any[];
      responseData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const groupedData = this.groupDataByDate(responseData);
      const dates = Object.keys(groupedData);
      const income = [];
      const outcome = [];
      const clearRevenue = [];
  
      for (const date of dates) {
        const group = groupedData[date];
        const sumIncome = group.reduce((acc, item) => acc + item.income, 0);
        const sumOutcome = group.reduce((acc, item) => acc + item.outcome, 0);
        const sumClearRevenue = sumIncome - sumOutcome;
  
        income.push(sumIncome);
        outcome.push(sumOutcome);
        clearRevenue.push(sumClearRevenue);
      }
  
      this.data = [
        {
          name: 'Income',
          series: this.formatChartData(dates, income)
        },
        {
          name: 'Outcome',
          series: this.formatChartData(dates, outcome)
        },
        {
          name: 'Revenue',
          series: this.formatChartData(dates, clearRevenue)
        }
      ];
    });
  }

  filterChartData() {
    this.fetchChartData();
    this.dateRangeChanged.emit({ fromDate: this.fromDate, toDate: this.toDate });
  }
  
  
  groupDataByDate(data: any[]): { [key: string]: any[] } {
    const groupedData: { [key: string]: any[] } = {};
  
    for (const item of data) {
      const date = this.formatDate(item.date);
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(item);
    }
    return groupedData;
  }
  

  formatChartData(dates: any[], values: any[]): any[] {
    return dates.map((date, index) => ({
      name: date,
      value: values[index]
    }));
  }
  
  formatDate(date: string): string {
    const parts = date.split("T")[0].split("-");
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    return `${this.padNumber(day)}/${this.padNumber(month)}/${year}`;
  }
  
  padNumber(number: number): string {
    return number.toString().padStart(2, '0');
  }

  handleDateChange() {
    if (this.fromDate > this.toDate) {
      this.toDate = this.fromDate;
    }
  }
}
