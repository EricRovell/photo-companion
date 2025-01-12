# Versioned Local Storage

Browser `localStorage` wrapper to support versioning.

Important: stores data in JSON format.

## Usage

Create a new storage using the `Storage` constructor. Name of the storage an optional version value should be provided. Use generics to provide the type of the stored data.

```ts
import { Storage } from "versioned-local-storage";

interface Data {
	theme: "light" | "dark";
}

const storage = new Storage<Data>("theme", 1);

storage.write({
	theme: "dark";
});

const data = storage.read();

console.log(data); // -> { theme: "dark" }
```

## Versioning

Assuming the storage name value is `name` the versioning works in such a way that two pieces of information is stored via local storage:

1. The version number stored as `name`: `version`;
2. The data stored as `{name}:{version}`: `data`;

When a storage schema is changed and no longer compatible, update the version value. Old data will be purged.

The storage creation flow:

### No version provided

The previous `version` is taken from the storage:

- it exists and is a valid integer value — nothing happens, the storage is successfully created;
- it is a `NaN` value, **the error is thrown**;

### Version is provided

- The value is checked to be a non nullish value and a positive integer;
- The previous version value is checked to exist;
- If the previous version non-existent, it fallbacks to zero;
- If the previous version exists and it is a `NaN` value — **the error is thrown`;
- If the previous version exists and it is a valid number the provided version is compared with the previous;
- If the provided version is larger than previous, the old data is deleted and the version is updated in local storage;

## Migration

To migrate data from the previous storage schema use this example:

```ts
import { Storage } from "versioned-local-storage";

let storage: Storage;

try {
	// Get the storage of existing version
	storage = new Storage("name");

	switch (storage.version) {
		case 1:
			// Read v1 settings, migrate it to v3 schema and store it
			break;
		case 2:
			// Read v2 settings, migrate it to v3 schema and store it
			break;
		default:
			throw new Error("Incompatible legacy storage schema");
	}
} catch (error) {
	// Start from scratch if not migratable
	storage = new Storage('settings', 3); 
}
```

## API

### Constructor

To create a storage instance there are two parameters: the required storage name and optional version (positive integer):

```ts
import { Storage } from "versioned-local-storage";

interface Data {
	theme: "light" | "dark";
}

const storage = new Storage<Data>("theme", 1);
```

### `key` getter

Returns a local storage key where the data is used. The format is `{name}:{version}`. Used internally, but is available for use if needed.

```ts
import { Storage } from "versioned-local-storage";

interface Data {
	theme: "light" | "dark";
}

const storage = new Storage<Data>("theme", 1);

const key = storage.key; // -> "theme:1"
```

### `read()`

Reads the data from a given storage instance:

```ts
import { Storage } from "versioned-local-storage";

interface Data {
	theme: "light" | "dark";
}

const storage = new Storage<Data>("theme", 1);

const data = storage.read(); // -> { theme: "dark" }
```

The data is serialized by `JSON.parse()` under the hood.

### `Storage.reset()`

The `reset()` is a static method available in `Storage`. It clears all the data across all named storages.

```ts
import { Storage } from "versioned-local-storage";

Storage.reset();
```

### `write()`

Writes a data to the given storage:

```ts
import { Storage } from "versioned-local-storage";

interface Data {
	theme: "light" | "dark";
}

const storage = new Storage<Data>("theme", 1);

const data = storage.write({
	theme: "light";
});
```
