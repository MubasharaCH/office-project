import Pagination from '@/components/ui/pagination';
import dayjs from 'dayjs';
import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import usePrice from '@/utils/use-price';
import { formatAddress } from '@/utils/format-address';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { OrderStatus, SortOrder, UserAddress } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Onboard, MappedPaginatorInfo } from '@/types';
import { useRouter } from 'next/router';
import Badge from '@/components/ui/badge/badge';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';

type IProps = {
  Onboard: Onboard[] | undefined;
};

const OnboardingList = ({
  Onboard,
}: any) => {
  console.log('orders',Onboard);
  // const { data, paginatorInfo } = orders! ?? {};
  const router = useRouter();
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
  const { alignLeft } = useIsRTL();

  

  const columns = [
    {
      title: t('Id'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 120,
    },
    {
      title: t('Location'),
      dataIndex: 'einvoice_settings',
      key: 'einvoice_settings',
      align: 'center',
      render: function Render(value: any, row: any) {
        console.log('value', row.einvoice_settings?.otp); // This logs the value to the console
    
        return (
          <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
            {row.name}
          </span>
        );
      },
    },
    {
      title: t('Status'),
      dataIndex: 'einvoice_settings',
      key: 'einvoice_settings',
      align: 'center',
      render: function Render(value: any, row: any) {
        console.log('value', row.einvoice_settings?.otp); // This logs the value to the console
        const formattedText = row.einvoice_settings ? 'Onboarded' : 'Pending';
        return (
          <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
           <Badge
                    text={formattedText}
                    color={
                      formattedText === 'Pending'
                        ? 'bg-red-400'
                        : 'bg-green-400'
                    }
                  />
          </span>
        );
      },
    },
    
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('Actions')}
        </span>
      ),
      dataIndex: 'einvoice_settings',
      key: 'einvoice_settings',
      align: 'center',
      render: function Render(value: any, row: any) {
        console.log('value', row.einvoice_settings?.otp); // This logs the value to the console
        const formattedText = row.einvoice_settings ? 'Onboarded' : 'Pending';
        return (
          <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
            {
              !row.einvoice_settings ? <Link
              href={Routes.onBoarding.create+`/?id=${row.id}`}
              className={'bg-dark  text-white tex-center group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white'}
            >
              {t('Add')}
            </Link>:''
            }
        

          </span>
        );
      },
    }
    
   

  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={Onboard}
          rowKey="id"
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: () => '',
            rowExpandable: rowExpandable,
          }}
        />
      </div>
    </>
  );
};

export default OnboardingList;
