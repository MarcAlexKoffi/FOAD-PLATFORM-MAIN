import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rdv',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rdv.html',
  styleUrls: ['./rdv.scss']
})  
export class Rdv {
  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  daysInMonth: number[] = [];

  selectedDate: Date | null = null;

  events = [
    { date: new Date(2023, 9, 15), title: "Point de suivi — Module C++", status: "À venir" },
    { date: new Date(2023, 8, 23), title: "Validation du storyboard — Module Java", status: "Passé" },
    { date: new Date(2023, 9, 9), title: "Brainstorming nouvelle formation Python", status: "Annulé" }
  ];

  ngOnInit() {
    this.generateDays();
  }

  generateDays() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    const emptyDays = firstDay.getDay(); // 0 (dim) → 6 (sam)
    this.daysInMonth = Array(emptyDays).fill(0).concat([...Array(totalDays).keys()].map(i => i + 1));
  }

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateDays();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateDays();
  }

  getEventsForDay(day: number) {
    return this.events.filter(e =>
      e.date.getDate() === day &&
      e.date.getMonth() === this.currentMonth &&
      e.date.getFullYear() === this.currentYear
    );
  }

  selectDate(day: number) {
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
  }

  get monthLabel() {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  }
}
