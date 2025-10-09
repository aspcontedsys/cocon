import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule, NavController, ToastController, IonModal } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DelegateVisitorList } from 'src/app/models/cocon.models';
import { DataService } from '../../services/data/data.service';
import { Encoding } from '@capacitor/filesystem';

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
    // Create CSV content
    let csvContent = "Full Name,Company Name,Email\n";
    this.filteredExhibitors.forEach(user => {
      csvContent += `"${user.name}","${user.company_name || ''}","${user.email}"\n`;
    });

    const fileName = this.selectedDate
      ? `exhibitors_report_${this.selectedDate}.csv`
      : "exhibitors_report.csv";

    try {
      // Write the file to the cache directory
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      
      // Create a temporary file
      const result = await Filesystem.writeFile({
        path: fileName,
        data: csvContent,
        directory: Directory.Cache,
        encoding: Encoding.UTF8
      });

      // Get the file URI
      const fileUri = result.uri;
      
      // Share the file (this will use the system's share dialog)
      const { Share } = await import('@capacitor/share');
      await Share.share({
        title: 'Export Exhibitors',
        text: 'Exhibitors Report',
        url: fileUri,
        dialogTitle: 'Share Exhibitors Report',
      });

      const toast = await this.toastCtrl.create({
        message: 'Report generated and ready to share',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      
    } catch (error) {
      console.error('Error exporting CSV:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error exporting report. Please try again.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
