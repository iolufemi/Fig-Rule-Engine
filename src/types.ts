/**
 * Shared types for the Fig Rule Engine.
 */

export interface ActionParams {
    action: string;
    value: unknown;
    dataPath: string;
}

export interface ConditionShape {
    fact?: string;
    operator?: string;
    value?: unknown;
    path?: string;
    params?: Record<string, unknown>;
}

export type FactData = Record<string, unknown> | ((params: unknown, almanac: unknown) => unknown);
