import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { routes } from './app-routes';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ShellComponent } from './_shell/shell.component';
import { SideNavComponent } from './_shell/components/side-nav/side-nav.component';
import { HeaderComponent } from './_shell/components/header/header.component';
import { FooterComponent } from './_shell/components/footer/footer.component';
import { AppInitService } from './app-init.service';
import { AuthInterceptor } from './_interceptors/auth.interceptor';
import { GraphQLModule } from './graphql.module';
import { UserBadgeComponent } from './_shell/components/user-badge/user-badge.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function initializeApp(appInitService: AppInitService) {
  return () => appInitService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,
    SideNavComponent,
    HeaderComponent,
    FooterComponent,
    UserBadgeComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    RouterModule.forRoot(routes, { useHash: true }),
    HttpClientModule,
    BrowserAnimationsModule,
    GraphQLModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
