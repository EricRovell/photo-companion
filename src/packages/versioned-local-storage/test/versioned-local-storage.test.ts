// @vitest-environment happy-dom

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Storage } from "../src";

const STORAGE_NAME = "TEST_STORAGE";
const STORAGE_VERSION = 7;
const STORAGE_VERSION_STRING = STORAGE_VERSION.toString();
const STORAGE_VERSIONED_KEY = `${STORAGE_NAME}:${STORAGE_VERSION}`;

const TEST_OBJECT = {
	arr: [ "hello", "world" ],
	bool: false,
	int: 1,
	str: "hi!"
};

const TEST_OBJECT_STRING = JSON.stringify(TEST_OBJECT);

const clearSpy = vi.spyOn(localStorage, "clear");
const getItemSpy = vi.spyOn(localStorage, "getItem");
const removeItemSpy = vi.spyOn(localStorage, "removeItem");
const setItemSpy = vi.spyOn(localStorage, "setItem");

describe("Versioned Local Storage", () => {
	beforeAll(() => {
		localStorage.clear();
		clearSpy.mockClear();
		getItemSpy.mockClear();
		removeItemSpy.mockClear();
		setItemSpy.mockClear();
	});
	afterEach(() => {
		localStorage.clear();
		clearSpy.mockClear();
		getItemSpy.mockClear();
		removeItemSpy.mockClear();
		setItemSpy.mockClear();
	});

	describe("Versioning", () => {
		it("Accepts name and version via constructor", () => {
			const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);
		
			expect(storage.name).toBe(STORAGE_NAME);
			expect(storage.version).toBe(STORAGE_VERSION);
		});
		it("Stores version number", () => {
			new Storage(STORAGE_NAME, STORAGE_VERSION);
	
			expect(setItemSpy).toHaveBeenCalledOnce();
			expect(setItemSpy).toBeCalledWith(STORAGE_NAME, STORAGE_VERSION_STRING);
		});
		it("Uses the existing version when the version is not specified", () => {
			// @ts-expect-error: Actually, there should be a number
			getItemSpy.mockImplementationOnce(key => {
				expect(key).toBe(STORAGE_NAME);
				return STORAGE_VERSION;
			});
		
			const storage = new Storage(STORAGE_NAME);
			
			expect(storage.version).toBe(STORAGE_VERSION);
	
			getItemSpy.mockImplementationOnce((key) => {
				expect(key).toBe(STORAGE_VERSIONED_KEY);
				return TEST_OBJECT_STRING;
			});
		
			const json = storage.read();
			expect(json).toEqual(TEST_OBJECT);
		});
		it("Will throw if there is no existing version when version is not specified", () => {
			// @ts-expect-error: for testing purposes
			getItemSpy.mockImplementationOnce(key => {
				expect(key).toBe(STORAGE_NAME);
				return undefined;
			});
	
			expect(() => new Storage(STORAGE_NAME)).toThrow();
		});
		it("Will throw if version is a negative number", () => {
			expect(() => new Storage(STORAGE_NAME, -STORAGE_VERSION)).toThrow();
		});
		it("Will throw if existing version is corrupted", () => {
			getItemSpy.mockImplementationOnce(key => {
				expect(key).toBe(STORAGE_NAME);
				return `ABC${STORAGE_VERSION}`;
			});
	
			expect(() => new Storage(STORAGE_NAME, STORAGE_VERSION)).toThrow();
		});
	});
	describe("Reading", () => {
		it("Can read object from storage", () => {
			const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);
	
			getItemSpy.mockImplementationOnce(key => {
				expect(key).toBe(STORAGE_VERSIONED_KEY);
	
				return TEST_OBJECT_STRING;
			});
	
			expect(storage.read()).toEqual(TEST_OBJECT);
		});
	});
	describe("Writing", () => {
		it("Can write object to storage", () => {
			const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);
			storage.write(TEST_OBJECT);
	
			expect(setItemSpy).toBeCalledTimes(2);
			expect(setItemSpy).toHaveBeenLastCalledWith(STORAGE_VERSIONED_KEY, TEST_OBJECT_STRING);
		});
	});
	describe("Purging", () => {
		it("Clears storage after version bumping", () => {
			getItemSpy.mockImplementationOnce(key => {
				expect(key).toBe(STORAGE_NAME);
	
				return STORAGE_VERSION_STRING;
			});
	
			new Storage(STORAGE_NAME, STORAGE_VERSION + 1);
	
			expect(removeItemSpy).toHaveBeenCalledOnce();
			expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_VERSIONED_KEY);
		});
		it("Clears storage if data is corrupted", () => {
			const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);
	
			getItemSpy.mockImplementationOnce((key) => {
				expect(key).toBe(STORAGE_VERSIONED_KEY);
				return `//${STORAGE_VERSION}`;
			});
		
			removeItemSpy.mockClear();
	
			const object = storage.read();
			expect(object).toBeNull();
	
			expect(removeItemSpy).toHaveBeenCalledOnce();
			expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_VERSIONED_KEY);
		});
		it("Can purge all the data", () => {
			Storage.reset();
			expect(clearSpy).toHaveBeenCalledOnce();
		});
	});
	describe("Errors", () => {
		it("setItem", () => {
			const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);
	
			setItemSpy.mockImplementationOnce(() => { throw new Error(); });
			expect(() => storage.write(TEST_OBJECT)).toThrow();
		});
		it("removeItem", () => {
			removeItemSpy.mockImplementationOnce(() => { throw new Error(); });
			expect(() => new Storage(STORAGE_NAME, STORAGE_VERSION + 1)).toThrow();
		});
		it("getItem", () => {
			getItemSpy.mockImplementationOnce(() => { throw new Error(); });
			expect(() => new Storage(STORAGE_NAME, STORAGE_VERSION)).toThrow();
		});
		it("clear", () => {
			clearSpy.mockImplementationOnce(() => { throw new Error(); });
			expect(() => Storage.reset()).toThrow();
		});
	});
});
