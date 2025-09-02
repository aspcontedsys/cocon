import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Exhibitor {
  fullName: string;
  city: string;
  phone: string;
  date: string; 
}

@Component({
  selector: 'app-exhibitors-report',
  templateUrl: './exhibitors-report.page.html',
  styleUrls: ['./exhibitors-report.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ExhibitorsReportPage implements OnInit {

  exhibitors: Exhibitor[] = [
    { fullName: 'Arjun Nair', city: 'Kochi', phone: '+91 9876543210', date: '2025-08-20' },
    { fullName: 'Priya Sharma', city: 'Bangalore', phone: '+91 9123456780', date: '2025-08-22' },
    { fullName: 'Rahul Menon', city: 'Hyderabad', phone: '+91 9988776655', date: '2025-08-23' },
    { fullName: 'Sneha Iyer', city: 'Chennai', phone: '+91 8877665544', date: '2025-08-24' }
  ];

  filteredExhibitors: Exhibitor[] = [];
  selectedDate: string | null = null;
  allowedDates: string[] = [];   //  valid exhibitor dates
  highlightedDates: any[] = [];  //  for calendar highlight

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.filteredExhibitors = this.exhibitors;

  
    this.allowedDates = this.exhibitors.map(e => e.date);
    this.highlightedDates = this.allowedDates.map(d => ({
      date: d,
      textColor: '#fff',
      backgroundColor: '#97C93C'
    }));
  }

  goBack() {
    this.navCtrl.back();
  }

  callNumber(phone: string) {
    window.open(`tel:${phone}`, '_system');
  }

  //  Enable only exhibitor dates
  isDateEnabledFn = (dateIsoString: string) => {
    const date = dateIsoString.split('T')[0];
    return this.allowedDates.includes(date);
  };

  filterByDate(event: any) {
    const picked = event.detail.value;
    if (picked) {
      const date = picked.split('T')[0];
      if (this.allowedDates.includes(date)) {
        this.selectedDate = date;
        this.filteredExhibitors = this.exhibitors.filter(u => u.date === date);
      }
    }
  }

  clearFilter() {
    this.selectedDate = null;
    this.filteredExhibitors = this.exhibitors;
  }

  async exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Full Name,City,Phone,Date\n";
    this.filteredExhibitors.forEach(user => {
      csvContent += `${user.fullName},${user.city},${user.phone},${user.date}\n`;
    });

    const fileName = this.selectedDate
      ? `exhibitors_report_${this.selectedDate}.csv`
      : "exhibitors_report.csv";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const toast = await this.toastCtrl.create({
      message: `Report downloaded: ${fileName}`,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }
}
