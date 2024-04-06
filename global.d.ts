type Nullable<T> = T | undefined | null;
type Nullish<T> = T | null;
type DateLike = Date | number;
type Undefinable<T> = T | undefined;

/**
 * Returns optional keys of an object.
 */
type OptionalPropertiesOf<T extends object> = Exclude<{
	[K in keyof T]: T extends Record<K, T[K]>
		? never
		: K
}[keyof T], undefined>

/**
 * Returns an object containing only optional fields/
 */
type RecordWithOptionals<T extends object> = Pick<T, OptionalPropertiesOf<T>>;
