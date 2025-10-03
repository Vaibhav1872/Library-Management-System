import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

// 1. Import the necessary function
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // 2. Add this line to the providers array
    provideHttpClient() 
  ]
};
