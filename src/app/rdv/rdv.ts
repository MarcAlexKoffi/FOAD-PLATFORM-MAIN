import { Component, Signal, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RdvForm } from '../rdv-form/rdv-form';

export type RdvStatut = 'Proposé' | 'Confirmé' | 'Annulé';

export interface Appointment {
  id: string;
  objet: string;
  dateHeure: string;      // ISO
  lieu?: string;
  statut: RdvStatut;
  participants?: string[];
  demandeLiee?: string | null;
  description?: string | null;
}

const LS_KEY = 'foad_rdv_v1';

@Component({
  selector: 'app-rdv',
  standalone: true,
  imports: [CommonModule, RdvForm],
  templateUrl: './rdv.html',
  styleUrls: ['./rdv.scss'] // on ne touche pas à tes styles
})
export class Rdv {
  // --- Modal
  showForm = false;
  selectedDate: Date | null = null;

  openRdvForm(day?: number) {
    if (typeof day === 'number' && day > 0) {
      this.selectedDate = new Date(this.currentYear, this.currentMonth, day, 9, 0, 0);
    }
    this.showForm = true;
  }
  closeRdvForm(evt?: { created: boolean; appointment?: Appointment }) {
    this.showForm = false;
    if (evt?.created && evt.appointment) this.add(evt.appointment);
  }

  // --- Store (signals + localStorage)
  private _items = signal<Appointment[]>(this.hydrate());
  items: Signal<Appointment[]> = this._items.asReadonly();

  upcoming = computed(() =>
    this._items()
      .filter(a => a.statut !== 'Annulé' && new Date(a.dateHeure).getTime() >= Date.now())
      .sort((a, b) => +new Date(a.dateHeure) - +new Date(b.dateHeure))
  );
  past = computed(() =>
    this._items()
      .filter(a => new Date(a.dateHeure).getTime() < Date.now())
      .sort((a, b) => +new Date(b.dateHeure) - +new Date(a.dateHeure))
  );
  cancelled = computed(() =>
    this._items().filter(a => a.statut === 'Annulé')
  );

  add(a: Appointment) {
  // Normalise à l’ajout (au cas où)
  const d = new Date(a.dateHeure);
  const safe: Appointment = {
    ...a,
    id: a.id || (crypto.randomUUID?.() ?? String(Date.now())),
    objet: (a.objet ?? '').toString().trim(),
    dateHeure: isNaN(+d) ? new Date().toISOString() : d.toISOString()
  };
  this._items.update(list => [safe, ...list]);
  this.persist();
}
  remove(id: string) {
    this._items.update(list => list.filter(x => x.id !== id));
    this.persist();
  }
 private hydrate(): Appointment[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const list = raw ? (JSON.parse(raw) as Appointment[]) : [];
    // Migration: on force dateHeure en ISO valide
    return list.map(a => {
      const d = new Date(a.dateHeure);
      return isNaN(+d) ? { ...a, dateHeure: new Date().toISOString() } : { ...a, dateHeure: d.toISOString() };
    });
  } catch {
    return [];
  }
}
  private persist() {
    localStorage.setItem(LS_KEY, JSON.stringify(this._items()));
  }

  // --- Calendrier (mêmes hooks/classes que ton HTML)
  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();

  get monthLabel() {
    return new Date(this.currentYear, this.currentMonth, 1)
      .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  get daysInMonth(): number[] {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay(); // 0=dim
    const blanks = Array(firstDay).fill(0);
    const total = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const days = Array.from({ length: total }, (_, i) => i + 1);
    return [...blanks, ...days];
  }

  prevMonth() {
    if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; }
    else { this.currentMonth--; }
  }
  nextMonth() {
    if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; }
    else { this.currentMonth++; }
  }

  selectDate(day: number) {
    if (!day) return;
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
  }

  getEventsForDay(day: number) {
    if (!day) return [];
    return this._items().filter(a => {
      const d = new Date(a.dateHeure);
      return d.getFullYear() === this.currentYear &&
             d.getMonth() === this.currentMonth &&
             d.getDate() === day;
    });
  }
}
