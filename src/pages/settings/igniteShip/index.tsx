import Layout from '@/components/layouts/admin';
import SalesChannelForm from '@/components/salesChannel/salesChannel-from';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Card from '@/components/common/card';
// import { selectStyles } from '../../components/ui/select/select.styles';
import { Switch } from '@headlessui/react';
import Select, { createFilter } from 'react-select';
import Label from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import Description from '@/components/ui/description';
import Input from '@/components/ui/input';
import Loader from '@/components/ui/loader/loader';
import {
  AddingSellFunction,
  DashboardGetFun,
  GetFunctionBDetail,
  UpdateShippingStatus,
} from '@/services/Service';
import { useIsRTL } from '@/utils/locals';
import { Table } from '@/components/ui/table';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { Routes } from '@/config/routes';
import ActionButtons from '@/components/common/action-buttons';
import { toast } from 'react-toastify';
import LinkButton from '@/components/ui/link-button';
import { selectStyles } from '@/components/ui/select/select.styles';
import { FixedSizeList as List } from 'react-window';
import Button from '@/components/ui/button';

export default function CreateCategoriesPage() {
  const { t } = useTranslation();
  const [value, setValues] = React.useState<any>(false);
  const [loading, setLoading] = React.useState<any>(true);
  const [tableData, setTableData] = React.useState<any>(false);
  const { alignLeft, alignRight } = useIsRTL();
  const [status, setStatus] = React.useState<any>(false);
  const [disState, setDisState] = React.useState<any>(true);
  const [CountryList, setCountryList] = useState<any>([]);
  const [CityListNew, setCityListNew] = useState<any>([]);
  const [CityList, setCityList] = useState<any>([]);
  const [CountryListPayload, setCountryListPayload] = useState<any>([]);
  const [CityListPayload, setCityListPayload] = useState<any>();
  const [loader, setLoader] = useState<any>(false);

  const MenuList = ({ options, children, maxHeight, getValue }) => {
    const [value] = getValue();
    const height = 35;
    const initialOffset = options.indexOf(value) * height;

    return (
      <List
        width="100%"
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  };
  React.useEffect(() => {
    DashboardGetFun('/business-shipping').then((result) => {
      setTableData(result.data);
    });
    let token = localStorage.getItem('user_token');
    GetFunctionBDetail('/business-details', token).then((result) => {
      result?.data?.enabled_modules?.find((value) => {
        if (value === 'ignite_shipping') {
          setStatus(true);
          setLoading(false);
        } else {
          setStatus(false);
          setLoading(false);
        }
      });
    });
  }, []);
  useEffect(() => {
    DashboardGetFun('/currencies').then((result1) => {
      let ordersData = result1.map((data, i) => {
        return {
          id: data.id,
          value: data.country.toLowerCase(),
          label: data.country,
          city: data.cities,
        };
      });
      setCountryList(ordersData);
    });
  }, []);

  const columns = [
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-colum-title')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'title',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (title: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {title}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-shipping-status')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'status',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: function Render(status: any, row: any) {
        let activeToggle = status == 'active' ? 0 : 1;
        const [valueToggle, setValueRToggle] = useState<any>(activeToggle);
        function handleOnClick() {
          let value = {
            shipping_method_id: row.shipping_method_id,
            title: row.title,
            status: status == 'active' ? 'inactive' : 'active',
          };

          UpdateShippingStatus('/business-shipping', row.id, value).then(
            (result) => {
              if (result.success == true) {
                toast.success(result.msg);
                setValueRToggle(!valueToggle);
              }
            }
          );
        }

        return (
          <>
            <div style={{ fontFamily: 'poppins' }}>
              <Switch
                checked={!valueToggle}
                onChange={handleOnClick}
                className={`${
                  !valueToggle ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                dir="ltr"
              >
                <span className="sr-only">Enable</span>
                <span
                  className={`${
                    !valueToggle ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light`}
                />
              </Switch>
            </div>
          </>
        );
      },
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-colum-action')}
        </span>
      ),
      dataIndex: 'id',
      key: 'id',
      align: 'right',
      width: 180,

      render: function Render(id: any) {
        return (
          <>
            <div style={{ fontFamily: 'poppins' }}>
              <ActionButtons
                id={id}
                editUrl={`${'igniteShip'}/${id}`}
                isUpdate={true}
                isView={false}
                isDelete={true}
                deleteAPIendPoint={'/business-shipping/' + id}
                deleteModalView="DELETE_TAG"
                deleteWithUrl={true}
              />
            </div>
          </>
        );
      },
    },
  ];

  const onChangeStatus = () => {
    setStatus((value: any) => !value);
    setDisState(false);
  };
  const onChangeCountry = (e) => {
    setCityListNew([]);
    setCityList([]);
    setCountryListPayload(e);
    // e.map((res) => {
    let cityLiast = e?.city?.map((aa, i) => {
      return {
        label: aa,
        value: aa,
        id: i,
      };
    });

    setCityList(cityLiast);
    let cities: any = cityLiast;
    let finalArray = cities.sort(function (a, b) {
      var labelA = a.label.toUpperCase();
      var labelB = b.label.toUpperCase();
      // Check if the label contains "All"
      var containsAllA = labelA.includes('ALL');
      var containsAllB = labelB.includes('ALL');

      // Sort cities with "All" label at the start
      if (containsAllA && !containsAllB) {
        return -1;
      }
      if (!containsAllA && containsAllB) {
        return 1;
      }

      // Sort remaining cities alphabetically
      if (labelA < labelB) {
        return -1;
      }
      if (labelA > labelB) {
        return 1;
      }
      return 0;
    });

    setCityListNew(finalArray);
  };

  const onChangeCityLIst = (e) => {
    setCityListPayload(e);
  };

  const UpdateClick = () => {
    setLoader(true);
    let obj = {
      ignite_shipping: status,
    };

    if (status && CountryListPayload) {
      obj['location_id'] = CountryListPayload?.id;
      obj['city'] = CityListPayload?.label;
    }
    AddingSellFunction('/enable-shipping', obj).then((result) => {
      if (result.success) {
        setLoader(false);
        toast.success(result.message);
      } else {
        setLoader(false);
        toast.error(result.message);
      }
    });
  };

  if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <div>
        <div className="flex justify-between py-3 sm:py-8">
          <h1 className="text-lg font-semibold text-heading">
            {t('common:ignite-ship')}
          </h1>
          <LinkButton
            href={Routes.igniteShipCreate}
            className="h-12 w-fit md:w-auto md:ms-6"
          >
            <span className="">+ {t('common:add-shipping')}</span>
          </LinkButton>
        </div>

        <Card className="mb-5">
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('form:enable-ignite')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="flex justify-between">
                <span>{t('Ignite Ship')}</span>
                <div className="mb-5">
                  <Switch
                    checked={status}
                    className={`${
                      status ? 'bg-accent' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                    dir="ltr"
                    name=""
                    onChange={onChangeStatus}
                  >
                    <span className="sr-only">Enable </span>
                    <span
                      className={`${
                        status ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                    />
                  </Switch>
                </div>
              </div>
              {status && (
                <>
                  <div className="flex justify-between w-full">
                    <div className="pt-5 w-full mr-3">
                      <Label>{t('form:input-label-select-country')}</Label>

                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        styles={selectStyles}
                        name="business_location_id"
                        options={CountryList}
                        onChange={onChangeCountry}
                      />
                    </div>
                    <div className="pt-5 w-full ml-3">
                      <Label>{t('form:input-label-select-city')}</Label>
                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        styles={selectStyles}
                        components={{ MenuList }}
                        options={CityListNew}
                        onChange={onChangeCityLIst}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="mt-3 flex justify-end">
                <Button
                  loading={loader}
                  // disabled={disState}
                  onClick={UpdateClick}
                >
                  {t('form:update-status')}
                </Button>
              </div>
            </Card>
          </div>
        </Card>
        <div className="mb-8 overflow-hidden rounded shadow">
          <Table
            //@ts-ignore
            columns={columns}
            emptyText={t('table:empty-table-data')}
            data={tableData}
            rowKey="id"
            scroll={{ x: 380 }}
          />
        </div>
      </div>
    </>
  );
}

CreateCategoriesPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
