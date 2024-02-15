import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Calendar as SmallCalendar } from 'react-date-range';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Button from '../ui/button';
import Popup from 'react-popup';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import Drawer from '@/components/ui/drawer';
import Select from '../ui/select/select';
import { useTranslation } from 'next-i18next';
import { selectStyles } from '../ui/select/select.styles';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Input from '../ui/input';
import Modal from './model';
import { GetFunctionWithNewUrl } from '@/services/Service';
import { toast } from 'react-toastify';
import router from 'next/router';
moment.updateLocale('en', {
  week: {
    dow: 1, // Set the first day of the week to Monday
  },
});

const localizer = momentLocalizer(moment);
const messages = {
  agenda: 'Listing',
};
const valueType = [
  {
    key: 0,
    id: 0,
    value: 'day',
    label: 'Day',
  },
  {
    key: 1,
    id: 1,
    value: 'week',
    label: 'Weekly',
  },
  {
    key: 2,
    id: 2,
    value: 'month',
    label: 'Monthly',
  },
  // {
  //   key: 3,
  //   id: 3,
  //   value: '3days',
  //   label: '3 Days',
  // },
];
const bookingStatusType = [
  {
    key: 0,
    id: 0,
    value: 'padding',
    label: 'Padding',
  },
  {
    key: 1,
    id: 1,
    value: 'approved',
    label: 'Approved',
  },
  {
    key: 2,
    id: 2,
    value: 'rejected',
    label: 'Rejected',
  },
  {
    key: 3,
    id: 3,
    value: 'complete',
    label: 'Completed',
  },
];
const MyCalendar = ({ events, startDate, currency }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isselectedDate, setisSelectedDate] = useState('');
  const [displayView, setView] = useState('month');
  const [selectedValueType, setSelectedValueType] = useState<any>(valueType[2]);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [selectedBookingStatus, setSelectedBookingStatus] = useState<any>(
    bookingStatusType[2]
  );

  const [showCalander, setShowCalander] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [pluginDrawer, setPluginDrawer] = useState<any>(false);
  const [modalIsOpen, setModalIsOpen] = useState<any>(false);
  const date = new Date();
  let initailDate = moment(date).format('YYYY-MM-DD');
  const onhowCalannder = () => {
    setShowCalander(!showCalander);
  };
  useEffect(() => {
    if (events.length > 0) {
      setSelectedDate(new Date(startDate));
    }
  }, [startDate]);

  const OnChangeValueType = (e) => {
    if (e.value === '3days') {
      handleShowThreeDays();
    }
    setSelectedValueType(e);
  };

  const OnChangeBookingStatus = (e) => {
    setSelectedBookingStatus(e);
  };

  const handleSelect = (date) => {
    let dates = moment(date).format('YYYY-MM-DD');
    // setDate(dates);
    setSelectedDate(date);
    setShowCalander(!showCalander);
  };
  // Helper function to count events on a specific date
  const countEventsOnDate = (date) => {
    return events.filter((event) => moment(event.start).isSame(date, 'day'))
      .length;
  };

  const closeFunctionPluginDrawer = () => {
    setPluginDrawer(false);
  };
  // Import or define your custom styles
  const customStyles = {
    showMoreButton: {
      backgroundColor: 'black', // Change this to the desired color
      color: 'white', // Change this to the desired text color
      // Add more styles as needed
    },
  };

  const commanStyle = {
    backgroundColor: 'white',
    color: 'black',
    borderColor: 'gray',
    borderRadius: '0px',
    fontSize: '12px',
    height: '40px',
    transition: 'background-color 0.3s', // Add a smooth transition
    ':hover': {
      backgroundColor: 'darkgray', // Change the background color on hover
    },
  };

  React.useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled and hide the calendars if they have
      setShowCalander(false);
    };

    // Attach the scroll event listener when the component mounts
    document.addEventListener('scroll', handleScroll);

    // Remove the scroll event listener when the component unmounts
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    if (event?.booking?.status === '0') {
      setSelectedBookingStatus(bookingStatusType[0]);
    } else if (event?.booking?.status === '1') {
      setSelectedBookingStatus(bookingStatusType[1]);
    } else if (event?.booking?.status === '2') {
      setSelectedBookingStatus(bookingStatusType[2]);
    } else if (event?.booking?.status === '3') {
      setSelectedBookingStatus(bookingStatusType[3]);
    }
    // setModalIsOpen(true);00 // Open the modal
    setPluginDrawer(true);
  };

  // Function to close the modal

  const handleShowThreeDays = () => {
    // Logic to show events for the next three days
    const nextThreeDays = moment(selectedDate).add(2, 'days').toDate();
    setSelectedDate(nextThreeDays);
  };

  const bookingStatusUpdate = (
    selectedEvent: any,
    selectedBookingStatus: any
  ) => {
    // setloadingData(true);

    const bookingId = selectedEvent.booking.id ?? null;
    if (bookingId) {
      setCreatingLoading(true);
      GetFunctionWithNewUrl(
        `/booking/status_update/${selectedBookingStatus?.key}/${bookingId}`
      ).then((result) => {
        if (result?.success) {
          console.log(result);
          closeFunctionPluginDrawer();
          toast.success(t('common:successfully-updated'));
          setCreatingLoading(false);
          router.reload();
        } else {
          setCreatingLoading(false);
          console.log(result?.error?.message);
          // toast.success(t('common:successfully-update'));
          toast.error(result?.error?.message);
        }
      });
    }
  };
  const handleShowMore = (showMore, selectedDate) => {
    showMore.onClick();
  };

  const handleNavigate = (action) => {
    let newDate;

    switch (action) {
      case 'prev':
        newDate = moment(selectedDate)
          .subtract(1, selectedValueType.value)
          .toDate();
        break;
      case 'next':
        newDate = moment(selectedDate).add(1, selectedValueType.value).toDate();
        break;
      case 'today':
        newDate = new Date();
        break;
      default:
        newDate = selectedDate;
    }
    setisSelectedDate(action);
    setSelectedDate(newDate);
  };

  return (
    <>
      <div style={{ height: '500px', backgroundColor: 'white' }}>
        <>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            defaultView="day"
            endAccessor="end"
            style={{ margin: '0px' }}
            messages={messages}
            showMultiDayTimes
            // step={60}
            onSelectEvent={handleEventClick}
            view={
              selectedValueType?.value !== '3days'
                ? selectedValueType?.value
                : 'custom3days'
            }
            date={selectedDate}
            onNavigate={(date) => {
              setSelectedValueType(valueType[0]);
              setSelectedDate(date);
            }}
            eventPropGetter={(event, start, end, isSelected) => {
              const numberOfEventsOnDate = countEventsOnDate(start);

              let textColor = 'black';

              return {
                style: {
                  backgroundColor:
                    selectedValueType?.value === 'day' ? '#f3f4f6' : '#f3f4f6',
                  borderColor: 'gray',
                  color: textColor,
                  // display: 'block',
                  fontSize: '13px',
                },
              };
            }}
            components={{
              showMoreButton: (showMore) => {
                return (
                  <button
                    type="button"
                    onClick={() => handleShowMore(showMore, selectedDate)}
                    style={customStyles.showMoreButton}
                  >
                    {showMore.label}
                  </button>
                );
              },
              toolbar: (props) => (
                <div className="mt-5 mb-2 flex items-center justify-between">
                  <div
                    className="flex flex-1 items-center justify-center"
                    style={{ position: 'relative' }}
                  >
                    {/* <div style={{ position: 'relative' }}> */}
                    <Button
                      type="button"
                      style={{
                        ...commanStyle,
                        borderTopLeftRadius: '10px',
                        borderBottomLeftRadius: '10px',
                      }}
                      onClick={() => handleNavigate('prev')}
                    >
                      <MdKeyboardArrowLeft />
                    </Button>
                    <Button
                      type="button"
                      style={{
                        ...commanStyle,
                        // marginBottom:'2px',
                        backgroundColor: moment(selectedDate).isSame(
                          moment(),
                          'day'
                        )
                          ? 'black'
                          : 'white',
                        color: moment(selectedDate).isSame(moment(), 'day')
                          ? 'white'
                          : 'black',
                      }}
                      onClick={() => handleNavigate('today')}
                    >
                      Today
                    </Button>
                    <Button
                      style={{
                        ...commanStyle,
                        zIndex: showCalander ? 1 : 'unset',
                      }}
                      onClick={onhowCalannder}
                    >
                      {selectedValueType.value === 'month'
                        ? moment(selectedDate).format('MMMM YYYY')
                        : selectedValueType.value === 'week'
                        ? `${moment(selectedDate)
                            .startOf('isoWeek')
                            .format('D')} - ${moment(selectedDate)
                            .endOf('isoWeek')
                            .format('D MMM, YYYY')}`
                        : selectedValueType.value === 'day' &&
                          moment(selectedDate).format('dddd D MMM, YYYY')}
                    </Button>
                    {showCalander && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%', // Adjust this value to position it correctly
                          left: '50%', // Center horizontally initially
                          transform: 'translateX(-50%)', // Center horizontally initially
                          zIndex: '50',
                        }}
                      >
                        <SmallCalendar
                          color="bg-accent"
                          date={selectedDate}
                          onChange={handleSelect}
                        />
                      </div>
                    )}
                    {/* </div> */}

                    <Button
                      type="button"
                      style={{
                        ...commanStyle,
                        borderTopRightRadius: '10px',
                        borderBottomRightRadius: '10px',
                      }}
                      onClick={() => handleNavigate('next')}
                    >
                      <MdKeyboardArrowRight />
                    </Button>
                  </div>
                  <div className="w-130 mr-1">
                    <Select
                      styles={{ ...selectStyles }}
                      getOptionLabel={(option:any) => option.label}
                      getOptionValue={(option:any) => option.key}
                      options={valueType}
                      value={selectedValueType} // Set the default value
                      className={!pluginDrawer ? 'custom-select' : ''}
                      onChange={OnChangeValueType}
                    />
                  </div>
                </div>
              ),
              // eventWrapper: eventWrapper,
            }}
          />
        </>
      </div>

      <Drawer
        open={pluginDrawer}
        onClose={closeFunctionPluginDrawer}
        variant="right"
      >
        <DrawerWrapper onClose={closeFunctionPluginDrawer} hideTopBar={false}>
          <div className="m-auto mb-2 mt-2  rounded bg-light p-4 sm:w-[28rem]">
            <>
              {/* {console.log(selectedEvent)} */}
              <div className="grid grid-cols-8 gap-4">
                <div className="col-span-2 flex items-center justify-center">
                  <div className="avatar-circle">
                    <span className="text-white">
                      {selectedEvent?.booking?.customer?.name[0]}
                    </span>
                  </div>
                </div>

                <div className="col-span-6">
                  <h3 className="font-semibold">
                    {selectedEvent?.booking?.customer?.name}
                  </h3>
                  <p className="">{selectedEvent?.booking?.customer?.email}</p>
                </div>
              </div>
              <div className="mt-3 grid">
                <hr />
                <p>
                  {moment(selectedEvent?.booking?.date).format(
                    'dddd D MMM, YYYY'
                  )}
                </p>
                <div>
                  <p className="mt-3" style={{ color: 'black' }}>
                    {selectedEvent?.service}
                  </p>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <p>{selectedEvent?.startEndTime}</p>
                    <p style={{ marginLeft: '10px' }}>
                      {currency}{' '}
                      {Math.round(
                        parseFloat(selectedEvent?.booking?.service?.price)
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-130 mt-5">
                <Select
                 getOptionLabel={(option:any) => option.label}
                 getOptionValue={(option:any) => option.key}
                  styles={{ ...selectStyles }}
                  className={!pluginDrawer ? 'custom-select' : ''}
               
                  options={bookingStatusType}
                  value={selectedBookingStatus} // Set the default value
                  onChange={OnChangeBookingStatus}
                />
              </div>
              <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                <Button
                  className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                  loading={creatingLoading}
                  onClick={() =>
                    bookingStatusUpdate(selectedEvent, selectedBookingStatus)
                  }
                  // disabled={Google == null || Google == '' ? true : false}
                >
                  <div className="flex-1 pt-3 text-center text-light">
                    {t('form:button-label-save')}
                  </div>
                </Button>
              </footer>
            </>
          </div>
        </DrawerWrapper>
      </Drawer>
    </>
  );
};

export default MyCalendar;
