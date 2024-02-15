import { crudFactory } from '@/data/client/curd-factory';
import {
  CreateTypeInput,
  QueryOptions,
  Type,
  BrandList,
  TypeQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const typeClient = {
  ...crudFactory<BrandList, QueryOptions, CreateTypeInput>(API_ENDPOINTS.BRANDS),
  all: ({ name, ...params }: Partial<TypeQueryOptions>) => {
    return HttpClient.get<BrandList[]>(API_ENDPOINTS.BRANDS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
