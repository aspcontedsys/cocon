import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule, NavController, ToastController, IonModal } from '@ionic/angular';
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

  @ViewChild('dateModal') dateModal!: IonModal;

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
      this.allowedDates = this.exhibitors.map(e => e.created_at.split('T')[0]);
      this.highlightedDates = this.allowedDates.map(d => ({
        date: d,
        textColor: '#fff',
        backgroundColor: '#97C93C'
      }));
      this.filterData(new Date().toISOString().split('T')[0]);
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
    if(this.allowedDates.includes(date)){
      return true;
    }
    return false;
  };

  filterByDate(event: any) {
    if (event.detail && event.detail.value) {
      this.selectedDate = event.detail.value.split('T')[0];
      this.filterData(this.selectedDate);     
      // Close the modal after selection
      if (this.dateModal) {
        this.dateModal.dismiss();
      }
    }
  }

  filterData(selectedDate:string|null){
    this.filteredExhibitors = this.exhibitors.filter(
      exhibitor => exhibitor.created_at.split('T')[0] === selectedDate
    );
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
