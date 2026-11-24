import { Injectable } from '@angular/core';
import {
  Incident,
  IncidentInput,
  IncidentStore
} from '../models/incident.model';

const STORAGE_KEY = 'gestion-incidencias-v1';

const INITIAL_STORE: IncidentStore = {
  nextCode: 4,
  incidents: [
    {
      id: 'initial-1',
      code: 'INC-001',
      title: 'Falla de red Lab 04',
      description: 'Intermitencia en la conexión de red del laboratorio 04.',
      priority: 'Alta',
      status: 'En proceso',
      responsible: 'Carlos Ruiz',
      createdAt: '2026-11-23T09:00:00.000Z'
    },
    {
      id: 'initial-2',
      code: 'INC-002',
      title: 'Error acceso portal',
      description: 'No es posible iniciar sesión en el portal institucional.',
      priority: 'Media',
      status: 'Pendiente',
      responsible: 'Ana Torres',
      createdAt: '2026-11-23T10:30:00.000Z'
    },
    {
      id: 'initial-3',
      code: 'INC-003',
      title: 'Actualización Office',
      description: 'Actualizar el paquete Office en los equipos de aula.',
      priority: 'Baja',
      status: 'Resuelta',
      responsible: 'Luis Vega',
      createdAt: '2026-11-22T14:15:00.000Z'
    }
  ]
};

@Injectable({ providedIn: 'root' })
export class IncidentService {
  list(): Incident[] {
    const rawStore = localStorage.getItem(STORAGE_KEY);
    if (rawStore === null) {
      this.saveStore(INITIAL_STORE);
      return [...INITIAL_STORE.incidents];
    }

    const store: unknown = JSON.parse(rawStore);
    if (!this.isIncidentStore(store)) {
      throw new Error('Los datos guardados de incidencias tienen un formato inválido.');
    }
    return [...store.incidents];
  }

  create(input: IncidentInput): Incident {
    const store = this.readStore();
    const incident: Incident = {
      ...input,
      id: this.createId(),
      code: `INC-${String(store.nextCode).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    };
    this.saveStore({
      incidents: [incident, ...store.incidents],
      nextCode: store.nextCode + 1
    });
    return incident;
  }

  update(id: string, input: IncidentInput): Incident {
    const store = this.readStore();
    const existing = store.incidents.find((incident) => incident.id === id);
    if (!existing) {
      throw new Error('No se encontró la incidencia que deseas actualizar.');
    }

    const updated = { ...existing, ...input };
    this.saveStore({
      ...store,
      incidents: store.incidents.map((incident) => incident.id === id ? updated : incident)
    });
    return updated;
  }

  delete(id: string): void {
    const store = this.readStore();
    const remaining = store.incidents.filter((incident) => incident.id !== id);
    if (remaining.length === store.incidents.length) {
      throw new Error('No se encontró la incidencia que deseas eliminar.');
    }
    this.saveStore({ ...store, incidents: remaining });
  }

  private readStore(): IncidentStore {
    const rawStore = localStorage.getItem(STORAGE_KEY);
    if (rawStore === null) {
      this.saveStore(INITIAL_STORE);
      return { ...INITIAL_STORE, incidents: [...INITIAL_STORE.incidents] };
    }
    const store: unknown = JSON.parse(rawStore);
    if (!this.isIncidentStore(store)) {
      throw new Error('Los datos guardados de incidencias tienen un formato inválido.');
    }
    return store;
  }

  private saveStore(store: IncidentStore): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  private isIncidentStore(value: unknown): value is IncidentStore {
    if (typeof value !== 'object' || value === null || !('incidents' in value) || !('nextCode' in value)) {
      return false;
    }
    const store = value as IncidentStore;
    return Array.isArray(store.incidents) && Number.isInteger(store.nextCode);
  }

  private createId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
