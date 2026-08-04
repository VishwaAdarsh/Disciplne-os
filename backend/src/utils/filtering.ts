/**
 * Standard Filtering & Sorting Helpers (SPR-304 / ARCH-002)
 */

export interface FilterQuery {
  status?: string;
  category?: string;
  search?: string;
  q?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}

export interface ParsedFilter {
  status?: string;
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export function getFilterParams(query: FilterQuery = {}): ParsedFilter {
  const status = typeof query.status === 'string' ? query.status.trim() : undefined;
  const category = typeof query.category === 'string' ? query.category.trim() : undefined;
  const search = typeof query.search === 'string' ? query.search.trim() : typeof query.q === 'string' ? query.q.trim() : undefined;
  const startDate = typeof query.startDate === 'string' ? query.startDate.trim() : undefined;
  const endDate = typeof query.endDate === 'string' ? query.endDate.trim() : undefined;
  const sort = typeof query.sort === 'string' ? query.sort.trim() : undefined;
  const order = query.order === 'asc' ? 'asc' : 'desc';

  return {
    status,
    category,
    search,
    startDate,
    endDate,
    sort,
    order,
  };
}
