import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import CouponList from '@/components/coupon/coupon-list';
import LinkButton from '@/components/ui/link-button';
import { Fragment, useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { useCouponsQuery } from '@/data/coupon';
import Router, { useRouter } from 'next/router';
import { Config } from '@/config';
import { Menu, Transition } from '@headlessui/react';
import Button from '@/components/ui/button';
import Select from 'react-select';
import MyCalendar from '@/components/booking/MyCalendar';
import React from 'react';
import { GetFunctionWithNewUrl } from '@/services/Service';
import moment from 'moment';
import { Calendar } from 'react-date-range';
import Input from '@/components/ui/input';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Bookings() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [view, setView] = useState('listingView');
  const [loadingData, setloadingData] = useState(true);
  const [userBusinesDetails, setUserBusinesDetails] = useState<any>('');
  const [bookingData, setBookingData] = useState([]);
  const [showCalander, setShowCalander] = useState(false);
  const [showCalanderEnd, setShowCalanderEnd] = useState(false);
  const date = new Date();
  let initailDate = moment(date).format('YYYY-MM-DD');
  const [startDate, setDate] = useState<any>(initailDate);
  const [sendStartDate, setStartDate] = useState<any>(initailDate);
  const [endDate, setDateEnd] = useState<any>(initailDate);
  // Options for the dropdown

  const onhowCalannder = () => {
    setShowCalander(!showCalander);
  };

  const onhowCalannderEnd = () => {
    setShowCalanderEnd(!showCalanderEnd);
  };

  const handleSelect = (date) => {
    let dates = moment(date).format('YYYY-MM-DD');
    setDate(dates);
    setShowCalander(!showCalander);
  };

  const handleSelectEnd = (date) => {
    let dates = moment(date).format('YYYY-MM-DD');
    setDateEnd(dates);
    setShowCalanderEnd(!showCalanderEnd);
  };
  const apiCallingFunction = (endpoint) => {
    setloadingData(true);

    GetFunctionWithNewUrl('/bookings?business_id=' + endpoint).then(
      (result) => {
        if (result) {
          const mappedArray = result?.bookings?.map((item) => {
            // Check if start_date and end_date exist
            if (item.start_date && item.end_date) {
              const timeOptions: Intl.DateTimeFormatOptions = {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              };

              const startTime = item?.start_date
                ? new Date(item.start_date).toLocaleTimeString(
                    undefined,
                    timeOptions
                  )
                : '';

              const endTime = item?.end_date
                ? new Date(item.end_date).toLocaleTimeString(
                    undefined,
                    timeOptions
                  )
                : '';

              // const title = `${startTime} - ${endTime} ${item?.customer?.name}`;
              const title = ` ${item?.customer?.name +' service '+item?.service?.name}`;
       
              return {
                id: item.id,
                title: title,
                startEndTime:`${startTime} - ${endTime}`,
                start: new Date(item.start_date),
                end: new Date(item.end_date),
                desc: "Description",
                service: item?.service?.name,
                booking:item,
              };
            }

            return null;
          });

          // Filter out null values if needed
          const validMappedArray = mappedArray.filter((item) => item !== null);
          // console.log(validMappedArray);
          setBookingData(validMappedArray);
          setloadingData(false);
          setStartDate(startDate);
          //  return toast.success(validMappedArray.length +' record founded');
          // return;
        }
      }
    );
  };
  React.useEffect(() => {
    let user_business_details: any = localStorage.getItem(
      'user_business_details'
    );

    

    const user_business_id = JSON.parse(user_business_details);
if(user_business_id){
  const { booking } = user_business_id?.subscriptions[0]?.package;
  if (booking === 1) {
    if (user_business_id?.subscriptions[0]?.booking !== 1) {
      toast.error(t('common:enable_addon_desc'));
      Router.push('/');
      // return;
    }
  } else {
    toast.error(t('common:enable_addon'));
    Router.push('/');
    // return;
  }
  setUserBusinesDetails(user_business_id);
  apiCallingFunction(user_business_id?.id);
}
   
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled and hide the calendars if they have
      setShowCalander(false);
      setShowCalanderEnd(false);
    };

    // Attach the scroll event listener when the component mounts
    document.addEventListener('scroll', handleScroll);

    // Remove the scroll event listener when the component unmounts
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const options = [
    {
      value: 'listingView',
      label: t('form:button-label-booking-view-listing'),
    },
    { value: 'weeklyView', label: t('form:button-label-booking-view-weekly') },
    {
      value: 'mothlayView',
      label: t('form:button-label-booking-view-monthly'),
    },
  ];

  // Handle option select
  const handleSelectChange = (selectedOption) => {
    // console.log('Selected Option:', selectedOption);
    setView(selectedOption?.value);
  };
  const { coupons, loading, paginatorInfo, error } = useCouponsQuery({
    language: locale,
    limit: 20,
    page,
    code: searchTerm,
    orderBy,
    sortedBy,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  const filterRecord = () => {
    const isValidStartDate = !isNaN(new Date(startDate).getTime());

    // Check if endDate is a valid date
    const isValidEndDate = !isNaN(new Date(endDate).getTime());

    if (!isValidStartDate || !isValidEndDate) {
      // Show toast message for invalid date
      toast.error('Please enter valid start and end dates.');
      return;
    }
    // Assuming userBusinesDetails is of type string or undefined/null
    if (
      typeof userBusinesDetails !== 'undefined' &&
      userBusinesDetails !== null
    ) {
      apiCallingFunction(
        `${userBusinesDetails?.id}&start_date=${startDate}&end_date=${endDate}`
      );
    } else {
      // Handle the case where userBusinesDetails is undefined or null
      console.error('userBusinesDetails is undefined or null');
    }

    // apiCallingFunction(`${id}&start_date=${startDate}&end_date=${endDate}`)
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <Card className="mb-4 flex flex-col items-center xl:flex-row">
        <div className="mb-2 mr-2 md:mb-0 md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
            {t('form:input-label-bookings')}
          </h1>
        </div>
        <div className="position-relative mb-5 mr-2 w-full">
          <div onClick={onhowCalannder}>
            <Input
              label={t('form:form-item-start-date')}
              name="credit_limit"
              variant="outline"
              value={startDate}
              style={{ zIndex: showCalander ? 1 : 'unset' }}
            />
          </div>
          {showCalander && (
            <div className="top-100 fixed z-50">
              <Calendar
                color="bg-accent"
                date={new Date()}
                onChange={handleSelect}
              />
            </div>
          )}
        </div>
        <div className="position-relative mb-5 w-full">
          <div
            onClick={onhowCalannderEnd}
            style={{ zIndex: showCalanderEnd ? 1 : 'unset' }}
          >
            <Input
              label={t('form:form-item-end-date')}
              name="credit_limit"
              variant="outline"
              value={endDate}
            />
          </div>
          {showCalanderEnd && (
            <div className="top-100  fixed z-50">
              <Calendar
                color="bg-accent"
                date={new Date()}
                onChange={handleSelectEnd}
              />
            </div>
          )}
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Button
            onClick={filterRecord}
            className="h-12 w-full md:w-auto md:ms-6"
          >
            <span className="block md:hidden xl:block">
              {t('common:text-filter')}
            </span>
          </Button>

          {/* <Search onSearch={handleSearch} /> */}

          {/* {locale === Config.defaultLanguage && (
            <>
              <Select
                className=" mb-4 h-12 w-full md:mb-0 md:w-auto md:ms-6"
                options={options}
                onChange={handleSelectChange}
                placeholder={t('form:button-label-booking-view-listing')}
                isSearchable={false}
                defaultValue={options[0]}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    width: '180px', // Set the width as needed
                    height: '48px',
                    borderColor: state.isFocused ? '#2D86FF' : '#E5E7EB',
                    boxShadow: state.isFocused ? '0 0 0 1px #2D86FF' : null,
                  }),
                }}
              />
            </>
          )} */}
        </div>
      </Card>
      {/* {view == 'listingView' ? (
        <CouponList
          coupons={coupons}
          paginatorInfo={paginatorInfo}
          onPagination={handlePagination}
          onOrder={setOrder}
          onSort={setColumn}
        />
      ) : view == 'weeklyView' ? (
        <>
          <MyCalendar events={events} />
        </>
      ) : (
        view == 'mothlayView' && (
          <>
            <MyCalendar events={events} />
          </>
        )
      )} */}
      <MyCalendar events={bookingData} startDate={sendStartDate} currency={userBusinesDetails?.currency?.code} />
    </>
  );
}

Bookings.authenticate = {
  permissions: adminOnly,
};

Bookings.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
