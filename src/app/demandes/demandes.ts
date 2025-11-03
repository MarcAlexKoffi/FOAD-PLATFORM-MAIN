import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-demandes',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './demandes.html',
  styleUrls: ['./demandes.scss'],
})
export class Demandes {
  searchTerm: string = '';

  demandes = [
    {
      id: 1,
      titre: 'Création du module « Marketing Digital »',
      demandeur: 'Jean Dupont',
      statut: 'En cours',
      dateCreation: '15/10/2023',
      dateMAJ: '18/10/2023',
    },
    {
      id: 2,
      titre: 'Mise à jour du cours « Introduction à la Finance »',
      demandeur: 'Marie Curie',
      statut: 'Validé',
      dateCreation: '12/10/2023',
      dateMAJ: '16/10/2023',
    },
    {
      id: 3,
      titre: 'Support technique pour la vidéo du module 3',
      demandeur: 'Pierre Martin',
      statut: 'Rejeté',
      dateCreation: '11/10/2023',
      dateMAJ: '12/10/2023',
    },
    {
      id: 4,
      titre: 'Création de QCM pour « Biologie Cellulaire »',
      demandeur: 'Élise Lambert',
      statut: 'En attente',
      dateCreation: '10/10/2023',
      dateMAJ: '10/10/2023',
    },
    {
      id: 5,
      titre: 'Mise à jour des ressources du cours « Histoire de l’Art »',
      demandeur: 'Lucas Moreau',
      statut: 'Validé',
      dateCreation: '08/10/2023',
      dateMAJ: '11/10/2023',
    },
  ];

  get filteredDemandes() {
    const term = this.searchTerm.toLowerCase();
    return this.demandes.filter((d) =>
      d.titre.toLowerCase().includes(term) ||
      d.demandeur.toLowerCase().includes(term)
    );
  }
}
