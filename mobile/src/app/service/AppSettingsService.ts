import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalAppSettings } from './../model/settings';
import { Injectable } from '@angular/core';
import { LocalSingletonDataService } from './LocalSingletonDataService';
import { environment } from '../../environments/environment';

@Injectable()
export class AppSettingsService extends LocalSingletonDataService<LocalAppSettings> {

    constructor(storage: Storage) {
        super(storage, 'LocalAppSettings');
    }

    public get(): Observable<LocalAppSettings> {
        return super.get().pipe(
            map((las: LocalAppSettings) => {
                let result: LocalAppSettings = las;
                if (!result) {
                    result = {
                        apiKey: environment.firebase.apiKey,
                        serverUrl: environment.firebase.databaseURL,
                        lastUserEmail: null,
                        lastUserPassword: null,
                        forceOffline: false,
                        nbPeriod: 2
                    };
                    super.save(result);
                }
                if (!result.nbPeriod) {
                    result.nbPeriod = 2;
                }
                return result;
            })
        );
    }

    public setLastUser(email: string, password: string) {
        this.get().subscribe((setting: LocalAppSettings) => {
            setting.lastUserEmail = email;
            setting.lastUserPassword = password;
            this.save(setting).subscribe();
        });
    }
    public setServerUrl(serverUrl: string) {
        this.get().subscribe((setting: LocalAppSettings) => {
            setting.serverUrl = serverUrl;
            this.save(setting).subscribe();
        });
    }
    public setApplicationVersion(applicationVersion: string) {
        this.get().subscribe((setting: LocalAppSettings) => {
            setting.applicationVersion = applicationVersion;
            this.save(setting).subscribe();
        });
    }
}
