# Mesa de ayuda — Gestión de incidencias

Aplicación web para registrar y dar seguimiento a incidencias institucionales. Está hecha con Angular y TypeScript, con una interfaz adaptable a computadoras y celulares.

## Requisitos

- Node.js y npm.

## Ejecutar el proyecto

En una terminal, dentro de la carpeta del proyecto:

```bash
npm install
npm start
```

Abre `http://localhost:4200` en el navegador. Para comprobar que el proyecto compila:

```bash
npm run build
```

## Qué puedes hacer

- **Crear:** registrar título, descripción, prioridad, estado y responsable.
- **Consultar:** abrir una incidencia para ver todos sus datos.
- **Editar:** actualizar los datos de una incidencia existente.
- **Eliminar:** borrar una incidencia después de confirmar la acción.
- **Buscar y filtrar:** encontrar incidencias por título, prioridad o estado.
- **Ver el resumen:** consultar cuántas incidencias están pendientes, en curso y resueltas.

Los campos de título, descripción y responsable son obligatorios. La prioridad puede ser alta, media o baja; el estado puede ser pendiente, en proceso o resuelta.

## Estructura del proyecto

```text
src/
├── app/
│   ├── models/
│   │   └── incident.model.ts       # Tipos y datos de una incidencia
│   ├── services/
│   │   └── incident.service.ts    # Crear, leer, actualizar y borrar datos
│   ├── app.component.ts           # Lógica de la pantalla
│   ├── app.component.html         # Contenido de la pantalla
│   └── app.component.css          # Diseño de la pantalla
├── index.html                     # Página inicial del navegador
├── main.ts                        # Inicio de Angular
└── styles.css                     # Estilos generales
```

## Cómo se guardan los datos

La pantalla llama a `IncidentService` para leer o cambiar las incidencias. El servicio las guarda en el almacenamiento local del navegador (`localStorage`), así que siguen ahí al cerrar y volver a abrir la página en el mismo navegador.

No hay servidor ni base de datos: los datos no se comparten entre navegadores o dispositivos. La primera vez aparecen tres incidencias de ejemplo.
