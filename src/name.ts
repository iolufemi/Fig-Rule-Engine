'use strict';

export default class Name {
    declare name?: string;
    declare type?: string;
    declare data?: object | ((...args: unknown[]) => unknown);

    static #names: Record<string, Name> = {};

    constructor(name: string) {
        if (typeof name !== 'string') {
            throw new Error('name must be a string.');
        }
        this.setName = name;
    }

    set setName(name: string) {
        if (typeof name !== 'string') {
            throw new Error('name must be a string.');
        }
        if (!this.name) {
            this.name = name;
        } else {
            throw new Error('name already set.');
        }
    }

    get getName(): string {
        return this.name!;
    }

    set setType(type: string) {
        if (typeof type !== 'string') {
            throw new Error('type must be a string.');
        }
        this.type = type;
    }

    get getType(): string {
        return this.type!;
    }

    set setData(data: object | ((...args: unknown[]) => unknown)) {
        if (typeof data !== 'object' && typeof data !== 'function') {
            throw new Error('data must be an object or a function.');
        }
        this.data = data;
    }

    get getData(): object | ((...args: unknown[]) => unknown) | undefined {
        return this.data;
    }

    static save(nameObj: Name): Record<string, Name> {
        const isName = nameObj instanceof Name;
        if (!isName) {
            throw new Error('You can only save Name instances');
        }
        if (Name.#names[nameObj.getName]) {
            throw new Error('This name already exists');
        }
        Name.#names[nameObj.getName] = nameObj;
        return Name.#names;
    }

    static find(name: string): Name {
        if (typeof name !== 'string') {
            throw new Error('Name must be a string');
        }
        if (!Name.#names[name]) {
            throw new Error('name not found');
        }
        return Name.#names[name];
    }

    static findAll(): Record<string, Name> {
        return Name.#names;
    }

    static findByType(): Record<string, Array<{ name: string; type?: string; data?: object | ((...args: unknown[]) => unknown) }>> {
        return Object.entries(Name.#names).reduce((acc, [key, value]) => {
            const type = value.type ?? 'unknown';
            const item = { ...value, name: key };
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(item);
            return acc;
        }, {} as Record<string, Array<{ name: string; type?: string; data?: object | ((...args: unknown[]) => unknown) }>>);
    }

    static update(name: string, obj: { type?: string; data?: object | ((...args: unknown[]) => unknown) }): Name {
        if (typeof name !== 'string') {
            throw new Error('Name must be a string');
        }
        if (typeof obj !== 'object') {
            throw new Error('Update parameter must be an object');
        }
        if (!Name.#names[name]) {
            throw new Error('name not found');
        }
        if (obj.type) {
            Name.#names[name].setType = obj.type;
        }
        if (obj.data !== undefined) {
            Name.#names[name].setData = obj.data;
        }
        return Name.#names[name];
    }
}
