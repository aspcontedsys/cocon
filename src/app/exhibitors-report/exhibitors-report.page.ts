import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DelegateVisitorList } from 'src/app/models/cocon.models';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-exhibitors-report',
  templateUrl: './exhibitors-report.page.html',
  styleUrls: ['./exhibitors-report.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ExhibitorsReportPage implements OnInit {

  exhibitors: DelegateVisitorList[] = [];

  filteredExhibitors: DelegateVisitorList[] = [];
  selectedDate: string | null = null;
  allowedDates: string[] = [];   //  valid exhibitor dates
  highlightedDates: any[] = [];  //  for calendar highlight

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getDelegateList();
  }

  getDelegateList(){
    this.dataService.fetchDelegateVisitors().then((data) => {
      this.exhibitors = data;
      this.filteredExhibitors = this.exhibitors;
      this.allowedDates = this.exhibitors.map(e => e.created_at);
      this.highlightedDates = this.allowedDates.map(d => ({
        date: d,
        textColor: '#fff',
        backgroundColor: '#97C93C'
      }));
    });
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
        this.filteredExhibitors = this.exhibitors.filter(u => u.created_at === date);
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
      csvContent += `${user.name},${user.address},${user.phone},${user.created_at}\n`;
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
