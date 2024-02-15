import Pagination from '@/components/ui/pagination';
import { Table, AlignType } from '@/components/ui/table';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { SortOrder } from '@/types';
import Loader from '@/components/ui/loader/loader';
import TitleWithSort from '@/components/ui/title-with-sort';
import { MappedPaginatorInfo, Tag } from '@/types';
import Button from '../ui/button';
import { Config } from '@/config';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
import { DeleteFunctionWithUrl } from '@/services/Service';
import { toast } from 'react-toastify';
import React, { useState, Fragment } from 'react';

export type IProps = {
  tags: any | undefined | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
  paginatorInfo: MappedPaginatorInfo | null;
  tagPermission: any;
};
const TagList = ({
  tags,
  onPagination,
  onSort,
  onOrder,
  paginatorInfo,
  tagPermission,
}: IProps) => {
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
  const [loadingData, setloadingData] = useState(false);
  const { locale } = useRouter();

  const { alignLeft, alignRight } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const deleteTag = (id: any) => {
    setloadingData(true);
    DeleteFunctionWithUrl('/tag/' + id).then((result) => {
      if (result) {
        toast.success(t('common:successfully-deleted'));
        setloadingData(false);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    });
  };
  const columns: any[] = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'tag'
          }
          isActive={sortingObj.column === 'tag'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'tag',
      key: 'tag',
      align: 'center',
      onHeaderCell: () => onHeaderClick('tag'),
    },
  ];

  if (tagPermission.update === true || tagPermission.delete === true) {
    columns.unshift({
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-actions')}
        </span>
      ),
      dataIndex: 'id',
      key: 'actions',
      align: 'center',
      render: (id: any) => {
        return (
          <div className="whitespace-normal ">
            <Menu
              style={{ width: 160 }}
              as="div"
              className="relative inline-block text-left"
            >
              <div className="flex justify-center">
                <Menu.Button className="inline-flex w-24 justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-light text-white hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  {t('common:action')}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="relative right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 " style={{ fontFamily: 'poppins' }}>
                    {tagPermission.update && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`tags/${id}/edit`}
                            className={`${
                              active ? 'bg-accent text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                          >
                            Edit
                          </Link>
                        )}
                      </Menu.Item>
                    )}
                    {tagPermission.delete && false &&(
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            className={`${
                              active ? 'bg-accent text-white' : 'text-gray-900'
                            } group flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                            onClick={() => deleteTag(id)}
                          >
                            Delete
                          </div>
                        )}
                      </Menu.Item>
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        );
      },
    });
  }

  if (loadingData) return <Loader text={t('common:text-loading')} />;
  // if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          //@ts-ignore
          data={tags}
          rowKey="id"
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: () => '',
            rowExpandable: rowExpandable,
          }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default TagList;
