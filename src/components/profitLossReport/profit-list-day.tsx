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
import { useEffect, useRef } from 'react';

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

  const currentList = list?.list;
  let newCurrentList = list?.list;
  const {
    query: { shop },
  } = useRouter();

  useEffect(() => {
    if (currentList) {
      const totalGrossProfit = currentList.reduce(
        (acc, item) => acc + (item.amount !== null ? parseInt(item.amount) : 0),
        0
      );

      setTotalAmount(totalGrossProfit);
    }
  }, [currentList]);

  if (list.loading) return <Loader text={t('common:text-loading')} />;

  if (currentList && currentList?.length! - 0) {
    const newRow = {
      key: currentList?.length + 1,
      ['day']: 'Total',
      amount: totalAmount,
    };
    newCurrentList = [...currentList, newRow];
  }
  const symbol = list.BusinesDetails.symbol;

  // let actionArray = [
  //   { label: 'one', key: 'one' },
  //   { label: 'two', key: 'two' },
  // ];

  const handleRowClick = (record) => {};
  const closeFunction = () => {
    setModel(false);
  };
  const tab = list.tab;
  const columns = [
    {
      title: 'Days',
      className: 'cursor-pointer',
      dataIndex: 'day',
      key: 'day',
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
      render: (day) => (
        <span className="whitespace-nowrap cursor-pointer">{day}</span>
      ),
    },
    {
      title: 'Gross Profit',
      className: 'cursor-pointer',
      dataIndex: 'amount',
      key: 'amount',
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
      render: (amount) => (
        <span className="whitespace-nowrap cursor-pointer">
          {amount ? amount + symbol : '0' + symbol}
        </span>
      ),
    },
  ];

  return (
    <>
      <div
        className="mb-8 overflow-hidden rounded shadow"
        ref={list?.tablerefs}
      >
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
    </>
  );
};

export default TypeList;
