import MobileNavigation from '@/components/layouts/navigation/mobile-navigation';
import SidebarItem from '@/components/layouts/navigation/sidebar-item';
import Navbar from '@/components/layouts/navigation/top-navbar';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import iconn from '../../../../public/image/favicon.png';
import {
  GetFunction,
  AddingFunction,
  GetFunctionBDetail,
  UpdateUserFunction,
  AddShipping,
} from '@/services/Service';
const AdminLayout: React.FC = ({ children }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [isGreater, setIsGreater] = useState(false);
  const [dateArray, setDateArray] = useState([]);
  const [filterList, setFilterList] = useState<any>([]);
  const userDetail: any = localStorage.getItem('user_detail');
  const userData: any = JSON.parse(userDetail);
  const permissionList = userData?.all_permissions;
  const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';
  const [accessList, setAccessList] = useState<any>([]);
  const [isInvoicing, setIsInvoicing] = useState<any>(false);

  // React.useEffect(() => {
  //   let businessDetail: any = localStorage.getItem('user_business_details');
  //   let businessName: any = JSON.parse(businessDetail);
  //   let subscriptions = businessName?.subscriptions;
  //   let subscriptionData = subscriptions.map((data, i) => {
  //     let date = new Date(data.end_date);
  //     return date;
  //   });
  //   setDateArray(subscriptionData);
  // }, []);

  // React.useEffect(() => {
  //   const today = new Date();
  //   for (let i = 0; i < dateArray.length; i++) {
  //     if (today > dateArray[i]) {
  //       setIsGreater(true);
  //       break;
  //     }
  //   }
  // }, [dateArray]);
  
  useEffect(() => {
    
  

    siteSettings.sidebarLinks.admin.map((item) => {
      const { label, href, icon, children } = item;
      let accessItem = { label: label, href: href, icon: icon, children: [] };
      let childrenArray: any = [];
      if (children) {
        permissionList?.filter((item) => {
          if (item.toLocaleLowerCase().includes('user.view')) {
            children?.map((item) => {
              if (item.label == 'users') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('roles.view')) {
            children.map((item) => {
              if (item.label == 'roles') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('product.view')) {
            children.map((item: any) => {
              if (item.label == 'products') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('category.view')) {
            children.map((item: any) => {
              if (item.label == 'categories') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('brand.view')) {
            children.map((item: any) => {
              if (item.label == 'brands') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('collection.view')) {
            children.map((item: any) => {
              if (item.label == 'collections') {
                childrenArray.push(item);
              }
            });
          }

          if (item.toLocaleLowerCase().includes('tag.view')) {
            children.map((item: any) => {
              if (item.label == 'tags') {
                childrenArray.push(item);
              }
            });
          }
    
          if (item.toLocaleLowerCase().includes('unit.view')) {
            children.map((item: any) => {
              if (item.label == 'units') {
                childrenArray.push(item);
              }
            });
          }

          if (item.toLocaleLowerCase().includes('product.view')) {
            children.map((item: any) => {
              if (item.label == 'variation') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('sell.view')) {
            children.map((item) => {
              if (item.label == 'invoices') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('list_drafts')) {
            children.map((item: any) => {
              if (item.label == 'drafts') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('list_quotations')) {
            children.map((item: any) => {
              if (item.label == 'quotations') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('access_sell_return')) {
            children.map((item: any) => {
              if (item.label == 'credit-notes') {
                childrenArray.push(item);
              }
            });
          }
          if (
            item.toLocaleLowerCase().includes('purchase_n_sell_report.view')
          ) {
            children.map((item: any) => {
              if (item.label == 'sales-report') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('profit_loss_report.view')) {
            children.map((item: any) => {
              if (item.label == 'profit-loss-report') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('all_product_stock')) {
            children.map((item: any) => {
              if (item.label === 'stock-report') {
                childrenArray.push(item);
              }
            });
          }
          if (
            item.toLocaleLowerCase().includes('purchase_n_sell_report.view')
          ) {
            children.map((item: any) => {
              if (item.label == 'sales-report-by-payment') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('sales_summary_report')) {
            children.map((item: any) => {
              if (item.label == 'sales-summary') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('sales_item_report')) {
            children.map((item: any) => {
              if (item.label == 'product-sales') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('sales_category_report')) {
            children.map((item: any) => {
              if (item.label == 'category-sales') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('sales_employee_report')) {
            children.map((item: any) => {
              if (item.label == 'employee-sales') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('bookings')) {
            children.map((item: any) => {
              if (item.label == 'booking-list' && !childrenArray.includes(item)) {

                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('tax_report.view')) {
            children.map((item: any) => {
              if (item.label == 'tax-summary') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('tip_report')) {
            children.map((item: any) => {
              if (item.label == 'tip-report') {
                childrenArray.push(item);
              }
            });
          }

          if (
            item.toLocaleLowerCase().includes('business_settings_storefront')
          ) {
            children.map((item: any) => {
              if (item.label == 'online-store') {
                childrenArray.push(item);
              }
            });
          }
        });
        permissionList?.filter((item) => {
          if (item.toLocaleLowerCase().includes('business_settings.access')) {
            children.map((item: any) => {
              if (item.label == 'business') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('sell.create')) {
            children.map((item: any) => {
              if (item.label == 'devices') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('business_settings.access')) {
            children.map((item: any) => {
              if (item.label == 'location') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('view_product_stock_value')) {
            children.map((item: any) => {
              if (item.label == 'stock-sale-report') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('sales_representative.view')) {
            children.map((item: any) => {
              if (item.label == 'shift-report') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('coupons.view')) {
            children.map((item: any) => {
              if (item.label == 'coupons') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('abondend_cart.view')) {
            children.map((item: any) => {
              if (item.label == 'abandoned-cart') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('business_settings_pos')) {
            children.map((item: any) => {
              if (item.label === 'POS_Setting') {
                childrenArray.push(item);
              }
            });
          }
          if (
            item.toLocaleLowerCase().includes('business_settings_storefront')
          ) {
            children.map((item: any) => {
              if (item.label === 'text-storefront') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('product.import')) {
            children.map((item: any) => {
              if (item.label === 'import-products') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('sales_agent.view')) {
            children.map((item: any) => {
              if (item.label === 'Sales-agent') {
                childrenArray.push(item);
              }
            });
          }
        });
        children.map((item: any) => {
          if (item.label === 'sales-channel') {
            childrenArray.push(item);
          }
          if (item.label === 'manage-stock') {
            childrenArray.push(item);
          }

          if (item.label === 'mobile-app') {
            childrenArray.push(item);
          }
          if (item.label === 'import-invoice') {
            childrenArray.push(item);
          }
          if (item.label === 'customers') {
            childrenArray.push(item);
          }
          if (item.label === 'supplier') {
            childrenArray.push(item);
          }
          if (item.label == 'onBoarding') {
            childrenArray.push(item);
          }
        });
        permissionList?.filter((item) => {
          if (item.toLocaleLowerCase().includes('invoice_settings.access')) {
            children.map((item: any) => {
              if (item.label === 'Invoice-Layout') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('notification.view')) {
            children.map((item: any) => {
              if (item.label === 'notification') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('size_chart.view')) {
            children.map((item: any) => {
              if (item.label === 'sizeChart') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('table.view')) {
            children.map((item: any) => {
              if (item.label === 'table') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('tax_rate.view')) {
            children.map((item: any) => {
              if (item.label == 'tax') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('purchase.view')) {
            children.map((item: any) => {
              if (item.label == 'purchase') {
                childrenArray.push(item);
              }
            });
            children.map((item: any) => {
              if (item.label == 'stock-transfer') {
                childrenArray.push(item);
              }
            });
            children.map((item: any) => {
              if (item.label == 'stock-adjustment') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('access_store_plugins')) {
            children.map((item: any) => {
              if (item.label === 'store-plugin') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('integration.view')) {
            children.map((item: any) => {
              if (item.label === 'Integrations') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('access_shipping')) {
            children.map((item: any) => {
              if (item.label === 'ignite-shipping') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('purchase.payments')) {
            children.map((item: any) => {
              if (item.label === 'payment') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('sell.create')) {
            children.map((item: any) => {
              if (item.label === 'text-billing') {
                childrenArray.push(item);
              }
              if (item.label === 'text-pay-link') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('marketplace.view')) {
            children.map((item: any) => {
              if (item.label === 'marketPlace') {
                childrenArray.push(item);
              }
            });
          }
          if (item.toLocaleLowerCase().includes('marketplace.view')) {
            children.map((item: any) => {
              if (item.label === 'socialCommerce') {
                childrenArray.push(item);
              }
            });
          }
        });
        accessItem.children = childrenArray;
        setAccessList((current) => [...current, accessItem]);
      } else {
        let access = { label: label, href: href, icon: icon };
        permissionList?.filter((item) => {
          if (
            label === 'dashboard' &&
            item.toLocaleLowerCase().includes('business_settings_dashboard')
          ) {
            setAccessList((current) => [...current, access]);
          }
        });
        if (
          label === 'superAdmin' &&
          userData?.email == 'rehannadeem93@gmail.com'
        ) {
          setAccessList((current) => [...current, access]);
        }
      }
    });
  }, []);

  const SidebarItemMap = () => (
    <Fragment>
      {accessList?.map((item, index) => (
        <SidebarItem
          style={{ marginBottom: 50 }}
          key={`${item.label}-${index}`}
          item={item}
        />
      ))}
      <div
        style={{
          bottom: 0,
          position: 'fixed',
          display: 'flex',
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#fff',
          width: 270,
        }}
      >
        <Image alt="img" height={25} width={40} src={iconn} />
        <h6 className="pt-2" style={{ color: 'gray' }}>
          {t('common:powered-ignite')}
          {/* Powered by Ignite-v2.2.1 */}
        </h6>
      </div>
    </Fragment>
  );

  return (
    <div
      className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150"
      dir={dir}
    >
      <Navbar />
      <MobileNavigation>
        <SidebarItemMap />
      </MobileNavigation>

      <div className="flex flex-1 pt-20">
        <aside className="xl:w-76 fixed bottom-0 hidden h-full w-72 overflow-y-auto bg-white px-4 pt-22 shadow ltr:left-0 ltr:right-auto rtl:right-0 rtl:left-auto lg:block">
          <div className="flex flex-col space-y-1.5 py-3 pb-24">
            <SidebarItemMap />
          </div>
        </aside>
        <main className="ltr:xl:pl-76 rtl:xl:pr-76 w-full ltr:lg:pl-72 rtl:lg:pr-72 rtl:lg:pl-0">
          <div className="h-full p-5 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
