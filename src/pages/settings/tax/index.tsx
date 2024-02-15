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
import TaxList from '@/components/tax/tax-list';
import { GetFunction } from '@/services/Service';
import Label from '@/components/ui/label';
import Select from 'react-select';
import { selectStyles } from '../../../components/ui/select/select.styles';
import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { DatePicker } from '@/components/ui/date-picker';
import moment from 'moment';

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

  React.useEffect(() => {
    setloadingData(true);
    GetFunction('/tax').then((result) => {
      setDummyArr(result.data);
      setNewArr(result.data);
      setloadingData(false);
    });
  }, []);

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

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-lg font-semibold text-heading">
              {t('common:tax')}
            </h1>
          </div>
          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
            <Search onChangeearchVal={filterBySearch} />
            <LinkButton
              href={Routes.tax.create}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('common:add-tax')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          </div>
        </div>
      </Card>
      <TaxList list={newArr} isUpdate={true} isView={true} />
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
