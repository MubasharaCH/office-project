import { GetFunction } from '@/services/Service';
import Link from 'next/link';
import React, { useState } from 'react';
import Card from '../common/card';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';

export default function CreateOrUpdateTypeForm({src, title, description, buttonName, disabled, href}: any) {
  
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState();
  const { t } = useTranslation();

  React.useEffect(() => {
    setloadingData(true)
    GetFunction('/storefront').then((result) => {
      const devURl: any = `https://${result.data.domain}.myignite.site`;
      setListData(devURl);
      setloadingData(false);
    });
  }, []);


  return (
    <>
      <Card className="w-full sm:w-8/12 md:w-2/3">
        <div className="grid grid-cols-5 items-center gap-4">
          <img
            style={{ width: '100px', height: '100px' }}
            src={src}
            alt="img"
          />

          <div className="col-span-2">
            <h1 className="font-bold">{title}</h1>
            <p className="text-sm text-body">{description}</p>
            {title == 'Website' ? (
              <span>
                <a
                  style={{ color: '#3D98FB' }}
                  target="_blank"
                  rel="noreferrer"
                  href={ListData}
                >
                  {ListData}
                </a>
              </span>
            ) : null}
          </div>

          <div className="col-span-2 flex justify-center">
            <Link  href={href}>
              <button
                className=" w-4/5 rounded border border-black p-3"
                style={
                  disabled == true
                    ? {
                        backgroundColor: '#E1E4E7',
                        color: '#B4B6B9',
                        border: 'none',
                      }
                    : { backgroundColor: 'none' }
                }
                disabled={disabled}
              >
                {buttonName}
              </button>
            </Link>
          </div>
        </div>
      </Card>
    </>
  );
};

