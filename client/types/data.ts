import { Primitive } from 'type-fest';

// Recursively convert object date fields to string
// NOTE: this is needed since Prisma returns dates as Date objects
// which are not JSON serializable by default
export type ConvertDateFields<T> = T extends Date
  ? string
  : {
      [k in keyof T]: undefined extends T[k]
        ? T[k] extends Primitive
          ? T[k]
          : ConvertDateFields<T[k]>
        : T[k] extends object
        ? ConvertDateFields<T[k]>
        : T[k] extends Array<infer A>
        ? Array<ConvertDateFields<A>>
        : T[k] extends Date
        ? string
        : T[k];
    };
