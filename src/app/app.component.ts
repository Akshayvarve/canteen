import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  employee: any = {};
  reports: any[] = [];
  paginatedReports: any[] = [];
  totalFine = 0;
  
  currentPage: number = 1; 
  itemsPerPage: number = 5; 
  totalPages: number; 

  constructor(private foodOrderService: AppService) {
    this.totalPages = 0;
  }

  ngOnInit() {
    this.getFoodOrderDetails(11);
  }

  getFoodOrderDetails(month: number) {
    this.foodOrderService.getFoodOrderDetails(month).subscribe(
      (data) => {
        console.log(data);
        this.employee = data.user;
        this.reports = data.reports;
        this.calculateFine();
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching food order details:', error);
      }
    );
  }

  calculateFine() {
    this.totalFine = this.reports.reduce((acc, report) => {
      const { breakfast, lunch, dinner } = report.opt_ins || {};
      let fine = 0;
      if (breakfast === 'Pending') fine += 100;
      if (lunch === 'Pending') fine += 100;
      if (dinner === 'Pending') fine += 100;
      return acc + fine;
    }, 0);
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.reports.length / this.itemsPerPage);
    this.paginatedReports = this.reports.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getStatusClass(status: string): string {
    switch (status?.trim()) {
      case 'Delivered':
        return 'delivered';
      case 'Pending':
        return 'pending';
      case 'Canceled':
        return 'cancelled';
      default:
        return '';
    }
  }
}
