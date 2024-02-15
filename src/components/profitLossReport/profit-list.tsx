import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import { Fragment, useState } from 'react';
import Loader from '@/components/ui/loader/loader';
import Badge from '@/components/ui/badge/badge';
import { useRouter } from 'next/router';
import ActionButtons from '@/components/common/action-buttons';
import Select from '../ui/select/select';
import { Menu, Transition } from '@headlessui/react';
import LinkButton from '../ui/link-button';
import Link from '@/components/ui/link';
import Drawer from '../ui/drawer';
import DrawerWrapper from '../ui/drawer-wrapper';
import Card from '../common/card';
import Input from '../ui/input';
import Button from '../ui/button';
import Label from '../ui/label';
import { ShareOrder, site_url } from '@/services/Service';
import useClipboard from 'react-use-clipboard';
import { Routes } from '@/config/routes';
import { IoReload } from 'react-icons/io5';
import {  useEffect, useRef } from 'react';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const TypeList = (list: any) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const [model, setModel] = useState(false);
  const [ShareURL, setShareURL] = useState<any>('');
  const [isCopied, setCopied] = useClipboard(ShareURL);
  const [closeDialog, setCloseDialog] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);
  let newCurrentList = list?.list?.slice(firstItemIndex, lastItemIndex);

  const {
    query: { shop },
  } = useRouter();
  useEffect(() => {
   
    const totalGrossProfit = currentList?.reduce(
      (acc, item) => acc + (item.gross_profit !== null ? parseInt(item.gross_profit) : 0),
      0
    );
    
    setTotalAmount(totalGrossProfit);
  }, [currentList]);
  if (list.loading) return <Loader text={t('common:text-loading')} />;
  const symbol = list.BusinesDetails.symbol;

  let actionArray = [
    { label: 'one', key: 'one' },
    { label: 'two', key: 'two' },
  ];

  const closeFunction = () => {
    setModel(false);
  };

  const handleRowClick = (record) => {};

  const tab = list.tab;
 
  if (currentList?.length! - 0) {
    const newRow = {
      key: currentList?.length + 1,
      [tab == 'invoice' ?'invoice_no'  : tab == 'date' ? 'transaction_date' : tab]: 'Total',
      gross_profit: totalAmount,
    };
    newCurrentList = [...currentList, newRow];
  }
  const columns = [
    {
      title: tab == 'invoice' ?'Invoice No'  : tab,
      className: 'cursor-pointer',
      dataIndex: tab == 'invoice' ?'invoice_no'  : tab == 'date' ? 'transaction_date' : tab,
      key: 'name',
      align: alignLeft,
      width: 120,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      render: (tab: any, row: any) => (
        <span className="whitespace-nowrap cursor-pointer">
          {tab}
        </span>
      ),
    },
    {
      title: t('form:label-final-gross'),
      className: 'cursor-pointer',
      dataIndex: 'gross_profit',
      key: 'name',
      align: alignLeft,
      width: 150,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      render: (gross_profit: any, row: any) => (
        <span className="whitespace-nowrap cursor-pointer">
          {gross_profit ? parseFloat(gross_profit).toFixed(2) + symbol : '0'+symbol}
        </span>
      ),
    },
  ];


  const tableProps: any = {
    columns: columns,
    emptyText: t('table:empty-table-data'),
    data: currentList,
    rowKey: 'id',
    scroll: { x: 380 },
    // onRow: (record, index) => {
    //   return {
    //     className: 'cursor-pointer',
    //   };
    // },
  };

  return (
    <>
      <div className="mb-8 overflow-hidden rounded shadow" ref={list?.tablerefs}>
      <Table
            //@ts-ignore
            columns={columns}
            emptyText={t('table:empty-table-data')}
            data={newCurrentList}
            rowKey="id"
            scroll={{ x: 380 }}
          />
      </div>

      <Drawer open={model} onClose={closeFunction} variant="right">
        <DrawerWrapper onClose={closeFunction} hideTopBar={false}>
          <div className="m-auto rounded bg-light sm:w-[28rem]">
            <Card className="mt-4">
              <Label className="mb-0">Copy Link</Label>
              <div className="flex w-full">
                <Input
                  name="credit_limit"
                  variant="outline"
                  className="w-full"
                  value={ShareURL}
                  disabled
                />
                <Button onClick={setCopied} className="mt-3">
                  {isCopied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </Card>
          </div>
        </DrawerWrapper>
      </Drawer>

      {list?.list.length > 10 && (
        <div className="flex items-center justify-end">
          <Pagination
            total={list?.list.length}
            current={currentPage}
            pageSize={listPerPage}
            onChange={(val) => setCurrentPage(val)}
            showLessItems
          />
        </div>
      )}
    </>
  );
};

export default TypeList;
