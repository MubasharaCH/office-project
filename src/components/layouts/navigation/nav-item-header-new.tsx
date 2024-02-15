import { ChevronRight } from '@/components/icons/chevron-right';
import * as sidebarIcons from '@/components/icons/sidebar';
import { useUI } from '@/contexts/ui.context';
import { getIcon } from '@/utils/get-icon';
import { useTranslation } from 'next-i18next';
import Router, { useRouter, withRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import cn from 'classnames';
const resolveLinkPath = (childTo: any, parentTo: any) =>
  `${parentTo}/${childTo}`;

const NavItemHeaders = (props) => {
  const { item, expanded, setExpand } = props;
  const { label, icon, children } = item;
  const { t } = useTranslation('common');
  const [packageDetail, setPackageDetail] = useState<any>({});
  const [subscriptionsDetail, setSubscriptionsDetail] = useState<any>({});
  const { locale } = useRouter();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const { closeSidebar } = useUI();
  React.useEffect(() => {
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (businessDetail) {
      setPackageDetail(businessDetail?.subscriptions[0]?.package_details);
      setSubscriptionsDetail(businessDetail?.subscriptions[0]);
    }
  }, []);
  // useEffect(() => {
  //   permissionList?.filter((item) => {
  //     // if (item.toLocaleLowerCase().includes('user.view')) {
  //     //   children.map((item) => {
  //     //     if (item.label == 'users') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('supplier.view')) {
  //     //   children.map((item) => {
  //     //     if (item.label == 'supplier') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('roles.view')) {
  //     //   children.map((item) => {
  //     //     if (item.label == 'roles') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('product.view')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'products') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('category.view')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'categories') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('brand.view')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'brands') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('unit.view')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'units') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }

  //     // if (item.toLocaleLowerCase().includes('product.view')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'variation') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('sell.view')) {
  //     //   children.map((item) => {
  //     //     if (item.label == 'invoices') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('list_drafts')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'drafts') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('list_quotations')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'quotations') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('access_sell_return')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'credit-notes') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('purchase_n_sell_report.view')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'sales-report') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('profit_loss_report.view')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'profit-loss-report') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('all_product_stock')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label === 'stock-report') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('purchase_n_sell_report.view')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'sales-report-by-payment') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('sales_summary_report')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'sales-summary') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('sales_item_report')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'product-sales') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('sales_category_report')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'category-sales') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('sales_employee_report')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'employee-sales') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('tax_report.view')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'tax-summary') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //     // if (item.toLocaleLowerCase().includes('tip_report')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'tip-report') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }

  //     // if (item.toLocaleLowerCase().includes('business_settings_storefront')) {
  //     //   children.map((item: any) => {
  //     //     if (item.label == 'online-store') {
  //     //       setAccessList((current) => [...current, item]);
  //     //     }
  //     //   });
  //     // }
  //   });
  //   permissionList?.filter((item) => {
  //     if (item.toLocaleLowerCase().includes('business_settings.access')) {
  //       children.map((item: any) => {
  //         if (item.label == 'business') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('sell.create')) {
  //       children.map((item: any) => {
  //         if (item.label == 'devices') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('business_settings.access')) {
  //       children.map((item: any) => {
  //         if (item.label == 'location') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('view_product_stock_value')) {
  //       children.map((item: any) => {
  //         if (item.label == 'stock-sale-report') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('sales_representative.view')) {
  //       children.map((item: any) => {
  //         if (item.label == 'shift-report') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('coupons.view')) {
  //       children.map((item: any) => {
  //         if (item.label == 'coupons') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('abondend_cart.view')) {
  //       children.map((item: any) => {
  //         if (item.label == 'abandoned-cart') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('business_settings_pos')) {
  //       children.map((item: any) => {
  //         if (item.label === 'POS_Setting') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('business_settings_storefront')) {
  //       children.map((item: any) => {
  //         if (item.label === 'text-storefront') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('product.import')) {
  //       children.map((item: any) => {
  //         if (item.label === 'import-products') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('sales_agent.view')) {
  //       children.map((item: any) => {
  //         if (item.label === 'Sales-agent') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //   });
  //   children.map((item: any) => {
  //     if (item.label === 'sales-channel') {
  //       setAccessList((current) => [...current, item]);
  //     }
  //     if (item.label === 'manage-stock') {
  //       setAccessList((current) => [...current, item]);
  //     }

  //     if (item.label === 'mobile-app') {
  //       setAccessList((current) => [...current, item]);
  //     }
  //     if (item.label === 'import-invoice') {
  //       setAccessList((current) => [...current, item]);
  //     }
  //     if (item.label === 'customers') {
  //       setAccessList((current) => [...current, item]);
  //     }
  //     if (item.label === 'supplier') {
  //       setAccessList((current) => [...current, item]);
  //     }
  //     if (item.label === 'onBoarding') {
  //       setAccessList((current) => [...current, item]);
  //     }
  //   });
  //   permissionList?.filter((item) => {
  //     if (item.toLocaleLowerCase().includes('invoice_settings.access')) {
  //       children.map((item: any) => {
  //         if (item.label === 'Invoice-Layout') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('notification.view')) {
  //       children.map((item: any) => {
  //         if (item.label === 'notification') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('size_chart.view')) {
  //       children.map((item: any) => {
  //         if (item.label === 'sizeChart') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('table.view')) {
  //       children.map((item: any) => {
  //         if (item.label === 'table') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('tax_rate.view')) {
  //       children.map((item: any) => {
  //         if (item.label == 'tax') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('purchase.view')) {
  //       children.map((item: any) => {
  //         if (item.label == 'purchase') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //       children.map((item: any) => {
  //         if (item.label == 'stock-transfer') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //       children.map((item: any) => {
  //         if (item.label == 'stock-adjustment') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('access_store_plugins')) {
  //       children.map((item: any) => {
  //         if (item.label === 'store-plugin') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('integration.view')) {
  //       children.map((item: any) => {
  //         if (item.label === 'Integrations') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('access_shipping')) {
  //       children.map((item: any) => {
  //         if (item.label === 'ignite-shipping') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('purchase.payments')) {
  //       children.map((item: any) => {
  //         if (item.label === 'payment') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('sell.create')) {
  //       children.map((item: any) => {
  //         if (item.label === 'text-billing') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //         if (item.label === 'text-pay-link') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('marketplace.view')) {
  //       children.map((item: any) => {
  //         if (item.label === 'marketPlace') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //     if (item.toLocaleLowerCase().includes('marketplace.view')) {
  //       children.map((item: any) => {
  //         if (item.label === 'socialCommerce') {
  //           setAccessList((current) => [...current, item]);
  //         }
  //       });
  //     }
  //   });
  // }, []);

  const onChildClick = (i) => {
    if (i.href == '/marketPlace') {
      const { shopify } = subscriptionsDetail?.package;
      if (shopify === 1) {
        if (subscriptionsDetail?.shopify === 1) {
        } else {
          toast.error(t('common:enable_addon_desc'));
          return;
        }
      } else {
        toast.error(t('common:enable_addon'));
        return;
      }
    } else if (i.href == 'roles') {
      const { roles_management } = subscriptionsDetail?.package;
      if (roles_management === 1) {
        if (subscriptionsDetail?.enable_roles_management === 1) {
        } else {
          toast.error(t('common:enable_addon_desc'));
          return;
        }
      } else {
        toast.error(t('common:enable_addon'));
        return;
      }
    } else if (i.href == 'sizeChart') {
      const { size_charts } = subscriptionsDetail?.package;
      if (size_charts === 1) {
        if (subscriptionsDetail?.enable_size_chart === 1) {
        } else {
          toast.error(t('common:enable_addon_desc'));
          return;
        }
      } else {
        toast.error(t('common:enable_addon'));
        return;
      }
    } else if (i.href == 'booking') {
      const { booking } = subscriptionsDetail?.package;
      if (booking === 1) {
        if (subscriptionsDetail?.booking === 1) {
        } else {
          toast.error(t('common:enable_addon_desc'));
          return;
        }
      } else {
        toast.error(t('common:enable_addon'));
        return;
      }
    } else if (i.href == 'purchase') {
      const { purchase } = subscriptionsDetail?.package;
      if (purchase === 1) {
        if (subscriptionsDetail?.purchase === 1) {
        } else {
          toast.error(t('common:enable_addon_desc'));
          return;
        }
      } else {
        toast.error(t('common:enable_addon'));
        return;
      }
    }
    // console.log(i)//href: 'roles'
    closeSidebar();
    if (packageDetail?.name == 'Free package' && i.href == 'abandonedCart') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else if (packageDetail?.name == 'Free package' && i.href == 'coupons') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else if (
      packageDetail?.name == 'Free package' &&
      i.href == '/mobileApp'
    ) {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else if (
      packageDetail?.name == 'Free package' &&
      i.href == 'salesAgent'
    ) {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else if (
      packageDetail?.name == 'Free package' &&
      i.href == 'stockTransfer'
    ) {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else if (i.href == 'stockAdjustment') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else if (packageDetail?.name == 'Free package') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else if (
      i.href == 'importProducts' &&
      packageDetail?.name == 'Free package'
    ) {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else {
      Router.push(resolveLinkPath(i.href, props.item.href));
    }
  };
  const toggleCollapse = useCallback(() => {
    setExpand((prevValue) => !prevValue);
  }, []);
  const onExpandChange = useCallback((e: any) => {
    e.preventDefault();
    if (children?.length > 0) {
      toggleCollapse();
    }
  }, []);
  return (
    <div>
      <button
        onClick={onExpandChange}
        className={`flex w-full items-center rounded-md px-3 py-2.5 text-sm text-body-dark text-start hover:bg-gray-100 focus:text-accent  
        ${expanded ? 'bg-gray-100 font-medium' : ''}`}
        dir={dir}
      >
        {/* {expanded && (
          <img
            alt="img"
            style={{
              position: 'absolute',
              width: 13,
              [dir === 'rtl' ? 'left' : 'right']: 22,
            }}
            src="/image/dropBottom.png"
            className=''
          />
        )}
        {!expanded && (
          <img
            alt="img"
            style={{
              position: 'absolute',
              width: 15,
              [dir === 'rtl' ? 'left' : 'right']: 22,
              transform: `scaleX(${dir === 'rtl' ? -1 : 1})`,
            }}
            src="/image/dropRight.png"
          />
        )} */}

        {getIcon({
          iconList: sidebarIcons,
          iconName: icon,
          className: 'w-5 h-5 me-3',
        })}
        <span
          style={{ [dir === 'rtl' ? 'marginRight' : 'marginLeft']: '0rem' }}
        >
          {t(`common:${label}`)}
        </span>
        <ChevronRight
          className={cn(
            'h-3.5 w-3.5 shrink-0 opacity-75 transition-transform duration-300 ltr:ml-auto ltr:mr-0 rtl:mr-auto rtl:ml-0',
            expanded ? 'rotate-90 transform' : ''
          )}
        />
      </button>

      {/* <button
          onClick={onExpandChange}
          className="flex w-full items-center text-base text-body-dark text-start focus:text-accent"
          dir={dir}
        >
          {getIcon({
            iconList: sidebarIcons,
            iconName: icon,
            className: 'w-5 h-5 me-4',
          })}
          <span>{t(`common:${label}`)}</span>

          {expanded && (
            <img
              alt="img"
              style={{ position: 'absolute', width: 13, right: 20 }}
              src="/image/dropBottom.png"
            />
          )}
          {!expanded && (
            <img
              alt="img"
              style={{ position: 'absolute', width: 15, right: 20 }}
              src="/image/dropRight.png"
            />
          )}
        </button> */}

      {expanded ? (
        <div style={{ marginTop: 0, marginBottom: 0 }}>
          {children.map((item: any, index: any) => {
            const key = `${item.label}-${index}`;
            const { children } = item;

            if (children) {
              return (
                <div key={index}>
                  <NavItemHeaders
                    item={{
                      ...item,
                      href: resolveLinkPath(item.href, props.item.href),
                    }}
                  />
                </div>
              );
            }
            return (
              <span
                onClick={() => onChildClick(item)}
                key={key}
                // href={resolveLinkPath(item.href, props.item.href)}
                className="flex w-full cursor-pointer items-center pl-5 pt-5 text-sm  text-body-dark text-start focus:text-accent"
              >
                {getIcon({
                  iconList: sidebarIcons,
                  iconName: item.icon,
                  className: 'w-5 h-5 me-4',
                })}
                <span style={{ marginTop: 0 }}>
                  {t(`common:${item.label}`)}
                </span>
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default withRouter(NavItemHeaders);
