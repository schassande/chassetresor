import { Observable, from, of } from 'rxjs';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';

export abstract class LocalSingletonDataService<D extends any> {

    private data: D;

    constructor(protected storage: Storage, protected storageName: string) {
    }

    public get(): Observable<D> {
        if (this.data) {
            return of(this.data);
        } else {
            return from(this.storage.get(this.storageName));
        }
    }

    public save(data: D): Observable<D> {
        this.data = data;
        return from(this.storage.set(this.storageName, data))
            .pipe(map(() => data));
    }
    public delete(): Observable<any> {
        this.data = null;
        return from(this.storage.remove(this.storageName));
    }
}
