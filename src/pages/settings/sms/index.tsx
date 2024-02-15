import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import TypeList from '@/components/group/group-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/brand';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import SMSList from '@/components/sms/sms-list';
import { GetFunction } from '@/services/Service';
import Label from '@/components/ui/label';
import Select from 'react-select';
import { selectStyles } from '../../../components/ui/select/select.styles';
import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { DatePicker } from '@/components/ui/date-picker';
import moment from 'moment';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal/modal';
import { Switch } from '@headlessui/react';
import Input from '@/components/ui/input';
import { toast } from 'react-toastify';
import Drawer from '@/components/ui/drawer';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import { AddToCart } from '@/components/cart/add-to-cart/add-to-cart';
import { FaWallet } from 'react-icons/fa';
import { BsPlusCircle } from 'react-icons/bs';
import { MdSms } from 'react-icons/md';

export default function TypesPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [dummyArr, setDummyArr] = useState([]);
  const [newArr, setNewArr] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loadingData, setloadingData] = useState(false);
  const [TableLoader, setTableLoader] = useState(false);
  const [CustomerArray, setCustomerArray] = React.useState<any[]>([]);
  const [BusinesDetails, setBusinesDetails] = useState('');
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [SenderId, setSenderId] = useState<any>('');
  const [smsHandle, setSmsHandle] = useState(false);
  const [emailHandle, setEmailHandle] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [purchaseSMS, setPurchaseSMS] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setloadingData(true);
    GetFunction('/sms-configuration ').then((result) => {
      setDummyArr(result.data);
      setNewArr(result.data);
      setloadingData(false);
    });
  }, []);

  const handleSMS = () => {
    setSmsHandle(!smsHandle);
  };
  const handleEmail = () => {
    setEmailHandle(!emailHandle);
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  const filterBySearch = (event) => {
    const query = event.target.value;
    var updatedList = [...dummyArr];
    let searchLower = query.toLowerCase();
    let filtered = updatedList.filter((list: any) => {
      if (list.name.toLowerCase().includes(searchLower)) {
        return true;
      }
    });
    setNewArr(filtered);
  };

  const onChangeSenderID = (e: any) => {
    setSenderId(e.target.value);
  };

  const onAddNotificatioin = () => {
    router.push(Routes.sms.create);
  };

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="flex w-full flex-col rounded bg-light lg:ml-6 xl:ml-6 md:ml-4 lg:mt-0 xl:mt-0 md:mt-0 mt-6">
            <div className="flex justify-between">
              <div className="flex mt-2">
                <MdSms className="h-7 w-7 mr-3" />
                <h1 className="text-lg">SMS Count</h1>
                <h5 className="pl-3 pt-1">1 / 100</h5>
              </div>
              <div>
                <LinkButton
                  href="/settings/addons"
                  className="h-12 w-full md:w-auto md:ms-6"
                >
                  <span className="hidden md:block">Buy SMS</span>
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-lg font-semibold text-heading">
              {t('Notification')}
            </h1>
          </div>
          <div className="flex w-full flex-col items-center ms-auto md:flex-row">
            <Search onChangeearchVal={filterBySearch} />
            <Button
              onClick={onAddNotificatioin}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('Add Notification')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </Button>
          </div>
        </div>
      </Card>
      <Modal
        open={modalView}
        onClose={() => setEmailHandle(false)}
        style={{ width: '60%' }}
      >
        <Card className="w-full">
          <div className="flex justify-between w-full">
            <div>SMS Notification</div>
            <div className="ml-32">
              <Switch
                checked={smsHandle}
                onChange={handleSMS}
                className={`${
                  smsHandle ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                dir="ltr"
              >
                <span className="sr-only">Enable </span>
                <span
                  className={`${
                    smsHandle ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                />
              </Switch>
            </div>
          </div>
          {smsHandle && (
            <div className="flex justify-between w-full">
              <Label className="pt-7 ml-0 pl-0 pr-2 w-24">Sender Id</Label>
              <Input
                name=""
                value={SenderId}
                onChange={onChangeSenderID}
                className="w-full"
              />
            </div>
          )}
          <div className="flex justify-between w-full mt-5">
            <div>Email Notification</div>
            <div className="ml-32">
              <Switch
                checked={emailHandle}
                onChange={handleEmail}
                className={`${
                  emailHandle ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                dir="ltr"
              >
                <span className="sr-only">Enable </span>
                <span
                  className={`${
                    emailHandle ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                />
              </Switch>
            </div>
          </div>
          <div className="flex justify-between w-full mt-8">
            <Button onClick={() => setModalView(false)}>Cancel</Button>
            <Button onClick={() => setModalView(false)}>Enable</Button>
          </div>
        </Card>
      </Modal>
      <SMSList list={newArr} isUpdate={true} isView={true} />
    </>
  );
}

TypesPage.authenticate = {
  permissions: adminOnly,
};

TypesPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
  },
});
