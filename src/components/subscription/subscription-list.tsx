import { Table } from '@/components/ui/table';
import { SortOrder, Type, SubsciptionData } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { useEffect, useState } from 'react';
import Pagination from '@/components/ui/pagination';
import { format } from 'date-fns';
import Badge from '@/components/ui/badge/badge';
import router from 'next/router';
import Link from 'next/link';

export type IProps = {
  listOfBrands: SubsciptionData[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const RoleList = (list: any) => {
  // console.log("listlist",list);
  const today = new Date();

  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const [currency, setCurrency] = useState<any>(true);

  useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setCurrency(JSON.parse(businessDetails));
  }, []);
  const columns = [
    {
      title: t('table:table-item-date'),
      className: 'cursor-pointer',
      dataIndex: 'createdAt',
      key: 'list',
      align: alignLeft,
      width: 200,
      render: (createdAt: any, list: any) => (
        <>
          {/* <span  className={`whitespace-nowrap ${
        list?.status.toLowerCase()=="pending"? 'bg-red text-red':'bg-gray' }`}>{list?.status
    }</span> */}
          <span className="whitespace-nowrap">
            {createdAt && format(new Date(createdAt), 'yyyy/MM/dd')}
          </span>
        </>
      ),
    },
    {
      title: t('table:table-item-package-name'),
      className: 'cursor-pointer',
      dataIndex: 'plan',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: function Render(id: any, row: any) {
        return (
          <Link href={'/settings/subscriptionDetail/' + row.plan.id}>
            <span style={{ color: 'blue', cursor: 'pointer' }}>
              {row.plan.plan_name}
            </span>
          </Link>
        );
      },
    },

    // {
    //   title: t('table:table-item-trail-end-date') ,
    //   className: 'cursor-pointer',
    //   dataIndex: 'trial_expiry_date',
    //   key: 'name',
    //   align: alignLeft,
    //   width: 200,
    //   render: (trial_expiry_date: any) => <span className="whitespace-nowrap">{trial_expiry_date && format(new Date(trial_expiry_date), 'yyyy/MM/dd')
    // }</span>,
    // },
    {
      title: t('table:table-item-end-date'),
      className: 'cursor-pointer',
      dataIndex: 'next_billing_date',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (next_billing_date: any) => (
        <span className="whitespace-nowrap">
          {next_billing_date &&
            format(new Date(next_billing_date), 'yyyy/MM/dd')}
        </span>
      ),
    },

    // {
    //   title:  t('table:table-item-paid-via'),
    //   className: 'cursor-pointer',
    //   dataIndex: 'paid_via',
    //   key: 'name',
    //   align: alignLeft,
    //   width: 200,
    //   render: (paid_via: any) => <span className="whitespace-nowrap">{paid_via}</span>,
    // },
    // {
    //   title:  t('table:table-item-transaction-id'),
    //   className: 'cursor-pointer',
    //   dataIndex: 'payment_transaction_id',
    //   key: 'name',
    //   align: alignLeft,
    //   width: 200,
    //   render: (payment_transaction_id: any) => <span className="whitespace-nowrap">{payment_transaction_id}</span>,
    // },
    {
      title: t('table:table-item-status'),
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'id',
      align: alignLeft,
      width: 200,
      render: (id: any, row: any) => (
        <div>
          <Badge
            text={row.status}
            color={
              row.status === 'pending'
                ? 'bg-red-600 text-white'
                : row.status === 'live'
                ? 'bg-accent text-white'
                : 'bg-orange-500 text-white'
            }
          />
          {row.status == 'pending' && (
            <div>
              <br />
              <a
                className="pl-2"
                style={{ color: 'blue', cursor: 'pointer' }}
                rel="noreferrer"
                href={row.invoice_link}
                target="_blank"
              >
                Pay Now
              </a>
            </div>
          )}
        </div>
      ),
    },

    // {
    //   title: t('table:table-item-created-at'),
    //   className: 'cursor-pointer',
    //   dataIndex: 'createdAt',
    //   key: 'name',
    //   align: alignLeft,
    //   width: 200,
    //   render: (createdAt: any) => <span className="whitespace-nowrap">{createdAt && format(new Date(createdAt), 'yyyy/MM/dd')
    // }</span>
    // },
    {
      title: t('table:table-item-price'),
      className: 'cursor-pointer',
      dataIndex: 'amount',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (amount: any, name: any) => {
        let total = 0;
        name?.addons?.map((item: any) => {
          total += item.calculated_amount;
        });

        let newTotal = total + name.plan.price;
        //  console.log(newTotal);
        return (
          <span className="whitespace-nowrap">
            {name.plan.price + ' ' + currency?.symbol}
          </span>
        );
      },
    },
    // {
    //   title: t('table:table-item-actions'),
    //   dataIndex: 'slug',
    //   key: 'actions',
    //   align: 'right',
    //   width: 120,
    //   render: (slug: string) => (
    //     <Link href={list?.url}>
    //       <a target="_blank">
    //         <button className="rounded bg-accent p-2 text-white">
    //           {t('table:table-button-renew')}
    //         </button>
    //       </a>
    //     </Link>
    //   ),
    // },
  ];

  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);

  return (
    <>
      <div className="mb-8 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={currentList}
          rowKey="id"
          scroll={{ x: 380 }}
        />
      </div>

      {/* {list?.list.length > 10 && (
        <div className="flex items-center justify-end">
          <Pagination
            total={list?.list.length}
            current={currentPage}
            pageSize={listPerPage}
            onChange={(val) => setCurrentPage(val)}
            showLessItems
          />
        </div>
      )} */}
    </>
  );
};

export default RoleList;
