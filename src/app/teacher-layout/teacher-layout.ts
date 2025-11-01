import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-layout.html',
  styleUrls: ['./teacher-layout.scss']
})
export class TeacherLayout {
  logout() {
    localStorage.removeItem('foad_user');
    window.location.href = '/login';
  }
}
