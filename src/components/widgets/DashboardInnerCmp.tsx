import { useRouter } from 'next/router';
import React from 'react';
import Button from '../ui/button';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { AddingFunction, AddingUserFunction } from '@/services/Service';
import { toast } from 'react-toastify';

const DashboardInner = ({
  icon,
  iconBgStyle,
  comText,
  comTextTitle,
  changeIcon,
  rightIcon,
  tickIcon,
  tickIconBgStyle,
  rightIconBgStyle,
  onPress,
  onMarkDone,
}: any) => {
  const { locale } = useRouter();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div
      className="flex h-full w-full flex-col rounded"
      style={{ backgroundColor: '#F3F6F9', padding: 15, cursor: 'pointer' }}
    >
      <div className=" grid grid-cols-12 gap-2 justify-between">
        <div
          onClick={onPress}
          className="col-span-2 lg:col-span-1 justify-center self-center lg:p-3 p-2 rounded-full w-fit "
          style={iconBgStyle}
        >
          {icon}
        </div>
        <div
          onClick={onPress}
          className="col-span-8 lg:col-span-10 flex flex-col"
        >
          <span className="">{comText}</span>
          <span className="text-xs font-semibold text-body">
            {comTextTitle}
          </span>
        </div>
        <div className="flex justify-end">
          {changeIcon == true ? (
            <div className="col-span-2 lg:col-span-1 flex justify-end rounded-full">
              <span
                className="w-fit self-center rounded-full"
                style={tickIconBgStyle}
              >
                {tickIcon}
              </span>
            </div>
          ) : (
            <div
              onClick={onPress}
              className="col-span-2 lg:col-span-1 flex  self-center"
              style={{
                [dir === 'rtl' ? 'left' : 'right']: 20,
                transform: `scaleX(${dir === 'rtl' ? -1 : 1})`,
                justifyContent: dir === 'rtl' ? 'start' : 'flex-end',
              }}
            >
              {rightIcon}
            </div>
          )}
          {!changeIcon && (
            <div
              className="col-span-2 lg:col-span-1 flex  self-center"
              style={{
                [dir === 'rtl' ? 'left' : 'right']: 20,
                transform: `scaleX(${dir === 'rtl' ? -1 : 1})`,
                justifyContent: dir === 'rtl' ? 'start' : 'flex-end',
              }}
            >
              <div className="col-span-2 lg:col-span-1 flex justify-end rounded-full">
                <div className="group" onClick={onMarkDone}>
                  <span className="w-fit self-center rounded-full">
                    <IoCheckmarkDoneCircleOutline
                      className="h-8 w-8"
                      color="gray"
                    />
                  </span>
                  <div className="tooltip-text invisible opacity-0 w-24 bg-black text-white text-center text-xs rounded-md py-2 px-4 absolute bottom-10 left-1/2 transform -translate-x-1/2 transition duration-300 group-hover:visible group-hover:opacity-100">
                    Mark as done
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardInner;
