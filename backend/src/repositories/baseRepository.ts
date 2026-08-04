/**
 * Base Abstract Repository Pattern Interface & Infrastructure (SPR-304 / ARCH-002)
 */

import { ParsedPagination, PaginationMeta, buildPaginationMeta } from '../utils/pagination';

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export abstract class BaseRepository<T, ID = string> {
  abstract findById(id: ID): Promise<T | null>;
  abstract findMany(filter?: Record<string, any>): Promise<T[]>;
  abstract create(data: Partial<T>): Promise<T>;
  abstract update(id: ID, data: Partial<T>): Promise<T | null>;
  abstract delete(id: ID): Promise<boolean>;
  abstract count(filter?: Record<string, any>): Promise<number>;
  abstract paginate(pagination: ParsedPagination, filter?: Record<string, any>): Promise<PaginatedResult<T>>;
}
