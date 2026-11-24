import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Incident,
  IncidentInput,
  IncidentPriority,
  IncidentStatus
} from './models/incident.model';
import { IncidentService } from './services/incident.service';

type DialogMode = 'create' | 'edit' | 'view' | 'delete' | null;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  incidents: Incident[] = [];
  searchTerm = '';
  priorityFilter: IncidentPriority | 'Todas' = 'Todas';
  statusFilter: IncidentStatus | 'Todos' = 'Todos';
  dialogMode: DialogMode = null;
  selectedIncident: Incident | null = null;
  errorMessage = '';
  successMessage = '';
  formValue: IncidentInput = this.emptyForm();

  readonly priorities: IncidentPriority[] = ['Alta', 'Media', 'Baja'];
  readonly statuses: IncidentStatus[] = ['Pendiente', 'En proceso', 'Resuelta'];

  constructor(private readonly incidentService: IncidentService) {}

  ngOnInit(): void {
    this.refresh();
  }

  get filteredIncidents(): Incident[] {
    const query = this.searchTerm.trim().toLocaleLowerCase('es');
    return this.incidents.filter((incident) => {
      const matchesTitle = !query || incident.title.toLocaleLowerCase('es').includes(query);
      const matchesPriority = this.priorityFilter === 'Todas' || incident.priority === this.priorityFilter;
      const matchesStatus = this.statusFilter === 'Todos' || incident.status === this.statusFilter;
      return matchesTitle && matchesPriority && matchesStatus;
    });
  }

  get openCount(): number {
    return this.incidents.filter((incident) => incident.status !== 'Resuelta').length;
  }

  get pendingCount(): number {
    return this.incidents.filter((incident) => incident.status === 'Pendiente').length;
  }

  get inProgressCount(): number {
    return this.incidents.filter((incident) => incident.status === 'En proceso').length;
  }

  get resolvedCount(): number {
    return this.incidents.filter((incident) => incident.status === 'Resuelta').length;
  }

  openCreate(): void {
    this.clearMessages();
    this.selectedIncident = null;
    this.formValue = this.emptyForm();
    this.dialogMode = 'create';
  }

  openEdit(incident: Incident): void {
    this.clearMessages();
    this.selectedIncident = incident;
    this.formValue = {
      title: incident.title,
      description: incident.description,
      priority: incident.priority,
      status: incident.status,
      responsible: incident.responsible
    };
    this.dialogMode = 'edit';
  }

  openView(incident: Incident): void {
    this.clearMessages();
    this.selectedIncident = incident;
    this.dialogMode = 'view';
  }

  openDelete(incident: Incident): void {
    this.clearMessages();
    this.selectedIncident = incident;
    this.dialogMode = 'delete';
  }

  closeDialog(): void {
    this.dialogMode = null;
    this.selectedIncident = null;
  }

  saveIncident(): void {
    this.clearMessages();
    const input: IncidentInput = {
      ...this.formValue,
      title: this.formValue.title.trim(),
      description: this.formValue.description.trim(),
      responsible: this.formValue.responsible.trim()
    };
    if (!input.title || !input.description || !input.responsible) {
      this.errorMessage = 'Completa todos los campos obligatorios antes de guardar.';
      return;
    }

    try {
      if (this.dialogMode === 'edit' && this.selectedIncident) {
        this.incidentService.update(this.selectedIncident.id, input);
        this.successMessage = 'La incidencia se actualizó correctamente.';
      } else {
        this.incidentService.create(input);
        this.successMessage = 'La incidencia se registró correctamente.';
      }
      this.refresh();
      this.closeDialog();
    } catch (error) {
      this.errorMessage = this.errorText(error, 'No se pudo guardar la incidencia.');
    }
  }

  confirmDelete(): void {
    if (!this.selectedIncident) {
      return;
    }
    this.clearMessages();
    try {
      this.incidentService.delete(this.selectedIncident.id);
      this.refresh();
      this.closeDialog();
      this.successMessage = 'La incidencia se eliminó correctamente.';
    } catch (error) {
      this.errorMessage = this.errorText(error, 'No se pudo eliminar la incidencia.');
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.priorityFilter = 'Todas';
    this.statusFilter = 'Todos';
  }

  trackById(_index: number, incident: Incident): string {
    return incident.id;
  }

  private refresh(): void {
    try {
      this.incidents = this.incidentService.list();
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.errorText(error, 'No se pudieron cargar las incidencias.');
    }
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private errorText(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }

  private emptyForm(): IncidentInput {
    return {
      title: '',
      description: '',
      priority: 'Media',
      status: 'Pendiente',
      responsible: ''
    };
  }
}
