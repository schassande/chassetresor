export interface Response {
    error: {
        errorCode: number;
        code?: string;
        error: any;
    };
}
export interface ResponseWithData<D> extends Response {
    data: D;
}
