import { Observable } from 'rxjs';
import { Response, ResponseWithData } from './response';

export interface Crud<O> {
    get(id: string): Observable<ResponseWithData<O>>;
    save(obj: O): Observable<ResponseWithData<O>>;
    all(): Observable<ResponseWithData<O[]>>;
    delete(id: string): Observable<Response>;

}
