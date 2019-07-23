import { Response } from './response';
import { ModifiableData } from './LocalDatabaseService';
import { PersistentData } from './../model/common';
import { Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';

/**
 * Service permitting to store persistent objects locally for disconnected mode.
 * The service isolates the data by a sort of tables using a table name.
 * Each table must contain the same type of object. These object must be PersistentData object.
 * Each table contains 3 lists of objects :
 * - The non modified objects,
 * - The modified objects,
 * - The removed objects.
 *
 * @Author: S.Chassande
 */
@Injectable()
export class LocalDatabaseService {

    constructor(private storage: Storage) { }

    /** Retrieves all the data of a table */
    public getModifiableData<D extends PersistentData>(tableName: string): Observable<ModifiableData<D>> {
        return from(this.storage.get(tableName));
    }

    /** Sets all the data of a table */
    public setModifiableData<D extends PersistentData>(tableName: string, md: ModifiableData<D>): Observable<ModifiableData<D>> {
        return from(this.storage.set(tableName, md))
            .pipe(map(() => md));
    }

    public clear(tableName): Observable<Response> {
        return from(
            this.storage.get(tableName).then((md: ModifiableData<any>) => {
                if (md) {
                    md.modified.clear();
                    md.unmodified.clear();
                    md.removed.clear();
                    this.storage.set(tableName, md);
                }
                const res: Response = { error: null};
                return res;
            })
        );
    }
    /**
     * Gets a persistent object from the table name and the object identifier.
     * @param tableName the name of the table.
     * @param id the identifier of the expected persistent object.
     * @return an Observable having one event which is the persistent object or null (if does not exist).
     */
    public get<D extends PersistentData>(tableName: string, id: string): Observable<D> {
        return from(
            this.storage.get(tableName).then((md: ModifiableData<D>) => {
                if (md) {
                    let val: D = md.unmodified.get(id);
                    if (!val) {
                        val = md.modified.get(id);
                    }
                    return val ? val : null;
                } else {
                    return null;
                }
            })
        );
    }

    /**
     * Stores a persistent object into the local storage.
     * @param tableName the name of the table.
     * @param data is the persistent object to store in the local storage
     * @return an Observable having one event which is the persistent object or null (if does not exist).
     */
    public set<D extends PersistentData>(tableName: string, data: D): Observable<D> {
        return from(
            this.storage.get(tableName)
                .then((md: ModifiableData<D>) => {
                    if (!md) {
                        // console.log('Create ModifiableData');
                        md = {
                            unmodified : new Map<string, D>(),
                            modified : new Map<string, D>(),
                            removed: new Map<string, D>()
                        };
                    }
                    // console.log(data.id, data.dataStatus);
                    switch (data.dataStatus) {
                        case 'CLEAN':
                            md.unmodified.set(data.id, data);
                            md.modified.delete(data.id);
                            md.removed.delete(data.id);
                            break;
                        case 'REMOVED':
                            md.removed.set(data.id, data);
                            md.modified.delete(data.id);
                            md.unmodified.delete(data.id);
                            break;
                        case 'NEW':
                        case 'DIRTY':
                            md.modified.set(data.id, data);
                            md.removed.delete(data.id);
                            md.unmodified.delete(data.id);
                            break;
                    }
                    return this.storage.set(tableName, md);
                }).then(() => {
                    // this.get(tableName, data.id).subscribe((d) => console.log(d.id, 'saved.'));
                    return data;
                })
        );
    }

    /**
     * Marks as deleted a persistent object into the local storage.
     * @param tableName the name of the table.
     * @param data is the persistent object to mark as deleted in the local storage
     * @return an Observable having one event which is the persistent object or null (if does not exist).
     */
    public markAsDeleted<D extends PersistentData>(tableName: string, data: D): Observable<D> {
        return from(
            this.storage.get(tableName).then((md: ModifiableData<D>) => {
                if (!md || !(md.modified instanceof Map)) {
                    console.log('markAsDeleted Create md');
                    md = {
                        unmodified : new Map<string, D>(),
                        modified : new Map<string, D>(),
                        removed : new Map<string, D>(),
                    };
                }
                md.modified.delete(data.id);
                md.removed.set(data.id, data);
                return this.storage.set(tableName, md);
            }).then(() => data)
        );
    }

    public remove<D extends PersistentData>(tableName: string, data: D): Observable<D> {
        return from(
            this.storage.get(tableName)
                .then((md: ModifiableData<D>) => {
                    // console.log('LocalDatabaseService.remove(' + tableName + ', ' + data.id + '): md='+md);
                    if (md) {
                        let removed = false;
                        removed = md.unmodified.delete(data.id) || removed;
                        removed = md.modified.delete(data.id)   || removed;
                        removed = md.removed.delete(data.id)    || removed;
                        // console.log('LocalDatabaseService.remove(' + tableName + ', ' + data.id + '): removed='+removed);
                    }
                    return this.storage.set(tableName, md);
                }).then((md) => data)
        );
    }
}

export interface ModifiableData<D extends PersistentData> {
    unmodified: Map<string, D>;
    modified: Map<string, D>;
    removed: Map<string, D>;
}
