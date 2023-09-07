type KeyType<T> = T extends Map<infer K, any> ? K : never;
type ValueType<T> = T extends Map<any, infer V> ? V : never;
export type ToReadonlyMap<M> = ReadonlyMap<KeyType<M>, ValueType<M>>;
