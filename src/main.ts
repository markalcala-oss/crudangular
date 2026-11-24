import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AppComponent } from './app/app.component';

registerLocaleData(localeEs);

bootstrapApplication(AppComponent).catch((error: unknown) => {
  console.error('No se pudo iniciar la aplicación.', error);
});
