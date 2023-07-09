import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartComponent } from './chart.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ChartComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxChartsModule,
    FormsModule
  ],
  exports: [
    ChartComponent
  ]
})
export class ChartModule { }
