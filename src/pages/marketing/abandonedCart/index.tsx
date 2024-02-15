import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import TypeList from '@/components/group/group-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/brand';
import { Routes } from '@/config/routes';
import router, { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
import AbandonedCartList from '@/components/abandonedCart/abandonedCart-list';
import React from 'react';
import { Tab } from '@headlessui/react';
import Label from '@/components/ui/label';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import {
  GetDevices,
  GetFunction,
  AddingDeviceFunction,
} from '@/services/Service';
import Select from '@/components/ui/select/select';
import { selectStyles } from '@/components/ui/select/select.styles';

export default function TypesPage() {
  const { t } = useTranslation();
  const [ListData, setListData] = useState([]);
  const [AlertData, setAlertData] = useState<any>([]);
  const [loadingData, setloadingData] = useState(false);

  React.useEffect(() => {
    setloadingData(true);
    GetFunction('/abandonedcart').then((result) => {
      setListData(result);
      setloadingData(false);
    });
    GetFunction('/alerts').then((result) => {
      setAlertData(result.data);
      setloadingData(false);
    });
  }, []);
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row xl:flex-row">
        <div className="flex w-full justify-between">
          <div className="mb-4  ">
            <h1 className="text-xl font-semibold text-heading">
              {t('common:abandoned-cart-list')}
            </h1>
          </div>
        </div>
      </Card>
      <div className="">
        <Tab.Group>
          <Tab.List className="flex lg:w-2/4 xl:w-2/4 space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab
              key={1}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              <h1 className="text-md font-semibold text-heading">
                {t('common:abandoned-cart-list')}
                
              </h1>
            </Tab>
            <Tab
              key={2}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              <h1 className="text-md font-semibold text-heading">
              {t('common:abandoned-cart-settings')}
                
              </h1>
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel key={1}>
              <ul>
                <li>
                  <AbandonedCartList list={ListData} />
                </li>
              </ul>
            </Tab.Panel>
            <Tab.Panel key={2}>
              <ul>
                <li>
                  <Card>
                    <div className="flex justify-between">
                      <div className="self-center">
                        <h1 className="text-xl font-semibold text-heading text-accent">
                         {t('common:heading-alert')}
                        </h1>
                      </div>
                      <div>
                        <div className="flex  items-center space-y-4 ms-auto ">
                          <LinkButton
                            href={Routes.abandonedCart.create}
                            className="h-12 w-full md:w-auto md:ms-6"
                          >
                            <span className="block md:hidden xl:block">
                              + {t('common:button-add-alert')}
                            </span>
                            <span className="hidden md:block xl:hidden">
                              + {t('form:button-label-add')}
                            </span>
                          </LinkButton>
                        </div>
                      </div>
                    </div>
                    {AlertData &&
                      AlertData.map((res, i) => (
                        <div
                          key={i}
                          className="mt-5 flex justify-between rounded border border-border-200 border-opacity-75 p-3"
                        >
                          <div className="self-center">
                            <div className="pt-3">
                              <Label>{res.name}</Label>
                            </div>
                            <div>
                              <Label>Send after {res.sending_time} hours</Label>
                            </div>
                          </div>
                          <div className="self-center">
                            <LanguageSwitcher
                              isProductList={false}
                              slug={res.id}
                              record={res}
                              deleteModalView="DELETE_TAG"
                              routes={Routes?.abandonedCart}
                              isUpdate={true}
                              isView={false}
                              isDelete={true}
                              deleteAPIendPoint={'/alert/' + res.id}
                              deleteWithUrl={true}
                            />
                          </div>
                        </div>
                      ))}
                  </Card>
                </li>
              </ul>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
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
