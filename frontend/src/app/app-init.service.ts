import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(private translate: TranslateService) {
  }

  init() {
    this.setLocale(environment.defaultLanguage);
  }

  setLocale(lang: string) {
    this.translate.use(lang);
    moment.locale(lang);
  }
}
