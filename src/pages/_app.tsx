import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import '@/assets/css/main.css';
import '@/assets/css/table.css';
import { UIProvider } from '@/contexts/ui.context';
import { SettingsProvider } from '@/contexts/settings.context';
import ErrorMessage from '@/components/ui/error-message';
import PageLoader from '@/components/ui/page-loader/page-loader';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { useSettingsQuery } from '@/data/settings';
import { ReactQueryDevtools } from 'react-query/devtools';
import { appWithTranslation } from 'next-i18next';
import { ModalProvider } from '@/components/ui/modal/modal.context';
import DefaultSeo from '@/components/ui/default-seo';
import ManagedModal from '@/components/ui/modal/managed-modal';
import { CartProvider } from '@/contexts/quick-cart/cart.context';
import { useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import { useRouter } from 'next/router';
import PrivateRoute from '@/utils/private-route';
import { Config } from '@/config';
import React from 'react';
import '@fontsource/poppins';
import { format } from 'date-fns';
import { Routes } from '@/config/routes';
import moment from 'moment';

const Noop: React.FC = ({ children }) => <>{children}</>;

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
declare global {
  interface Window {
    fcWidget: {
      setExternalId: (id: string) => void;
      user: {
        setFirstName: (firstName: string) => void;
        setEmail: (email: string) => void;
        setProperties: (properties: Record<string, any>) => void;
      };
    };
  }
}
const CustomApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const Layout = (Component as any).Layout || Noop;
  const authProps = (Component as any).authenticate;
  const [queryClient] = useState(() => new QueryClient());
  const [isGreater, setIsGreater] = useState(false);
  const [dateArray, setDateArray] = useState([]);
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();

  const { locale } = useRouter();
  const dir = Config.getDirection(locale);
  const [loading, setLoading] = useState(true);

  useEffect(() => {}, []);

  useEffect(() => {
    const userDetail: any = localStorage?.getItem('user_detail');
    const userData: any = JSON.parse(userDetail);
    const permissionList = userData?.all_permissions;
    if (router) {
      // setLoading(false);
      let pathName: any = router.asPath;
      const path = pathName.split('/').slice(1);
      if (path[1] == 'roles') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'roles.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'tipReport') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'tip_report') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'salesAgent') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'sales_agent.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'products') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'product.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'variant') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'product.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'brands') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'brand.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'units') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'unit.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'categories') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'category.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'importProducts') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'product.import') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'stockTransfer') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'purchase.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'stockAdjustment') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'purchase.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'storesSettings') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'business_settings_storefront') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'marketPlace') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'marketplace.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'invoice') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'sell.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'creditNotes') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'access_sell_return') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'purchase') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'purchase.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'coupons') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'coupons.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'abandonedCart') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'abondend_cart.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'profitLossReport') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'profit_loss_report.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'stockReport') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'all_product_stock') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'reportSales') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'purchase_n_sell_report.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'reportSalesByPayment') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'purchase_n_sell_report.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'reportSalesByPayment') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'tax_report.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'categorySales') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'sales_category_report') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'productSales') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'sales_item_report') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'salesSummary') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'sales_summary_report') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'employeeSales') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'sales_employee_report') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'shiftReport') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'sales_representative.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'stockSaleReport') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'view_product_stock_value') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'devices') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'sell.create') {
            return true;
          }
        });
        // console.log('isPermission:     '+isPermission)
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'businessSettings') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'business_settings.access') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'location') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'business_settings.access') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'product') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'business_settings_pos') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'payment') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'purchase.payments') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'igniteShip') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'access_shipping') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'subscription') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'sell.create') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'invoiceLayout') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'invoice_settings.access') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'tax') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'tax_rate.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'ignitePlugin') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'access_store_plugins') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'users') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'user.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'tipReport') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'tip_report') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'socialCommerce') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'marketplace.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'sizeChart') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'size_chart.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'table') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'table.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      if (path[1] == 'sms') {
        var isPermission = permissionList?.find((item) => {
          if (item == 'notification.view') {
            return true;
          }
        });
        if (!isPermission) {
          router.push('/unauthorize');
        }
      }
      // permissionList?.filter((item) => {
      //   if (item.toLocaleLowerCase().includes(path[1])) {
      //   }

      // });
    }
  }, [router]);
  React.useEffect(() => {
    let businessDetail: any = localStorage.getItem('user_business_details');
    let businessName: any = JSON.parse(businessDetail);
    const userDetail: any = localStorage?.getItem('user_detail');
    const userData: any = JSON.parse(userDetail);

    // To set unique user id in your system when it is available
    window.fcWidget?.setExternalId(userData?.id);

    // To set user name
    window.fcWidget?.user.setFirstName(userData?.first_name);

    // To set user email
    window.fcWidget?.user.setEmail(userData?.email);

    // To set user properties
    window.fcWidget?.user.setProperties({
      cf_plan: businessName?.subscriptions[0]?.package_details?.name,
      cf_status: businessName?.subscriptions[0]?.status,
    });
    if (businessName) {
      let subscriptions = businessName.subscriptions;
      let subscriptionData = subscriptions.map((data, i) => {
        let date = new Date(data.end_date);
        return date;
      });

      setDateArray(subscriptionData);
    }

    setLoading(false);
    document.body.style.fontFamily = 'poppins';
  }, []);

  React.useEffect(() => {
    const today: any = new Date();
    for (let i = 0; i < dateArray.length; i++) {
      if (today > dateArray[i]) {
        setIsGreater(true);
        break;
      }
    }
  }, [dateArray]);
  React.useEffect(() => {
    // if (isGreater){
    //   router.push('/settings/subscription'); // If not authenticated, force log in
    // }
  }, []);

  React.useEffect(() => {
    var loginDate: any = localStorage.getItem('login_time_stamp');
    var date: any = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    if (loginDate > date) {
      // console.log('loginDate > date  '+ loginDate , date)
      router.push(Routes.logout);
    }
  });

  return (
    <div dir={dir}>
      {loading == true ? (
        <PageLoader />
      ) : (
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            {/* <AppSettings> */}
            <UIProvider>
              <ModalProvider>
                <>
                  <CartProvider>
                    {/* <DefaultSeo /> */}
                    {authProps ? (
                      <PrivateRoute authProps={authProps}>
                        <Layout {...pageProps}>
                          <Component {...pageProps} />
                        </Layout>
                      </PrivateRoute>
                    ) : (
                      <Layout {...pageProps}>
                        <Component {...pageProps} />
                      </Layout>
                    )}
                    <ToastContainer autoClose={2000} theme="colored" />
                    <ManagedModal />
                  </CartProvider>
                </>
              </ModalProvider>
            </UIProvider>
            {/* </AppSettings> */}
            {/*  <ReactQueryDevtools /> */}
          </Hydrate>
        </QueryClientProvider>
      )}
    </div>
  );
};

export default appWithTranslation(CustomApp);
