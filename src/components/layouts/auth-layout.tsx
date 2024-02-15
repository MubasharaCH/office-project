import { Router, useRouter } from 'next/router';
import Logo from '@/components/ui/logo';
import React from 'react';
// import immmmm from '../../../public/image/bg-50.jpg';
import Image from 'next/image';
import LanguageSwitcher from './navigation/language-switer';
import { route } from 'next/dist/server/router';
export default function AuthPageLayout({
  children,
}: React.PropsWithChildren<{}>) {
  // const { locale } = useRouter();
  // const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';
  const router = useRouter();

  return (
    // <div
    //   className="flex h-screen items-center justify-center "
    //   // dir={dir}
    // >
    //   <Image src={immmmm} />

    //   <div className="m-auto  w-full max-w-[420px] rounded px-5 py-2 sm:px-8 sm:py-3 sm:shadow">
    //     <div className="mb-1 flex justify-center">
    //       <Logo />
    //     </div>
    //     {children}
    //   </div>
    // </div>
    <div
      style={{
        position: 'relative',
        height: '100vh',
      }}
    >
      {/* {router.route != '/login' && ( */}
      <div className="flex justify-end pr-5 pt-5 pl-5">
        <LanguageSwitcher />
      </div>
      {/* )} */}
      <img
        src="/image/bg-50.jpg"
        className="absolute inset-0 h-full w-full object-cover object-center"
        alt="Image"
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
        }}
      >
        <div className="m-auto  w-full max-w-[420px] rounded bg-white px-5 py-2 sm:px-8 sm:py-3 sm:shadow">
          <div className="mb-1 flex justify-center">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}