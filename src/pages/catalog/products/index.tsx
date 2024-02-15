import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import TypeList from '@/components/group/group-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/brand';
import { Routes } from '@/config/routes';
import Router, { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
import ProductList from '@/components/products/product-list';
import React from 'react';
import { GetFunction } from '@/services/Service';
import { ArrowUp } from '@/components/icons/arrow-up';
import { ArrowDown } from '@/components/icons/arrow-down';
import Label from '@/components/ui/label';
import { Select } from '@/components/ui/select/select';
import { selectStyles } from '@/components/ui/select/select.styles';
import cn from 'classnames';
import LinkDiv from '@/components/ui/link-div';
import { toast } from 'react-toastify';
import Button from '@/components/ui/button';

import { Menu, Transition } from '@headlessui/react';
import { MoreIcon } from '@/components/icons/more-icon';
import classNames from 'classnames';
import { DownloadIcon } from '@/components/icons/download-icon';
import CsvDownloader from 'react-csv-downloader';
import { ExportCSV } from '@/components/stockSaleReport/export';
export default function TypesPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [ListData, setListData] = useState([]);
  const [newArr, setNewArr] = useState([]);
  const [BusinesDetails, setBusinesDetails] = useState<any>('');
  const [metaData, setMetaData] = useState<any>();
  const [loadingData, setloadingData] = useState(true);
  const [tableLoader, setTableLoader] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isView, setIsView] = useState(false);
  const [packageDetail, setPackageDetail] = useState<any>({});
  const [subscriptionDetail, setSubscriptionDetail] = useState<any>({});
  const [businessDetail, setBussinessDetail] = useState<any>([]);
  const userData: any = localStorage.getItem('user_detail');
  const userDetail: any = JSON.parse(userData);
  const permissionList = userDetail?.all_permissions;
  const [visible, setVisible] = useState(false);
  const [BrandDataArray, setBrandDataArray] = useState([]);
  const [CatDataArray, setCatDataArray] = useState([]);
  const [LocationDataArray, setLocationDataArray] = useState([]);
  // const [BrandFilterId, setBrandFilterId] = useState('');
  // const [CategoryFilterId, setCategoryFilterId] = useState('');
  // const [LocationFilterId, setLocationFilterId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterData, setFilterData] = useState({
    BrandFilterId: '',
    CategoryFilterId: '',
    LocationFilterId: '',
  });
  const [BrandFilterId, setBrandFilterId] = useState('');
  const [CategoryFilterId, setCategoryFilterId] = useState('');
  const [LocationFilterId, setLocationFilterId] = useState('');
  const [exportData, setExportData] = useState<any>([]);
  const [filterSearch, setFilterSearch] = useState('');
  // const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setBusinesDetails(JSON.parse(businessDetails));

    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );

    if (businessDetail) {

      setPackageDetail(businessDetail?.subscriptions[0]?.package_details);
      setSubscriptionDetail(businessDetail?.subscriptions[0]);
      setBussinessDetail(businessDetail?.enabled_modules);
    }
  }, []);
  React.useEffect(() => {
    GetFunction('/brand?order_by_name=asc').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });

      setBrandDataArray(ordersData);
    });
    GetFunction('/taxonomy?order_by_name=asc').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });

      setCatDataArray(ordersData);
    });
    GetFunction('/business-location').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });

      setLocationDataArray(ordersData);
    });
  }, []);

  React.useEffect(() => {
    permissionList?.filter((item) => {
      if (item.toLocaleLowerCase().includes('product.create')) {
        setIsCreate(true);
      }
      if (item.toLocaleLowerCase().includes('product.update')) {
        setIsUpdate(true);
      }
      if (item.toLocaleLowerCase().includes('product.view')) {
        setIsView(true);
      }
    });
  }, []);

  React.useEffect(() => {
    GetFunction(
      '/product?brand_id=' +
        filterData.BrandFilterId +
        '&category_id=' +
        filterData.CategoryFilterId +
        '&name=' +
        filterSearch +
        '&sku=' +
        filterSearch +
        '&location_id=' +
        filterData.LocationFilterId +
        '&per_page=' +
        listPerPage
    ).then((result) => {
      if (result) {
        setMetaData(result.meta);
        setListData(result.data);
        setNewArr(result.data);
        setloadingData(false);
      }
    });
  }, [listPerPage]);

  const ChangePagination = (current) => {
    // setTableLoader(true);
    // GetFunction('/product?page=' + current + '&&name=' + filterName).then(
    //   (result) => {
    //     if (result) {
    //       setMetaData(result.meta);
    //       setListData(result.data);
    //       setNewArr(result.data);
    //       setTableLoader(false);
    //     }
    //   }
    // );
    setTableLoader(true);
    GetFunction(
      '/product?brand_id=' +
        filterData.BrandFilterId +
        '&name=' +
        filterSearch +
        '&sku=' +
        filterSearch +
        '&category_id=' +
        filterData.CategoryFilterId +
        '&location_id=' +
        filterData.LocationFilterId +
        '&per_page=' +
        listPerPage +
        '&page=' +
        current
    ).then((result) => {
      setMetaData(result.meta);
      setNewArr(result.data);
      setTableLoader(false);
    });
  };
  useEffect(() => {
    let newProductList = newArr?.map((item: any) => {
      const location: any = item?.product_locations?.map((location: any) => {
        return location.name;
      });
      const location_result = location.join(', ');
      const unit_price: any = item?.variation_options?.map((price: any) => {
        return (
          BusinesDetails?.symbol +
          ' ' +
          Math.round(price.default_purchase_price)
        );
      });
      const price_result = unit_price.join(' - ');
      const sell_price: any = item?.variation_options?.map((price: any) => {
        return (
          BusinesDetails?.symbol + ' ' + Math.round(price.sell_price_inc_tax)
        );
      });
      const sell_price_result = sell_price.join(' - ');
      var stock_sum = item.variation_options.reduce(function (acc, obj) {
        obj.variation_location_details.forEach(function (item) {
          acc += Number(item.qty_available);
        });
        return acc;
      }, 0);

      return {
        Product: item?.name,
        'Business Location': location_result,
        'Unit Purchase Price': price_result,
        'Selling Price': sell_price_result,
        'Current Stock': stock_sum + ' ' + item?.unit?.short_name,
        'Product Type': item?.type,
        Category: item.category ? item.category.name : '',
        Brand: item?.brand ? item?.brand.name : '',
        Tax: item?.product_tax ? item?.product_tax.name : '',
        SKU: item?.sku,
      };
    });
    setExportData(newProductList);
  }, [newArr]);

  const filterBySearch = (event) => {
    const query = event.target.value;
    setFilterSearch(query);
    setFilterName(query);
    GetFunction('/product?name=' + query + '&sku=' + query).then((result) => {
      if (result) {
        setMetaData(result.meta);
        setNewArr(result.data);
      }
    });
    // var updatedList = [...ListData];
    // let searchLower = query.toLowerCase();
    // let filtered = updatedList.filter((list: any) => {
    //   let searchCategory =
    //     list?.category?.name == undefined ? '' : list?.category?.name;
    //   let searchBrand = list?.brand?.name == undefined ? '' : list?.brand?.name;
    //   let searchPrice =
    //     list?.product_variations[0]?.variations[0]?.sell_price_inc_tax ==
    //     undefined
    //       ? ''
    //       : list?.product_variations[0]?.variations[0]?.sell_price_inc_tax;
    //   if (list.name.toLowerCase().includes(searchLower)) {
    //     return true;
    //   }
    //   if (searchCategory.toLowerCase().includes(searchLower)) {
    //     return true;
    //   }
    //   if (searchBrand.toLowerCase().includes(searchLower)) {
    //     return true;
    //   }
    //   if (list.sku?.toLowerCase().includes(searchLower)) {
    //     return true;
    //   }
    // });

    // setNewArr(filtered);
  };

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const onChangeBrandFilter = (e) => {
    setFilterData({ ...filterData, BrandFilterId: e.id });

    // setBrandFilterId(e.id);
    // let brand = 'brand_id=' + e.id;
    // let country = CategoryFilterId ? '&&category_id=' + CategoryFilterId : '';
    // let location = LocationFilterId ? '&&location_id=' + LocationFilterId : '';
    // let url = '/product?' + brand + country + location;
    // setTableLoader(true);
    // GetFunction(url).then((result) => {
    //   setNewArr(result.data);
    //   setMetaData(result.meta);
    //   setTableLoader(false);
    // });
  };
  const onChangeCategoryFilter = (e) => {
    setFilterData({ ...filterData, CategoryFilterId: e.id });

    // setCategoryFilterId(e.id);
    // let brand = 'category_id=' + e.id;
    // let country = BrandFilterId ? '&&brand_id=' + BrandFilterId : '';
    // let location = LocationFilterId ? '&&location_id=' + LocationFilterId : '';
    // let url = '/product?' + brand + country + location;

    // setTableLoader(true);
    // GetFunction(url).then((result) => {
    //   setNewArr(result.data);
    //   setMetaData(result.meta);
    //   setTableLoader(false);
    // });
  };

  const onChangeLocationFilter = (e) => {
    setFilterData({ ...filterData, LocationFilterId: e.id });

    // setLocationFilterId(e.id);
    // let brand = 'location_id=' + e.id;
    // let country = BrandFilterId ? '&&brand_id=' + BrandFilterId : '';
    // let location = CategoryFilterId ? '&&category_id=' + CategoryFilterId : '';
    // let url = '/product?' + brand + country + location;
    // setTableLoader(true);
    // GetFunction(url).then((result) => {
    //   setNewArr(result.data);
    //   setMetaData(result.meta);
    //   setTableLoader(false);
    // });
  };

  const onApplyFilter = () => {
    setTableLoader(true);
    GetFunction(
      '/product?brand_id=' +
        filterData.BrandFilterId +
        '&category_id=' +
        filterData.CategoryFilterId +
        '&location_id=' +
        filterData.LocationFilterId +
        '&per_page=' +
        listPerPage
    ).then((result) => {
      setMetaData(result.meta);
      setNewArr(result.data);
      setTableLoader(false);
      setVisible(false);
    });
  };

  const onClearFilter = () => {
    setloadingData(true);

    GetFunction('/product').then((result) => {
      if (result) {
        setMetaData(result.meta);
        setListData(result.data);
        setNewArr(result.data);
        setloadingData(false);
        setVisible(false);
      }
    });
  };

  const onAddClick = () => {
    if (
      packageDetail?.product_count == 0 ||
      newArr.length < packageDetail?.product_count
    ) {
      Router.push(Routes.product.create);
    } else {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    }
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    setListPerPage(newSize);
    // setCurrentPage(1); // Reset to the first page when changing page size
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t('form:input-label-products')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onChangeearchVal={filterBySearch} />
          <LinkDiv
            onClick={onAddClick}
            // href={Routes.product.create}
            className="h-12 w-full md:w-auto md:ms-6"
          >
            <span className="block md:hidden xl:block w-32 cursor-pointer">
              + {t('form:button-label-add-product')}
            </span>
            <span className="hidden md:block xl:hidden">
              + {t('form:button-label-add')}
            </span>
          </LinkDiv>
          <Menu
            as="div"
            className="relative inline-block ltr:text-left rtl:text-right"
          >
            <Menu.Button className="group p-2">
              <MoreIcon className="w-3.5 text-body" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                as="ul"
                className={classNames(
                  'shadow-700 absolute z-50 mt-2 w-52 overflow-hidden rounded border border-border-200 bg-light py-2 focus:outline-none ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left'
                )}
              >
                <Menu.Item>
                  {({ active }) => (
                    <div>
                      <button
                        className={classNames(
                          'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 focus:outline-none rtl:space-x-reverse',
                          active ? 'text-accent' : 'text-body'
                        )}
                      >
                        <DownloadIcon className="w-5 shrink-0" />
                        <CsvDownloader
                          filename="Product"
                          extension=".csv"
                          datas={exportData}
                          text={t('form:export-to-csv')}
                        />
                      </button>
                      <ExportCSV csvData={exportData} fileName="Product" />
                      {/* <button
                      className={classNames(
                        'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 focus:outline-none rtl:space-x-reverse',
                        active ? 'text-accent' : 'text-body'
                      )}
                    >
                      <DownloadIcon className="w-5 shrink-0" />
                      <ReactToPrint
                        trigger={() => <button>Print</button>}
                        content={() => tableRef.current}
                      />
                    </button> */}
                      {/* <button
                      className={classNames(
                        'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 focus:outline-none rtl:space-x-reverse',
                        active ? 'text-accent' : 'text-body'
                      )}
                    >
                      <DownloadIcon className="w-5 shrink-0" />
                      <Pdf targetRef={tableRef} filename="code-example.pdf">
                        {({ toPdf }) => (
                          <button onClick={toPdf}>Export to pdf</button>
                        )}
                      </Pdf>
                    </button> */}
                    </div>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
          <button
            className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
            onClick={toggleVisible}
          >
            {t('common:text-filter')}{' '}
            {visible ? (
              <ArrowUp className="ms-2" />
            ) : (
              <ArrowDown className="ms-2" />
            )}
          </button>
        </div>
        <div
          className={cn(' w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            <div
              className={cn(
                'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0'
              )}
            >
              <div className="w-full">
                <Label>{t('form:input-label-filter-brand')}</Label>
                <Select
                  styles={selectStyles}
                  options={BrandDataArray}
                  onChange={onChangeBrandFilter}
                />
              </div>
              <div className="w-full">
                <Label>{t('form:input-label-filter-category')}</Label>
                <Select
                  styles={selectStyles}
                  options={CatDataArray}
                  onChange={onChangeCategoryFilter}
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            <div
              className={cn(
                'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0'
              )}
            >
              <div className="w-1/2">
                <Label>{t('form:input-label-filter-location')}</Label>
                <Select
                  styles={selectStyles}
                  options={LocationDataArray}
                  onChange={onChangeLocationFilter}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button className="ml-3" onClick={onClearFilter}>
              {t('form:clear-all')}
            </Button>
            <Button onClick={onApplyFilter}>{t('form:apply-filter')}</Button>
          </div>
        </div>
      </Card>
      <div className="flex justify-end mb-3 mr-2">
        <label htmlFor="entries" className="text-sm pr-3 pt-1">
          {t('form:form-show')}
        </label>
        <select
          id="entries"
          // value={listPerPage}
          onChange={handlePageSizeChange}
          className="border rounded text-sm p-1"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="-1">All</option>
        </select>
        <label htmlFor="entries" className="text-sm pl-3 pt-1">
          {t('form:form-entries')}
        </label>
      </div>
      <ProductList
        packageDetail={packageDetail}
        subscriptionDetail={subscriptionDetail}
        metaData={metaData}
        BusinesDetails={BusinesDetails}
        list={newArr}
        isUpdate={isUpdate}
        isView={isView}
        loader={tableLoader}
        paginationChange={(current) => ChangePagination(current)}
      />
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
