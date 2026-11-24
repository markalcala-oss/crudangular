export type IncidentPriority = 'Alta' | 'Media' | 'Baja';
export type IncidentStatus = 'Pendiente' | 'En proceso' | 'Resuelta';

export interface Incident {
  id: string;
  code: string;
  title: string;
  description: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  responsible: string;
  createdAt: string;
}

export type IncidentInput = Omit<Incident, 'id' | 'code' | 'createdAt'>;

export interface IncidentStore {
  incidents: Incident[];
  nextCode: number;
}
