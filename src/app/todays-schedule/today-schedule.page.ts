import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
import { DataService } from '../../services/data/data.service';
import { Schedule } from '../models/cocon.models';
@Component({
  selector: 'app-today-schedule',
  templateUrl: './today-schedule.page.html',
  styleUrls: ['./today-schedule.page.scss'],
  standalone:false
})
export class TodaySchedulePage implements OnInit {
  schedules:Schedule[] = [];
  eventDates:{label:string,date:string,active:boolean}[] = [];
  halls:{name:string,active:boolean}[] = [];
  noEvent:boolean = false;

  openedAccordion: string | null = null;

  constructor(private location: Location,
     private navCtrl: NavController,private dataService: DataService) {}

  ngOnInit(): void {
    this.getSchedules();
  }

  async getSchedules(){
    let schedule = await this.dataService.getTodaySchedules();  
    if(schedule.length > 0){
      this.schedules = schedule;
      this.eventDates = this.schedules.map(schedule => ({
        label: 'M',
        date: schedule.event_date,
        active: false
      }));
      // Set first date as active by default
      if (this.eventDates.length > 0) {
        this.selectDay(this.eventDates[0]);
      }
    }
    else{
      this.noEvent = true;
    }
    
  }

  getHallsAllocated(date: string) {
    // Find the schedule for the selected date
    const selectedSchedule = this.schedules.find(s => s.event_date === date);
    
    if (selectedSchedule && selectedSchedule.halls) {
      // Map halls and set first one as active
      this.halls = selectedSchedule.halls.map((hall, index) => ({
        name: hall.hall_name,
        active: index === 0 // Set first hall as active by default
      }));
    } else {
      this.halls = [];
    }
  }

  selectDay(selectedDay: any) {
    this.eventDates.forEach(day => day.active = false);
    selectedDay.active = true;
    this.getHallsAllocated(selectedDay.date);
    // Refresh topics when day changes
    // this.filteredSchedule = this.getTopicsForSelectedHallAndDate();
  }

  selectHall(selectedHall: any) {
    this.halls.forEach(hall => hall.active = false);
    selectedHall.active = true;
    // Refresh topics when hall changes
    // this.filteredSchedule = this.getTopicsForSelectedHallAndDate();
  }

  onAccordionChange(event: CustomEvent) {
    this.openedAccordion = event.detail.value;
  }

  getTopicsForSelectedHallAndDate() {
    const selectedDay = this.eventDates.find(d => d.active);
    const selectedHall = this.halls.find(h => h.active);
    
    if (!selectedDay || !selectedHall) return [];
    
    // Find the schedule for the selected date
    const selectedSchedule = this.schedules.find(s => s.event_date === selectedDay.date);
    if (!selectedSchedule) return [];
    
    // Find the selected hall in the schedule
    const hall = selectedSchedule.halls.find(h => h.hall_name === selectedHall.name);
    if (!hall || !hall.topics) return [];
    
    // Map topics to the format expected by the template
    // return hall.topics.map(topic => ({
    //   time: topic.start_time,
    //   title: topic.topic_name,
    //   speaker: topic.speaker_name || 'To be announced',
    //   description: topic.description || '',
    //   duration: topic.duration || '60 min'
    //      roles:topic.roles
    // }));
    return hall.topics.map(topic => ({
      time: topic.start_time,
      time2: topic.end_time,
      title: topic.topic_name,
      speaker: 'To be announced',
      description: 'To be announced',
      duration: '60 min',
      roles:topic.roles
    }));
  }

  get filteredSchedule() {
    return this.getTopicsForSelectedHallAndDate();
  }

  goBack() {
    this.location.back();
  }
}
