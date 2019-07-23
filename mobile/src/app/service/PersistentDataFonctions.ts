export interface PersistentDataUpdater<D> {
    (data: D): D;
}
export interface PersistentDataFilter<D> {
    (data: D): boolean;
}