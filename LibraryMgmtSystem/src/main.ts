import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// Corrected to use your component name and path
import { App } from './app/app'; 
import { provideZoneChangeDetection } from '@angular/core';

// Corrected to bootstrap your 'App' component
bootstrapApplication(App, { 
  ...appConfig,
  providers: [
    ...appConfig.providers,
    // This line provides Zone.js to your application, fixing the error.
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
})
  .catch((err) => console.error(err));

