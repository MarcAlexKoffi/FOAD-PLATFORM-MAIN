import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RdvStatut, Appointment } from '../rdv/rdv'; // si chemin différent, adapte

@Component({
  selector: 'app-rdv-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rdv-form.html',
  styleUrls: ['./rdv-form.scss'] // on garde ton SCSS
})
export class RdvForm {
  @Input() initialDate: Date | null = null;
  @Output() formClosed = new EventEmitter<{ created: boolean; appointment?: Appointment }>();

  private fb = inject(FormBuilder);
  private file?: File;

  rdvForm = this.fb.group({
    objet: ['', [Validators.required, Validators.minLength(3)]],
    dateHeure: ['', Validators.required], // datetime-local
    lieu: [''],
    statut: ['Proposé' as RdvStatut],
    participants: ['1', Validators.required],
    demandeLiee: [''],
    description: ['']
  });

  ngOnInit() {
    if (this.initialDate) {
      const d = this.initialDate;
      const pad = (n: number) => String(n).padStart(2, '0');
      const value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      this.rdvForm.patchValue({ dateHeure: value });
    }
  }

  handleFileInput(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.file = input.files?.[0] ?? undefined;
  }

  submit() {
  if (this.rdvForm.invalid) return;

  const v = this.rdvForm.value;
  const objet = (v.objet ?? '').toString().trim();
  if (!objet) {
    this.rdvForm.get('objet')?.setErrors({ required: true });
    return;
  }

  // Normalise toujours en ISO (UTC) — le DatePipe saura formater
  const iso = v.dateHeure
    ? new Date(v.dateHeure as string).toISOString()
    : new Date().toISOString();

  const appointment: Appointment = {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    objet,
    dateHeure: iso,
    lieu: (v.lieu ?? '').toString().trim() || undefined,
    statut: (v.statut as RdvStatut) ?? 'Proposé',
    participants: v.participants ? [String(v.participants)] : undefined,
    demandeLiee: (v.demandeLiee ?? '').toString().trim() || null,
    description: (v.description ?? '').toString().trim() || null
  };

  this.formClosed.emit({ created: true, appointment });
}

  cancel()  { this.formClosed.emit({ created: false }); }
  closeForm(){ this.formClosed.emit({ created: false }); }
}
