import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { BrandList, GetParams, Type, TypeQueryOptions } from '@/types';
import { typeClient } from '@/data/client/brand';
import { Config } from '@/config';

export const useCreateTypeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(typeClient.create, {
    onSuccess: () => {
      Router.push(Routes.type.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BRANDS);
    },
  });
};

export const useDeleteTypeMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(typeClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BRANDS);
    },
  });
};

export const useUpdateTypeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(typeClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BRANDS);
    },
  });
};

export const useTypeQuery = ({ slug, language }: GetParams) => {
  return useQuery<BrandList, Error>([API_ENDPOINTS.BRANDS, { slug, language }], () =>
    typeClient.get({ slug, language })
  );
};

export const useTypesQuery = (options?: Partial<TypeQueryOptions>) => {
  const { data, isLoading, error } = useQuery<BrandList[], Error>(
    [API_ENDPOINTS.BRANDS, options],
    ({ queryKey, pageParam }) =>
      typeClient.all(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    types: data ?? [],
    loading: isLoading,
    error,
  };
};
