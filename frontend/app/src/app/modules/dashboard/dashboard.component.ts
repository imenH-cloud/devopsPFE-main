import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../services/api.service';

export interface StatCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface ChartData {
  labels: string[];
  datasets: any[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatProgressBarModule,
    BaseChartDirective,
  ],
  template: `
    <div class="dashboard-container">
      <!-- Statistics Cards -->
      <mat-grid-list [cols]="4" rowHeight="150px" class="stats-grid">
        <mat-grid-tile *ngFor="let stat of stats">
          <mat-card class="stat-card" [class.high]="stat.trend?.isPositive">
            <div class="stat-content">
              <div class="stat-header">
                <h3>{{ stat.title }}</h3>
                <mat-icon [ngStyle]="{ color: stat.color }">{{
                  stat.icon
                }}</mat-icon>
              </div>
              <div class="stat-value">
                {{ stat.value }}
              </div>
              <div class="stat-subtitle" *ngIf="stat.subtitle">
                {{ stat.subtitle }}
              </div>
              <div class="stat-trend" *ngIf="stat.trend">
                <mat-icon
                  [ngClass]="{
                    'trend-up': stat.trend.isPositive,
                    'trend-down': !stat.trend.isPositive
                  }"
                  >{{
                    stat.trend.isPositive
                      ? 'trending_up'
                      : 'trending_down'
                  }}</mat-icon
                >
                <span>{{ Math.abs(stat.trend.value) }}%</span>
              </div>
            </div>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <!-- Charts -->
      <div class="charts-grid">
        <!-- User Growth Chart -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Croissance Utilisateurs</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas
              baseChart
              type="line"
              [data]="userGrowthChart"
              [options]="chartOptions"
            ></canvas>
          </mat-card-content>
        </mat-card>

        <!-- Activity Distribution Chart -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Distribution Activités</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas
              baseChart
              type="doughnut"
              [data]="activityChart"
              [options]="chartOptions"
            ></canvas>
          </mat-card-content>
        </mat-card>

        <!-- API Performance Chart -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Performance API</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas
              baseChart
              type="bar"
              [data]="performanceChart"
              [options]="chartOptions"
            ></canvas>
          </mat-card-content>
        </mat-card>

        <!-- Platform Usage Chart -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Utilisation Plateforme</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas
              baseChart
              type="radar"
              [data]="usageChart"
              [options]="chartOptions"
            ></canvas>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 24px;
        gap: 24px;
        display: flex;
        flex-direction: column;
      }

      .stats-grid {
        gap: 16px;
      }

      .stat-card {
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        border-radius: 12px;
      }

      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .stat-card.high {
        border-left: 4px solid #4caf50;
      }

      .stat-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        padding: 16px;
      }

      .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .stat-value {
        font-size: 28px;
        font-weight: 600;
        margin: 8px 0;
      }

      .stat-subtitle {
        font-size: 12px;
        color: #999;
      }

      .stat-trend {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        font-weight: 500;
      }

      .trend-up {
        color: #4caf50;
      }

      .trend-down {
        color: #f44336;
      }

      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 24px;
      }

      .chart-card {
        border-radius: 12px;
        overflow: hidden;
      }

      mat-card-header {
        padding: 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      mat-card-content {
        padding: 24px 16px;
        height: 300px;
      }

      @media (max-width: 1200px) {
        .charts-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 600px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  stats: StatCard[] = [];
  userGrowthChart: ChartConfiguration['data'] = { labels: [], datasets: [] };
  activityChart: ChartConfiguration['data'] = { labels: [], datasets: [] };
  performanceChart: ChartConfiguration['data'] = { labels: [], datasets: [] };
  usageChart: ChartConfiguration['data'] = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  Math = Math;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.stats = [
      {
        title: 'Utilisateurs Actifs',
        value: '2,543',
        subtitle: 'Connectés aujourd\'hui',
        icon: 'people',
        color: '#6750a4',
        trend: { value: 12, isPositive: true },
      },
      {
        title: 'Cours Actifs',
        value: '48',
        subtitle: 'En progression',
        icon: 'school',
        color: '#f4a261',
        trend: { value: 5, isPositive: true },
      },
      {
        title: 'Tâches Complétées',
        value: '1,234',
        subtitle: 'Cette semaine',
        icon: 'check_circle',
        color: '#2a9d8f',
        trend: { value: 8, isPositive: true },
      },
      {
        title: 'Uptime Système',
        value: '99.98%',
        subtitle: 'Dernier mois',
        icon: 'cloud_done',
        color: '#07a0c3',
        trend: { value: 0.02, isPositive: true },
      },
    ];

    this.userGrowthChart = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
      datasets: [
        {
          label: 'Utilisateurs',
          data: [1200, 1500, 1800, 2100, 2300, 2543],
          borderColor: '#6750a4',
          backgroundColor: 'rgba(103, 80, 164, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    };

    this.activityChart = {
      labels: ['Cours', 'Devoirs', 'Tests', 'Discussions'],
      datasets: [
        {
          data: [35, 25, 25, 15],
          backgroundColor: [
            '#6750a4',
            '#f4a261',
            '#2a9d8f',
            '#07a0c3',
          ],
        },
      ],
    };

    this.performanceChart = {
      labels: ['Gateway', 'Auth', 'User', 'Classroom', 'Activity'],
      datasets: [
        {
          label: 'Latence (ms)',
          data: [45, 38, 52, 41, 35],
          backgroundColor: 'rgba(103, 80, 164, 0.5)',
        },
      ],
    };

    this.usageChart = {
      labels: ['Web', 'Mobile', 'API', 'Admin', 'Analytics'],
      datasets: [
        {
          label: 'Utilisation',
          data: [65, 45, 78, 32, 55],
          borderColor: '#6750a4',
          backgroundColor: 'rgba(103, 80, 164, 0.2)',
        },
      ],
    };
  }
}
