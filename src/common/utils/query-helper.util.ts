import { SelectQueryBuilder, Brackets } from 'typeorm';
import { SearchQueryDto } from '../dto/search-query.dto';

export class QueryHelper {
  static applySearchAndFilters<T extends object>(
    queryBuilder: SelectQueryBuilder<T>,
    queryDto: SearchQueryDto,
    searchableFields: string[],
    alias: string,
    defaultSortBy?: string,
    defaultSortOrder: 'ASC' | 'DESC' = 'ASC',
  ): void {
    const { search, limit, offset, page, sortBy, sortOrder, ...filters } =
      queryDto;

    // 1. Apply Global Search
    if (search && searchableFields.length > 0) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          searchableFields.forEach((field, index) => {
            // Cast to text to support numeric columns in global search
            const condition = `CAST(${alias}.${field} AS TEXT) ILIKE :search`;
            if (index === 0) {
              qb.where(condition, { search: `%${search}%` });
            } else {
              qb.orWhere(condition, { search: `%${search}%` });
            }
          });
        }),
      );
    }

    // 2. Apply Field-Specific Filters
    const filterEntries = Object.entries(filters);

    filterEntries.forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Simple exact match for other filters
        queryBuilder.andWhere(`${alias}.${key} = :${key}`, { [key]: value });
      }
    });

    // 3. Apply Sorting
    let finalSortBy = defaultSortBy;

    if (typeof sortBy === 'string') {
      finalSortBy = sortBy;
    }

    const finalSortOrder = sortOrder || defaultSortOrder;

    if (finalSortBy) {
      queryBuilder.orderBy(`${alias}.${finalSortBy}`, finalSortOrder);
    }

    // 4. Apply Pagination
    const take = limit || 10;
    const skip = page ? (page - 1) * take : offset || 0;

    queryBuilder.skip(skip).take(take);
  }
}
