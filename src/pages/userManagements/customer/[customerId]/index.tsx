import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useIsRTL } from '@/utils/locals';
import { useEffect, useRef, useState } from 'react';
import {
  AddingAddressFunction,
  GetFunction,
  SendEmail,
  AddingFunction,
} from '@/services/Service';
import { FaUserTie } from 'react-icons/fa';
import { FaMobile } from 'react-icons/fa';
import { ImLocation2 } from 'react-icons/im';
import { AiFillCalendar } from 'react-icons/ai';
//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Tab } from '@headlessui/react';
import 'react-tabs/style/react-tabs.css';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { AiOutlineDollar } from 'react-icons/ai';
import OrderList from '@/components/customers/order-list';
import Label from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import moment from 'moment';
import LinkButton from '@/components/ui/link-button';
import { Routes } from '@/config/routes';
import PaymentList from '@/components/ladger/ladger-list';
import Input from '@/components/ui/input';
import Description from '@/components/ui/description';
import TextArea from '@/components/ui/text-area';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import Modal from '@/components/ui/modal/modal';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import Drawer from '@/components/ui/drawer';
import { toast } from 'react-toastify';

type FormValues = {
  name?: string | null;
};
const defaultValues = {
  name: '',
  invoice_sequence: '',
};
export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const slug: any = query?.customerId;
  const [customerDetail, setCustomerDetail] = useState<any>([]);
  const [ladgerDetail, setLadgerDetail] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [newArr, setNewArr] = useState([]);
  const [TableLoader, setTableLoader] = useState(false);
  const [loadingData, setloadingData] = useState(false);
  const [BusinesDetails, setBusinesDetails] = useState('');
  const [metaData, setMetaData] = useState<any>();
  const datePickerRef = useRef(null);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [dummyArr, setDummyArr] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [averageCost, setaverageCost] = useState(0);
  const [openDrawer, setOpenDrawer] = useState<any>(false);
  const [street, setStreet] = useState<any>('');
  const [city, setCity] = useState<any>('');
  const [countryState, setCountryState] = useState<any>('');
  const [zipCode, setZipCode] = useState<number>();
  const [country, setCountry] = useState<any>('');
  const [isLoading, setIsLoading] = useState<any>(false);
  const [currency, setCurrency] = useState<any>();
  const customer_id: any = query.customerId;
  let [categories]: any = useState({
    Orders: [
      {
        status: 'Orders',
      },
    ],
    Ledger: [
      {
        status: 'Ladger',
      },
    ],
  });
  // console.log(query, 'query');
  /* 
  let businessDetail: any = JSON.parse(
    localStorage.getItem('business_details')!
  );
  let currencySymbol = businessDetail.symbol; */

  useEffect(() => {
    setLoading(true);
    GetFunction(('/contactapi/' + query.customerId) as string).then(
      (result) => {
        // console.log('>>>>>>>>>>>', result.data[0]);
        setCustomerDetail(result?.data[0]);
        setLoading(false);
      }
    );
    if (query.customerId) {
      setLoading(false);
      var form = new FormData();
      form.append('customer_id', customer_id);
      AddingFunction('/get/contact/leager/' + customer_id, form).then(
        (result) => {
          // console.log('>>>>>>>>>>>ladger', result?.payment_details);
          setLadgerDetail(result?.payment_details);
          setLoading(false);
        }
      );
    }
    let businessDetails: any = localStorage.getItem('business_details');
    setCurrency(JSON.parse(businessDetails));
  }, []);

  useEffect(() => {
    setLoading(true);
    if (customerDetail?.length !== 0) {
      const totalAmount = customerDetail?.transactions?.reduce(
        (acc, o) => acc + parseInt(o.final_total),
        0
      );
      // console.log(totalAmount);
      setTotalPayments(totalAmount);
      const average = totalAmount / customerDetail?.transactions.length;
      setaverageCost(average);
    }
    setLoading(false);
  }, [customerDetail]);

  useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setBusinesDetails(JSON.parse(businessDetails));

    setloadingData(true);
    GetFunction('/sell?order_by_date=desc').then((result) => {
      setMetaData(result.meta);
      setloadingData(false);
    });
  }, []);
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  useEffect(() => {
    let sDate = moment(new Date()).format('YYYY-MM-DD');
    let eDate = moment(new Date()).format('YYYY-MM-DD');
    setStartDate(sDate);
    setEndDate(eDate);
    if (customer_id != undefined) {
      setloadingData(true);
      GetFunction('/sell?order_by_date=desc&&contact_id=' + customer_id).then(
        (result) => {
          setMetaData(result.meta);
          setDummyArr(result.data);
          setNewArr(result.data);
          setloadingData(false);
        }
      );
    }
  }, []);

  const [showCalander, setShowCalander] = useState(false);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  // const onChange = (item) => {
  //   setState([item.selection]);
  //   let start = moment(state[0].startDate).format('YYYY-MM-DD');
  //   let end = moment(state[0].endDate).format('YYYY-MM-DD');

  //   if (start && end != 'Invalid date') {
  //     let NewStart = moment(item.selection.startDate).format('YYYY-MM-DD');
  //     let NewEend = moment(item.selection.endDate).format('YYYY-MM-DD');
  //     setTableLoader(true);
  //     GetFunction('/sell?start_date=' + NewStart + '&end_date=' + NewEend).then(
  //       (result) => {

  //         setDummyArr(result.data);
  //         setNewArr(result.data);
  //         setTableLoader(false);
  //       }
  //     );
  //     setStartDate(NewStart);
  //     setEndDate(NewEend);
  //     onhowCalannder();
  //   }
  // };
  const onhowCalannder = () => {
    setShowCalander(!showCalander);
    setState([
      {
        startDate: new Date(),
        endDate: null,
        key: 'selection',
      },
    ]);
  };

  const addAddresses = () => {
    setIsLoading(true);

    const values = {
      contact_id: customerDetail?.id,
      city: city,
      state: countryState,
      zip: zipCode,
      country: country,
      address_1: street,
    };
    const newObj = JSON.stringify(values);
    AddingAddressFunction('/saveaddres', newObj).then((result) => {
      //  console.log('result',result);
      setIsLoading(false);
      setOpenDrawer(false);
      setCity('');
      setCountryState('');
      setCountry('');
      setZipCode(0);
      window.location.reload();
      if (result?.success === 'true') {
        toast.success(result.message);
        setIsLoading(false);
        setOpenDrawer(false);
        setCity('');
        setCountryState('');
        setCountry('');
        setZipCode(0);
      } else {
        toast.error(result.message);
        setIsLoading(false);
      }
    });
  };

  if (loading) return <Loader text={t('common:text-loading')} />;
  // console.log(customerDetail);
  return (
    <>
      <header className="mb-4 rounded bg-white p-8">
        <h1 className="font-bold">{t('form:walk-in-customer')}</h1>
      </header>
      <div className="grid grid-cols-8 gap-2">
        <div className="col-span-5 flex flex-col ">
          <div className="w-full  rounded bg-white  p-2">
            <div className="grid grid-cols-3 gap-3 border-b   p-4">
              <div className="card flex h-20 w-full flex-col justify-center rounded bg-slate-200 p-1 ">
                <div className="self-center text-sm">
                  {t('table:table-item-order-count')}
                </div>
                <div className="self-center text-sm">
                  {customerDetail?.transactions?.length}
                </div>
              </div>
              <div className="card flex h-20 w-full flex-col justify-center rounded bg-slate-200 p-1 ">
                <div className="self-center text-sm">
                  {t('table:table-item-total-payments')}
                </div>
                <div className="self-center text-sm">
                  {currency?.symbol + totalPayments.toLocaleString()}
                </div>
              </div>
              <div className="card flex h-20 w-full flex-col justify-center rounded bg-slate-200 p-1 ">
                <div className="self-center text-sm">
                  {t('table:table-item-order-cost-average')}
                </div>
                <div className="self-center text-sm">
                  {currency?.symbol + averageCost?.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="p-2">
              {/* <div className="py-2"></div> */}
              <Label className="pt-2">{t('table:table-item-notes')}</Label>
              <div className="w-full">
                <Input
                  className=" w-full rounded"
                  placeholder={t('form:input-label-notes')}
                  value={customerDetail?.custom_field2}
                  name="notes"
                />
              </div>
            </div>
          </div>
          <div
            className="pt-3 pb-3 text-right"
            style={{ marginTop: '3px', marginBottom: '6px' }}
          >
            <LinkButton
              href={'/sales/' + Routes.invoice.create}
              className="h-10 w-auto text-right sm:w-auto sm:ms-6 md:w-auto md:ms-6"
            >
              <span className="block w-auto xl:block">
                + {t('table:button-label-create-new-order')}
              </span>
            </LinkButton>
          </div>
          <div className="">
            <div className="">
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                  {Object.keys(categories).map((category) => (
                    <Tab
                      key={category}
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
                      {category}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="mt-2">
                  {Object.values(categories).map((posts: any, idx) => (
                    <Tab.Panel
                      key={idx}
                      className={classNames(
                        'rounded-xl bg-white p-3',
                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                      )}
                    >
                      <ul>
                        {posts[0]?.status == 'Orders' ? (
                          <li>
                            <OrderList
                              BusinesDetails={BusinesDetails}
                              loading={TableLoader}
                              list={newArr}
                              // isUpdate={true}
                              // isView={true}
                            />
                          </li>
                        ) : (
                          <li>
                            <PaymentList
                              BusinesDetails={BusinesDetails}
                              loading={TableLoader}
                              list={ladgerDetail}
                            />
                          </li>
                        )}
                      </ul>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </div>

        <div className="col-span-3 ">
          <div className="rounded bg-white p-2">
            <div className="flex justify-between p-1">
              <div>
                <span className="font-bold">
                  {t('table:table-item-personal-data')}
                </span>
              </div>
              <div>
                <a
                  href={Routes?.customer.editWithoutLang(slug)}
                  className="text-accent"
                >
                  {t('table:table-item-edit')}
                </a>
              </div>
            </div>
            <div className="flex justify-between p-1 py-3">
              <div className="flex">
                <BsFillTelephoneFill />{' '}
              </div>
              <div>
                <span className="">{customerDetail?.mobile}</span>
              </div>
            </div>
            <div className="flex  justify-between p-1 py-3">
              <div className="flex">
                <MdOutlineAlternateEmail />{' '}
              </div>
              <div>
                <span className="">{customerDetail?.email}</span>
              </div>
            </div>
            {/* <div className="flex  justify-between p-1 py-3">
              <div>
                <span className="font-bold">
                  {' '}
                  {t('table:table-item-shipping-city')}{' '}
                </span>
              </div>
              <div>
                <span className="">{customerDetail?.city}</span>
              </div>
            </div> */}
            {/* <div className="flex justify-between p-1 py-3">
              <div>
                <span className="font-bold">
                  {t('table:table-item-shipping-country')}
                </span>
              </div>
              <div>
                <span className="">{customerDetail?.country}</span>
              </div>
            </div> */}
            {/* <div className="flex  justify-between p-1 py-3">
              <div><span className="font-bold"> {t('table:table-item-gender')} </span></div>
              <div><span className="">Male</span></div>
            </div> */}
            {/* <div className="flex  justify-between p-1 py-3">
              <div>
                <span className="font-bold">{t('table:table-item-dob')} </span>
              </div>
              <div>
                <span className="">{customerDetail?.dob}</span>
              </div>
            </div> */}
            {/* <div className="flex  justify-between p-1 py-3">
              <div><span className="font-bold">{t('table:table-item-customer-channel')} </span></div>
              <div><span className="">Lahore</span></div>
            </div> */}
            <div className="flex  justify-between p-1 py-3">
              <div>
                <span className="font-bold">
                  {t('table:table-item-credit-limit')}{' '}
                </span>
              </div>
              <div>
                <span className="">
                  {Number(customerDetail?.credit_limit).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex  justify-between p-1 py-3">
              <div>
                <span className="font-bold">
                  {t('table:table-item-outstanding-credit')}{' '}
                </span>
              </div>
              <div>
                {/* <span className="">{Number(customerDetail?.credit_limit).toFixed(2)}</span> */}
              </div>
            </div>
            <div className="flex  justify-between p-1 py-3">
              <div>
                <span className="font-bold">
                  {t('form:input-label-notes')} :
                </span>
              </div>
              <div>
                <span className="">{customerDetail?.custom_field2}</span>
              </div>
            </div>
          </div>
          {/* <div className="rounded bg-white p-4 my-4">
            <div><span>Customer Settings</span></div>
            <div className="rounded p-4 my-2 shadow-lg ">
              <span>
                Ban customer
              </span></div>
            <div className="rounded p-4  my-2 shadow-lg ">
              <span>
                Deactive COD
              </span></div>
            <div className="rounded p-4  my-2 shadow-lg ">
              <span>
                Unsubcribe from the newsletter
              </span></div>
          </div> */}
          <div className="my-4 rounded bg-white p-2">
            <div className="flex justify-between p-2">
              <span>{t('table:table-item-customer-addresses')}</span>
              <button
                className="text-accent"
                onClick={() => setOpenDrawer(true)}
              >
                + {t('form:button-label-add-address')}
              </button>

              <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                variant="right"
              >
                <DrawerWrapper
                  onClose={() => setOpenDrawer(false)}
                  hideTopBar={false}
                >
                  <div className="m-auto rounded bg-light sm:w-[28rem]">
                    <div className="overflow-scroll px-4  pt-8">
                      <Label>{t('form:input-label-add-address')}</Label>
                      <div className="h-auto overflow-auto">
                        <div className="p-2">
                          <Label>{t('form:input-label-street-address')}</Label>
                          <Input
                            name="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                          />
                        </div>
                        <div className="p-2">
                          <Label>{t('form:input-label-city')}</Label>
                          <Input
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                        <div className="p-2">
                          <Label>{t('form:input-label-state')}</Label>
                          <Input
                            name="state"
                            value={countryState}
                            onChange={(e) => setCountryState(e.target.value)}
                          />
                        </div>
                        <div className="p-2">
                          <Label>{t('form:input-label-zip-code')}</Label>
                          <Input
                            name="zip"
                            value={zipCode}
                            type={'number'}
                            onChange={(e: any) => setZipCode(e.target.value)}
                          />
                        </div>
                        <div className="p-2">
                          <Label>{t('form:input-label-country')}</Label>
                          <Input
                            name="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          />
                        </div>
                      </div>
                      <footer className=" bottom-0 z-10 flex w-full max-w-md justify-end bg-light py-5 ">
                        <button
                          className="shadow-700 right-4 flex h-12 w-full  rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                          onClick={addAddresses}
                        >
                          <div className="flex-1 pt-3 text-center text-light">
                            {t('form:button-label-add-address')}
                          </div>
                        </button>
                      </footer>
                    </div>
                  </div>
                </DrawerWrapper>
              </Drawer>
            </div>
            <div className="">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-2">{customerDetail?.address_line_1}</div>
              </div>

              {customerDetail?.addresses?.map((address: any, index: any) => (
                <div key={index} className="grid grid-cols-1 gap-4">
                  <div className="p-2" key={index}>
                    {/* {address.address_1}, */}
                    {address.city}, {/* {address.zip},  */}
                    {address.state}, {address.country}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <div>
        <Card>
          <div>
            <div className="flex py-2">
              <span className="text-xl">
                <FaUserTie color="#B5B5C3" />
              </span>
              <span className="px-2 "> {customerDetail.name}</span>
              <span className="px-1 text-sm text-body">
                {customerDetail.type}
              </span>
            </div>
            <div>
              <div className="flex py-2">
                <span className="text-xl">
                  <ImLocation2 color="#B5B5C3" />
                </span>
                <span className="px-2 ">{t('common:text-address')}</span>
              </div>
              <span className="px-1 pl-7 text-sm text-body">
                {customerDetail?.address_line_1}
              </span>
            </div>

            <div>
              <div className="flex py-2">
                <span className="text-xl">
                  <FaMobile color="#B5B5C3" />
                </span>
                <span className="px-2  "> {t('common:phone-no')}</span>
              </div>
              <span className="break-all px-1 pl-7 text-sm text-body">
                {customerDetail.mobile}
              </span>
            </div>
            <div>
              <div className="flex py-2">
                <span className="text-xl">
                  <AiFillCalendar color="#B5B5C3" />
                </span>
                <span className="px-2  ">{t('common:date-birth')}</span>
              </div>
              <span className="break-all px-1 pl-7 text-sm text-body">
                {customerDetail?.dob}
              </span>
            </div>
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('View Customer Detail')}
          details={t('Customer Details')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            <div className="flex justify-between py-2">
              <div className="flex">
                <FaUserTie color="#B5B5C3" />
                <p className="px-2 "> {customerDetail.name}</p>
              </div>
              <div>
                <span className="px-1 text-sm text-body">
                  {customerDetail.type}
                </span>
              </div>
            </div>
            <div className="flex justify-between py-2">
              <div className="flex py-2">
                <ImLocation2 color="#B5B5C3" />
                <span className="px-2 ">{t('common:text-address')}</span>
              </div>
              <div>
                <p className="px-1 pl-7 text-sm text-body">
                  {customerDetail?.address_line_1}
                </p>
              </div>
            </div>
            <div className="flex justify-between py-2">
              <div className="flex py-2">
                <FaMobile color="#B5B5C3" />
                <span className="px-2  "> {t('common:phone-no')}</span>
              </div>
              <div>
                <p className="px-1 pl-7 text-sm text-body">
                  {customerDetail.mobile}
                </p>
              </div>
            </div>
            <div className="flex justify-between py-2">
              <div className="flex py-2">
                <AiFillCalendar color="#B5B5C3" />
                <span className="px-2  ">{t('common:date-birth')}</span>
              </div>
              <div>
                <p className="px-1 pl-7 text-sm text-body">
                  {customerDetail?.dob}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="pt-6">
        <Card>
          <div>
            <Tab.Group>
              <Tab.List>
                <Tab>  <div className="flex items-center">
                  <AiOutlineShoppingCart />
                  <span className="px-1"> {t('common:sales')} </span>
                </div></Tab>
             

              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>  <div>
                  <div className="flex justify-end p-3">
                    <div className="mb-5 w-full sm:mb-0 sm:w-1/2 sm:pe-2">
                      <div onClick={onhowCalannder}>
                        <Input
                          label="Select Date"
                          name="credit_limit"
                          variant="outline"
                          value={startDate + ' - ' + endDate}
                        />
                      </div>
                      {showCalander && (
                        <div style={{ position: 'absolute', zIndex: 999 }}>
                          <DateRange
                            onChange={onChange}
                            moveRangeOnFirstSelection={false}
                            ranges={state}
                            rangeColors="#009F7F"
                            color="#009F7F"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <InvoiceList
                    BusinesDetails={BusinesDetails}
                    loading={TableLoader}
                    list={newArr}
                  // isUpdate={true}
                  // isView={true}
                  />
                </div></Tab.Panel>
                <Tab.Panel>  <div>
                  <PaymentList
                    BusinesDetails={BusinesDetails}
                    loading={TableLoader}
                    list={newArr}
                  />
                </div></Tab.Panel>

              </Tab.Panels>
            </Tab.Group>

             <Tab>
                  <div className="flex items-center">
                    <AiOutlineShoppingCart />
                    <span className="px-1"> {t('common:sales')} </span>
                  </div>
                </Tab> 
           <Tab>
                  <div className="flex items-center">
                    <AiOutlineDollar />
                    <span className="px-1">{t('common:payments')} </span>
                  </div>
                </Tab> 


         <Tab.Panel>
                <div>
                  <div className="flex justify-end p-3">
                    <div className="mb-5 w-full sm:mb-0 sm:w-1/2 sm:pe-2">
                      <div onClick={onhowCalannder}>
                        <Input
                          label="Select Date"
                          name="credit_limit"
                          variant="outline"
                          value={startDate + ' - ' + endDate}
                        />
                      </div>
                      {showCalander && (
                        <div style={{ position: 'absolute', zIndex: 999 }}>
                          <DateRange
                            onChange={onChange}
                            moveRangeOnFirstSelection={false}
                            ranges={state}
                            rangeColors="#009F7F"
                            color="#009F7F"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <InvoiceList
                    BusinesDetails={BusinesDetails}
                    loading={TableLoader}
                    list={newArr}
                    // isUpdate={true}
                    // isView={true}
                  />
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div>
                  <PaymentList
                    BusinesDetails={BusinesDetails}
                    loading={TableLoader}
                    list={newArr}
                  />
                </div>
              </Tab.Panel>

          </div>
        </Card>
      </div> */}
    </>
  );
}
OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
