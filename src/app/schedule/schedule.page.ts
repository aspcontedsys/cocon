import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
import { DataService } from '../../services/data/data.service';
import { Schedule } from '../models/cocon.models';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
  standalone: false
})
export class SchedulePage implements OnInit {
  schedules: Schedule[] = [];
  eventDates: { label: string, formattedDate: string, date: string, active: boolean }[] = [];
  halls: { name: string, active: boolean }[] = [];

  openedAccordion: string | null = null;

 
  favorites: Set<string> = new Set();

  constructor(
    private location: Location,
    private navCtrl: NavController,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getSchedules();
  }

  async getSchedules() {
    this.schedules = await this.dataService.getSchedules();
    this.eventDates = this.schedules.map(schedule => ({
      label: new Date(schedule.event_date).toLocaleDateString('en-US', { weekday: 'short' }),
      formattedDate: new Date(schedule.event_date).toLocaleDateString('en-GB').split('/').join('-'),
      date: schedule.event_date,
      active: false
    }));
    if (this.eventDates.length > 0) {
      this.selectDay(this.eventDates[0]);
    }
  }

  getHallsAllocated(date: string) {
    const selectedSchedule = this.schedules.find(s => s.event_date === date);
    if (selectedSchedule && selectedSchedule.halls) {
      this.halls = selectedSchedule.halls.map((hall, index) => ({
        name: hall.hall_name,
        active: index === 0
      }));
    } else {
      this.halls = [];
    }
  }

  selectDay(selectedDay: any) {
    this.eventDates.forEach(day => (day.active = false));
    selectedDay.active = true;
    this.getHallsAllocated(selectedDay.date);
  }

  selectHall(selectedHall: any) {
    this.halls.forEach(hall => (hall.active = false));
    selectedHall.active = true;
  }

  onAccordionChange(event: CustomEvent) {
    this.openedAccordion = event.detail.value;
  }

  
  getTopicsForSelectedHallAndDate() {
    const selectedDay = this.eventDates.find(d => d.active);
    const selectedHall = this.halls.find(h => h.active);

    if (!selectedDay || !selectedHall) return [];

    const selectedSchedule = this.schedules.find(s => s.event_date === selectedDay.date);
    if (!selectedSchedule) return [];

    const hall = selectedSchedule.halls.find(h => h.hall_name === selectedHall.name);
    if (!hall || !hall.topics) return [];

    return hall.topics.map(topic => {
      const isBreak = this.isBreakTopic(topic.topic_name);
      return {
        id: `${selectedDay.date}-${selectedHall.name}-${topic.topic_name}`, // unique id
        time: topic.start_time,
        time2: topic.end_time,
        title: topic.topic_name,
        speaker: isBreak ? '' : 'To be announced',
        description: isBreak ? '' : 'To be announced',
        duration: isBreak ? '' : '60 min',
        roles: topic.roles,
        isBreak
      };
    });
  }

 
  isBreakTopic(title: string): boolean {
    const breakKeywords = ['break', 'lunch', 'tea', 'coffee'];
    return breakKeywords.some(keyword =>
      title?.toLowerCase().includes(keyword)
    );
  }

  get filteredSchedule() {
    return this.getTopicsForSelectedHallAndDate();
  }

  goBack() {
    this.location.back();
  }

  
  toggleFavorite(topic: any) {
    if (this.favorites.has(topic.id)) {
      this.favorites.delete(topic.id);
    } else {
      this.favorites.add(topic.id);
    }
  }

  
  isFavorite(topic: any): boolean {
    return this.favorites.has(topic.id);
  }
}
