import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-creator-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './creator-layout.html',
  styleUrls: ['./creator-layout.scss']
})
export class CreatorLayout {
  logout() {
    localStorage.removeItem('foad_user');
    window.location.href = '/login';
  }
}
