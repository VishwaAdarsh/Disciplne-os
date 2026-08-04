/**
 * Standard Pagination Utilities (SPR-304 / ARCH-002)
 */

import { DEFAULT_PAGINATION } from '../constants';

export interface PaginationQuery {
  page?: string | number;
  limit?: string | number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
  sort: string;
  order: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function getPaginationParams(query: PaginationQuery = {}): ParsedPagination {
  const rawPage = Number(query.page) || DEFAULT_PAGINATION.PAGE;
  const rawLimit = Number(query.limit) || DEFAULT_PAGINATION.LIMIT;

  const page = Math.max(1, rawPage);
  const limit = Math.min(DEFAULT_PAGINATION.MAX_LIMIT, Math.max(1, rawLimit));
  const skip = (page - 1) * limit;
  const sort = typeof query.sort === 'string' && query.sort.trim() ? query.sort.trim() : 'created_at';
  const order = query.order === 'asc' ? 'asc' : 'desc';

  return { page, limit, skip, sort, order };
}

export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit) || 0;
  return {
    page,
    limit,
    total,
    totalPages,
  };
}
