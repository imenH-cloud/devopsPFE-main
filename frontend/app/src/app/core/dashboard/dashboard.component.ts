import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {

  // Statistiques
  stats = [
    { label: 'Enfants autistes', value: '24', icon: '👧', color: 'pink' },
    { label: 'Parents accompagnés', value: '18', icon: '👨‍👩‍👧', color: 'blue' },
    { label: 'Intervenants', value: '12', icon: '🧩', color: 'yellow' },
    { label: 'Activités', value: '156', icon: '📊', color: 'green' }
  ];

  // Services/Modules
  services = [
    {
      id: 1,
      title: 'Parents accompagnés',
      description: 'Gérer les parents et leur suivi',
      icon: '👨‍👩‍👧',
      color: 'blue',
      route: '/parent',
      emoji: '👨‍👩‍👧'
    },
    {
      id: 2,
      title: 'Enfants autistes',
      description: 'Suivre les enfants en difficulté',
      icon: '👧',
      color: 'pink',
      route: '/student',
      emoji: '👧'
    },
    {
      id: 3,
      title: 'Activités & Suivi',
      description: 'Enregistrer les activités et le progress',
      icon: '📊',
      color: 'green',
      route: '/activity',
      emoji: '📊'
    },
    {
      id: 4,
      title: 'Intervenants spécialisés',
      description: 'Gérer les intervenants et leurs tâches',
      icon: '🧩',
      color: 'yellow',
      route: '/teacher',
      emoji: '🧩'
    },
    {
      id: 5,
      title: 'Classes/Groupes',
      description: 'Organiser les groupes de travail',
      icon: '🏫',
      color: 'pink',
      route: '/classroom',
      emoji: '🏫'
    },
    {
      id: 6,
      title: 'Gestion utilisateurs',
      description: 'Gérer les utilisateurs du système',
      icon: '👥',
      color: 'gray',
      route: '/user',
      emoji: '👥'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Déterminer la classe couleur de la card
  getCardColorClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      'blue': 'border-blue-300 bg-blue-50 dark:bg-blue-900/20',
      'pink': 'border-pink-300 bg-pink-50 dark:bg-pink-900/20',
      'yellow': 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20',
      'green': 'border-green-300 bg-green-50 dark:bg-green-900/20',
      'gray': 'border-gray-300 bg-gray-50 dark:bg-gray-900/20'
    };
    return colorMap[color] || colorMap['blue'];
  }

  // Déterminer la classe couleur du texte
  getTextColorClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      'blue': 'text-blue-600 dark:text-blue-400',
      'pink': 'text-pink-600 dark:text-pink-400',
      'yellow': 'text-yellow-600 dark:text-yellow-400',
      'green': 'text-green-600 dark:text-green-400',
      'gray': 'text-gray-600 dark:text-gray-400'
    };
    return colorMap[color] || colorMap['blue'];
  }

}
