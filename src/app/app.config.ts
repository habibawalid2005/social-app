import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth/interceptors/auth-interceptor';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { errorInterceptor } from './core/auth/interceptors/error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    
      provideAnimations(),
      provideToastr(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,withInMemoryScrolling({scrollPositionRestoration:"top"}),withViewTransitions(),withHashLocation()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor])
    )
  ]
};
