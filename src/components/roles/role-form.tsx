import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useForm, FormProvider } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useRegisterMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Permission } from '@/types';
import Label from '../ui/label';
import { Switch } from '@headlessui/react';
import React from 'react';
import { GetFunction } from '../../services/Service';
import Select from 'react-select';
import { selectStyles } from '../ui/select/select.styles';
import { toast } from 'react-toastify';
import {
  AddingFunction,
  UpdatingCustomerFunction,
  UpdateUserFunction,
} from '@/services/Service';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { result } from 'lodash';

// import Form from 'react-bootstrap/Form';
// import InputGroup from 'react-bootstrap/InputGroup';
type FormValues = {
  role_name: string;
  permissions: string;
  is_service_staff: string;
};

const defaultValues = {
  email: '',
  password: '',
};

export default function UserCreateForm(initialValues: any) {
  const { query, locale } = useRouter();

  const [value, setValue] = React.useState<any>(false);
  const [location, setLocation] = React.useState<any>(false);
  const [status, setStatus] = React.useState<any>(true);
  const [RoleDataArray, setRoleDataArray] = React.useState<any[]>([]);
  const [roleDropId, setRoleDropId] = useState<any>();
  const [permissions, rolePermissions] = useState<any>();
  const [checkboxes, setChecked] = useState<any>([]);
  const [role, setRole] = useState<any>([]);
  const [slug, setSlug] = useState<any>([]);
  const [PermissionDataArray, setPermissionDataArray] = useState<any>([]);
  const [CheckedPermissionDataArray, setCheckedPermissionDataArray] =
    useState<any>([]);
  if (query.slug != undefined) {
    setSlug((slug: any) => true);
  }

  // const [userPermissionArray, setUserPermissionArr] = React.useState<any[]>([]);

  // const { mutate: registerUser, isLoading: loading } = useRegisterMutation();

  React.useEffect(() => {
    GetFunction('/get-roles').then((result) => {
      let dataa = result.data;
      let keys = Object.keys(dataa);
      const getPermissions = initialValues.initialValues
        ? initialValues.initialValues.permissions
        : '';

      if (getPermissions) {
        let permissionData = getPermissions.map((data, i) => {
          // console.log(dataa[data]);
          const name = data.name;
          console.log(name);
          return name;
        });

        console.log(getPermissions);
        setCheckedPermissionDataArray(permissionData);
        setPermissionDataArray(permissionData);
      }
    });

    if (initialValues.initialValues?.is_service_staff == '1') {
      setStatus((status: any) => true);
    } else {
      setStatus((status: any) => false);
    }
    if (initialValues.initialValues?.name) {
      const role_name = initialValues.initialValues?.name.split('#')[0];
      setRole((role: any) => role_name);
    } else {
      const role_name = '';
      setRole((role: any) => role_name);
    }
  }, []);

  // console.log(PermissionDataArray);

  var userPermission = [
    {
      User: [
        {
          name: 'user.view',
          value: 'view-user',
        },
        {
          name: 'user.create',
          value: 'add-user',
        },
        {
          name: 'user.update',
          value: 'update-user',
        },
        {
          name: 'user.delete',
          value: 'delete-user',
        },
      ],
      Role: [
        {
          name: 'roles.view',
          value: 'view-role',
        },
        {
          name: 'roles.create',
          value: 'add-role',
        },
        {
          name: 'roles.update',
          value: 'edit-role',
        },
        {
          name: 'roles.delete',
          value: 'delete-role',
        },
      ],
      Supplier: [
        {
          name: 'supplier.view',
          value: 'view-supplier',
        },
        {
          name: 'supplier.create',
          value: 'add-supplier',
        },
        {
          name: 'supplier.view_own',
          value: 'view-own-supplier',
        },
        {
          name: 'supplier.update',
          value: 'update-supplier',
        },
        {
          name: 'supplier.delete',
          value: 'delete-supplier',
        },
      ],
      Customer: [
        {
          name: 'customer.view',
          value: 'view-customer',
        },
        {
          name: 'customer.view_own',
          value: 'view-own-customer',
        },
        {
          name: 'customer.create',
          value: 'add-customer',
        },
        {
          name: 'customer.update',
          value: 'update-customer',
        },
        {
          name: 'customer.delete',
          value: 'delete-customer',
        },
      ],
      Product: [
        {
          name: 'product.view',
          value: 'view-product',
        },
        {
          name: 'product.create',
          value: 'add-product',
        },
        {
          name: 'product.update',
          value: 'update-product',
        },

        {
          name: 'product.delete',
          value: 'delete-product',
        },
        {
          name: 'product.opening_stock',
          value: 'add-opening-stock',
        },
        {
          name: 'product.import',
          value: 'product-import',
        },
        // {
        //   name: 'view_purchase_price',
        //   value: 'View purchase price',
        // }
      ],
      Purchase: [
        {
          name: 'purchase.view',
          value: 'view-purchase-Stock-Adjustment',
        },
        {
          name: 'purchase.create',
          value: 'Add-purchase-stock-adjustment',
        },
        {
          name: 'purchase.update',
          value: 'edit-purchase-stock-adjustment',
        },

        {
          name: 'purchase.delete',
          value: 'delete-purchase-stock-adjustment',
        },
        {
          name: 'purchase.payments',
          value: 'add-edit-delete-payments',
        },
        {
          name: 'purchase.update_status',
          value: 'update-status',
        },
        {
          name: 'view_own_purchase',
          value: 'view-own-purchase-only',
        },
      ],
      Coupon: [
        {
          name: 'coupons.view',
          value: 'view-coupon',
        },
        {
          name: 'coupons.create',
          value: 'create-coupon',
        },
        {
          name: 'coupons.update',
          value: 'update-coupon',
        },

        {
          name: 'coupons.delete',
          value: 'delete-coupon',
        },
      ],
      Cart: [
        {
          name: 'abondend_cart.view',
          value: 'abondend-cart-coupon-view',
        },
        {
          name: 'abondend_cart_settings.view',
          value: 'abondend-cart-coupon-setting-view',
        },
        {
          name: 'abondend_cart_settings.edit',
          value: 'abondend-cart-coupon-setting-edit',
        },

        {
          name: 'abondend_cart_settings.delete',
          value: 'abondend-cart-coupon-setting-delete',
        },
      ],
      Pos: [
        {
          name: 'sell.view',
          value: 'view-pos-sell',
        },
        // {
        //   name: 'sell.create',
        //   value: 'Add POS sell',
        // },
        {
          name: 'sell.add_inovice',
          value: 'add-custom-product',
        },

        // {
        //   name: 'sell.update',
        //   value: 'Edit POS sell',
        // },
        // {
        //   name: 'sell.delete',
        //   value: 'Delete POS sell',
        // },
        {
          name: 'edit_product_price_from_pos_screen',
          value: 'edit-product-price-from-pos-screen',
        },
        // {
        //   name: 'edit_product_discount_from_pos_screen',
        //   value: 'Edit product discount from POS screen',
        // },
        // {
        //   name: 'print_invoice',
        //   value: 'Print Invoice',
        // }
      ],
      Sell: [
        // {
        //   name: 'sell.create',
        //   value: 'Add POS sell',
        // },
        {
          name: 'sell.create',
          value: 'access-sell',
        },
        // {
        //   name: 'direct_sell.delete',
        //   value: 'Delete Sell',
        // },
        // {
        //   name: 'list_drafts',
        //   value: 'Drafts',
        // },

        // {
        //   name: 'list_quotations',
        //   value: 'Quotations',
        // },
        // {
        //   name: 'view_own_sell_only',
        //   value: 'View own sell only',
        // },
        // {
        //   name: 'view_commission_agent_sell',
        //   value: 'Commission agent can view their own sell',
        // },
        {
          name: 'sell.payments',
          value: 'add-edit-delete-payments',
        },
        // {
        //   name: 'edit_product_price_from_sale_screen',
        //   value: 'Edit product price from sales screen',
        // },
        // {
        //   name: 'edit_product_discount_from_sale_screen',
        //   value: 'Edit product discount from Sale screen',
        // },
        // {
        //   name: 'discount.access',
        //   value: 'Add/Edit/Delete Discount',
        // },
        // {
        //   name: 'access_types_of_service',
        //   value: 'Access types of service',
        // },
        {
          name: 'access_sell_return',
          value: 'access-sell-return',
        },
        {
          name: 'create_approve_invoice',
          value: 'Approve-Invoice',
        },
        {
          name: 'show_activity_log',
          value: 'show_activity_log',
        },
        // {
        //   name: 'edit_invoice_number',
        //   value: 'Add edit invoice number',
        // }
      ],
      Shipments: [
        {
          name: 'access_shipping',
          value: 'access-shipments',
        },
        {
          name: 'access_own_shipping',
          value: 'access-own-shipments',
        },
        {
          name: 'access_commission_agent_shipping',
          value: 'commission-agent-can-access-their-own-shipments',
        },
      ],
      Marketplace: [
        {
          name: 'marketplace.view',
          value: 'marketplace-view',
        },
      ],
      Table: [
        {
          name: 'table.view',
          value: 'table-view',
        },
        {
          name: 'table.create',
          value: 'table-create',
        },
        {
          name: 'table.update',
          value: 'table-update',
        },

        {
          name: 'table.delete',
          value: 'table-delete',
        },
      ],
      SizeChart: [
        {
          name: 'size_chart.view',
          value: 'sizeChart-view',
        },
        {
          name: 'size_chart.create',
          value: 'sizeChart-create',
        },
        {
          name: 'size_chart.update',
          value: 'sizeChart-update',
        },
        {
          name: 'size_chart.delete',
          value: 'sizeChart-delete',
        },
      ],
      Notification: [
        {
          name: 'notification.view',
          value: 'notificatioin',
        },
      ],
      Collection:[
        {
          name: 'collection.view',
          value: 'collection-view',
        },
        {
          name: 'collection.create',
          value: 'collection-create',
        },
        {
          name: 'collection.update',
          value: 'collection-update',
        },

        {
          name: 'collection.delete',
          value: 'collection-delete',
        },
      ],
      Tag:[
        {
          name: 'tag.view',
          value: 'tag-view',
        },
        {
          name: 'tag.create',
          value: 'tag-create',
        },
        {
          name: 'tag.update',
          value: 'tag-update',
        },

        {
          name: 'tag.delete',
          value: 'tag-delete',
        },
      ],
      Cash: [
        {
          name: 'view_cash_register',
          value: 'view-cash-register',
        },
        {
          name: 'close_cash_register',
          value: 'close-cash-register',
        },
      ],
      Brand: [
        {
          name: 'brand.view',
          value: 'view-brand',
        },
        {
          name: 'brand.create',
          value: 'add-brand',
        },
        {
          name: 'brand.update',
          value: 'edit-brand',
        },
        {
          name: 'brand.delete',
          value: 'delete-brand',
        },
      ],
      Tax: [
        {
          name: 'tax_rate.view',
          value: 'view-tax-rate',
        },
        {
          name: 'tax_rate.create',
          value: 'add-tax-rate',
        },
        {
          name: 'tax_rate.update',
          value: 'edit-tax-rate',
        },
        {
          name: 'tax_rate.delete',
          value: 'delete-tax-rate',
        },
      ],
      Unit: [
        {
          name: 'unit.view',
          value: 'view-unit',
        },
        {
          name: 'unit.create',
          value: 'add-unit',
        },
        {
          name: 'unit.update',
          value: 'edit-unit',
        },
        {
          name: 'unit.delete',
          value: 'delete-unit',
        },
      ],
      Category: [
        {
          name: 'category.view',
          value: 'view-category',
        },
        {
          name: 'category.create',
          value: 'add-category',
        },
        {
          name: 'category.update',
          value: 'edit-category',
        },
        {
          name: 'category.delete',
          value: 'delete-category',
        },
      ],
      Agent: [
        {
          name: 'sales_agent.view',
          value: 'view-salesagent',
        },
        {
          name: 'sales_agent.create',
          value: 'add-salesagent',
        },
        {
          name: 'sales_agent.update',
          value: 'edit-salesagent',
        },
        {
          name: 'sales_agent.delete',
          value: 'delete-salesagent',
        },
      ],
      Report: [
        {
          name: 'purchase_n_sell_report.view',
          value: 'view-purchase-sell-report',
        },
        {
          name: 'tax_report.view',
          value: 'view-tax-report',
        },
        // {
        //   name: 'contacts_report.view',
        //   value: 'View Supplier & Customer report',
        // },
        // {
        //   name: 'expense_report.view',
        //   value: 'View expense report',
        // },
        {
          name: 'profit_loss_report.view',
          value: 'profit_loss_view',
        },
        {
          name: 'all_product_stock',
          value: 'stock_report_view_Per',
        },
        {
          name: 'stock_report.view',
          value: 'stock_report_view',
        },
        // {
        //   name: 'trending_product_report.view',
        //   value: 'View trending product report',
        // },
        // {
        //   name: 'register_report.view',
        //   value: 'View register report',
        // },
        {
          name: 'sales_representative.view',
          value: 'sales_reresentative_view',
        },
        {
          name: 'view_product_stock_value',
          value: 'product_stock_view',
        },
        // {
        //   name: 'taxes',
        //   value: 'Taxes',
        // },
        {
          name: 'sales_category_report',
          value: 'sale-category-report',
        },
        {
          name: 'sales_item_report',
          value: 'sale-item-report',
        },
        {
          name: 'sales_summary_report',
          value: 'sales-summary-report',
        },
        {
          name: 'sales_employee_report',
          value: 'employee-sale-report',
        },
        {
          name: 'tip_report',
          value: 'tip-report',
        },
      ],
      Settings: [
        {
          name: 'business_settings.access',
          value: 'access-business-settings',
        },

        {
          name: 'access_store_plugins',
          value: 'access_store_plugin',
        },
        // {
        //   name: 'barcode_settings.access',
        //   value: 'Access barcode settings',
        // },
        {
          name: 'invoice_settings.access',
          value: 'access-invoice-settings',
        },
        // {
        //   name: 'expense.access',
        //   value: 'Access expenses',
        // },
        // {
        //   name: 'view_own_expense',
        //   value: 'View own expense only',
        // },
        // {
        //   name: 'access_printers',
        //   value: 'Access printers',
        // },
        // {
        //   name: 'business_settings_general',
        //   value: 'Access business settings general',
        // },
        // {
        //   name: 'business_settings_tax',
        //   value: 'Access business settings tax',
        // },
        // {
        //   name: 'business_settings_product',
        //   value: 'Access business settings product',
        // },
        // {
        //   name: 'business_settings_contact',
        //   value: 'Access business settings contact',
        // },
        // {
        //   name: 'business_settings_sale',
        //   value: 'Access business settings sale',
        // },
        {
          name: 'business_settings_pos',
          value: 'access-business-settings-pos',
        },
        // {
        //   name: 'business_settings_purchase',
        //   value: 'Access business settings purchase',
        // },
        {
          name: 'business_settings_dashboard',
          value: 'access_business_setting_dashboard',
        },
        // {
        //   name: 'business_settings_system',
        //   value: 'Access business settings system',
        // },
        // {
        //   name: 'business_settings_prefixes',
        //   value: 'Access business settings prefixes',
        // },
        // {
        //   name: 'business_settings_email',
        //   value: 'Access business settings email',
        // },
        // {
        //   name: 'business_settings_sms',
        //   value: 'Access business settings sms',
        // },
        // {
        //   name: 'business_settings_reward',
        //   value: 'Access business settings reward',
        // },
        // {
        //   name: 'business_settings_modules',
        //   value: 'Access business settings modules',
        // },
        // {
        //   name: 'business_settings_customlabels',
        //   value: 'Access business settings customlabels',
        // },
        {
          name: 'business_settings_storefront',
          value: 'access-business-settings-storefront',
        },
        {
          name: 'business_settings_tax',
          value: 'tax',
        },
      ],
      Home: [
        {
          name: 'dashboard.data',
          value: 'view-home-data',
        },
      ],
      Account: [
        {
          name: 'account.access',
          value: 'access-accounts',
        },
      ],
      Bookings: [
        {
          name: 'crud_all_bookings',
          value: 'add-edit-view-all-bookings',
        },
        {
          name: 'crud_own_bookings',
          value: 'add-edit-view-own-bookings',
        },
      ],
      access_selling_price_groups: [
        {
          name: 'access_default_selling_price',
          value: 'default-selling-price',
        },
      ],
      Restaurant: [
        {
          name: 'access_tables',
          value: 'access-tables',
        },
      ],
      Manufacturing: [
        {
          name: 'manufacturing.add_recipe',
          value: 'view-recipe',
        },
        {
          name: 'manufacturing.edit_recipe',
          value: 'edit-recipe',
        },

        {
          name: 'manufacturing.access_recipe',
          value: 'access-recipe',
        },
        {
          name: 'manufacturing.access_production',
          value: 'access-production',
        },
      ],
      Superadmin: [
        {
          name: 'superadmin.access_package_subscriptions',
          value: 'access-package-subscriptions',
        },
      ],
      Woocommerce: [
        {
          name: 'woocommerce.syc_categories',
          value: 'sync-product-categories',
        },
        {
          name: 'woocommerce.sync_products',
          value: 'sync-products',
        },
        {
          name: 'woocommerce.sync_orders',
          value: 'sync-orders',
        },

        {
          name: 'woocommerce.map_tax_rates',
          value: 'map-tax-rates',
        },
        {
          name: 'woocommerce.access_woocommerce_api_settings',
          value: 'access-woocommerce-api-settings',
        },
      ],
      Integrations: [
        {
          name: 'integration.view',
          value: 'integration-view',
        },
      ],
      // ApproveInvoice: [
      //   {
      //     name: 'create_approve_invoice',
      //     value: 'Approve-Invoice',
      //   },
      // ],
    },
  ];

  // console.log(userPermission[0]);

  const onChange = (e: any) => {
    setValue((value: any) => !value);
  };
  const onChangeLocation = (e: any) => {
    setLocation((location: any) => !location);
  };
  const onChangeStatus = (e: any) => {
    setStatus((status: any) => !status);
  };

  const handleSelect = (event) => {
    // setChecked(event.target.checked)
    // setChecked([]);

    // setDisableAddBtn(false);
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // setChecked([...checkboxes, value]);
      setPermissionDataArray([...PermissionDataArray, value]);
    } else {
      const filteredList = PermissionDataArray.filter((item) => item !== value);
      const filteredList1 = PermissionDataArray.filter((item) => {});

      // setChecked(filteredList);
      // console.log('filste',filteredList1);

      setPermissionDataArray(filteredList);

      // setChecked(filteredList1);
    }
  };

  const RoleOnChange = (e) => {
    setRoleDropId(e.id);
  };

  const router = useRouter();
  const [creatingLoading, setCreatingLoading] = useState(false);
  const { t } = useTranslation();
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();
  var form = new FormData();
  // const methods = useForm<FormValues>({
  //   resolver: yupResolver(roleValidationSchema),
  //   shouldUnregister: true,
  //   // @ts-ignore
  //   // defaultValues: getProductDefaultValues(initialValues!, isNewTranslation),
  // });

  // const {
  //   register,
  //   handleSubmit,
  //   control,
  //   setError,
  //   watch,
  //   formState: { errors },
  // } = methods;
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: initialValues.initialValues
      ? {
          ...initialValues.initialValues,
        }
      : defaultValues,
  });

  const onSubmit = (values: FormValues) => {
    // console.log(values.role_name ? values.role_name : role);
    // return;

    // if (values.role_name ? values.role_name : role) {
      form.append('name', values.role_name ? values.role_name : role);
      form.append('permissions', PermissionDataArray);
      form.append('is_service_staff', status ? '1' : '0');

      if (initialValues.initialValues) {
        let ID = initialValues.initialValues.id;

        form.append('id', ID);

        setCreatingLoading(true);

        AddingFunction('/roles', form).then((result) => {
          if (result.success == true) {
            toast.success(t('Role updated successfully!'));
            setCreatingLoading(false);
            GetFunction('/user/loggedin').then((result) => {
              localStorage.setItem('user_detail', JSON.stringify(result.data));
            });
            router.back();
          } else {
            console.log(result);
            toast.error(result.message);
            setCreatingLoading(false);
          }
        });
      } else {
        setCreatingLoading(true);

        AddingFunction('/roles', form).then((result) => {
          if (result.success == true) {
            toast.success(t('common:successfully-created'));
            setCreatingLoading(false);
            GetFunction('/user/loggedin').then((result) => {
              localStorage.setItem('user_detail', JSON.stringify(result.data));
            });
            router.back();
          } else {
            toast.error(result.message);
            setCreatingLoading(false);
          }
        });
      }
    // } else {
    //   toast.error('Role name is required');
    // }
  };
  const id = initialValues.initialValues ? initialValues.initialValues.id : '';

  return (
    <>
      {PermissionDataArray.length > 0 ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('form:form-title-information')}
              details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <Input
                  label={t('common:role-name')}
                  {...register('role_name')}
                  type="text"
                  defaultValue={role}
                  variant="outline"
                  className="mb-4"
                />
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:user')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full ">
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-4 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div></div>
                      <div></div>
                      <div></div>
                      {item.User?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            // checked={PermissionDataArray.includes(innerItem.name)}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={checkboxes}
                            onChange={handleSelect}
                            // onChange={(e) => onAddingItem(e, item, index)}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:role')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full ">
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        <label>
                          <b>{t('common:role')}</b>
                        </label>
                      </div>
                      <div>
                        {/* <input
                        style={{ fontStyle: "normal" }}
                        type="checkbox"
                        className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                        value='Permission'
                      />
                      <label >
                        Select All
                      </label> */}
                      </div>
                      <div></div>
                      {item.Role?.map((innerItem, innerIndex) => (
                        <div
                          key={innerIndex}
                          style={{ paddingBottom: '6px', marginBottom: '10px' }}
                        >
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:product')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div></div>
                      <div></div>
                      <div></div>
                      {item.Product?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:supplier')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        <label>
                          <b>{t('common:supplier')}</b>
                        </label>
                      </div>
                      <div></div>
                      <div></div>
                      {item.Supplier?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:customer')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        <label>
                          <b>{t('common:customer')}</b>
                        </label>
                      </div>
                      <div></div>
                      <div></div>
                      {item.Customer?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:agent')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        <label>
                          <b>{t('common:customer')}</b>
                        </label>
                      </div>
                      <div></div>
                      <div></div>
                      {item.Agent?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:purchase')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-2 xl:grid-cols-2"
                    >
                      <div></div>

                      {/* <div></div> */}
                      <div></div>
                      {item.Purchase?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:POS')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-2 xl:grid-cols-2"
                    >
                      <div></div>

                      {/* <div></div> */}
                      <div></div>
                      {item.Pos?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:shipment')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-2 xl:grid-cols-2"
                    >
                      {item.Shipments?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:sell')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-2 xl:grid-cols-2"
                    >
                      {item.Sell?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:brand')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Brand?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:tax-rate')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Tax?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:unit')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Unit?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:category')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Category?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:report')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Report?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:settings')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Settings?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:home')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Home?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:cachier')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Cash?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:coupon')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Coupon?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:cart')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Cart?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:marketplace')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Marketplace?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('Table')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Table?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />

                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('Size Chart')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.SizeChart?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('Collection')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Collection?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('Tag')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Tag?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('Notification')}
              //  details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Notification?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          {/* <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('Approve Invoice')}
              //  details={t('common:add-role-permission')}
              className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.ApproveInvoice?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={
                              PermissionDataArray.includes(innerItem.name)
                                ? true
                                : false
                            }
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div> */}

          {/* <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('form:form-title-information')}
              details={t('common:add-role-permission')}
              className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">

              {/* <Input
                label={t('common:role-name')}
                {...register('role_name')}
                type="text"
                defaultValue={role}
                variant="outline"
                className="mb-4"

              /> */}

          {/* <div style={{ float: 'left', width: '100%', height: '60px', marginBottom: '10px' }} >
              <div style={{ float: 'left' }} className="my-5 text-left flex flex-wrap  pb-8 sm:my-8">
                <Label>{t('common:user-type')}</Label>
              </div>
              <div style={{ float: 'right' }} className="my-5 text-end flex flex-wrap  pb-8 sm:my-8">
                <div className='text-end'>
                  <Label>{t('common:service-staff')}</Label>
  
                  <Switch
                    name='is_service_staff'
                    checked={status}
                    onChange={onChangeStatus}
                    value={status ? "active" : 'inactive'}
                    className={`${status ? 'bg-accent' : 'bg-gray-300'
                      } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                    dir="ltr"
                  >
                    <span className="sr-only">Enable </span>
                    <span
                      className={`${status ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                    />
                  </Switch>
                </div>
              </div>
  
            </div> 
              <div style={{ float: 'left', width: '100%', height: '50' }} >
              <div style={{ float: 'left' }} className="my-5 text-left flex flex-wrap  pb-8 sm:my-8">
                <Label>{t('Permissions')}</Label>
              </div>
            </div> 
              <div className="mb-6 w-full flex-wrap rounded bg-light  md:flex-nowrap" style={{ marginTop: '40px' }}>
                <p style={{ marginBottom: '10px', paddingTop: "70px" }}>{t('common:permissions')}:</p>

                {/* <div className="w-full ">
                  {userPermission?.map((item, index) => (

                    <div key={index} className="grid w-full grid-cols-4 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                      <div>

                        <label >
                          <b>{t('common:user')}</b>
                        </label>
                      </div>
                      <div>
                        {/* <input
                        style={{ fontStyle: "normal" }}
                        type="checkbox"
                        className="bg-accent-100 mr-5 h-6 w-6 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                        value='User'
                      />
                      <label >
                        Select All
                      </label> 
                      </div>
                      <div></div>
                      {item.User?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: "normal" }}
                            type="checkbox"
                            className="bg-accent-100 mr-5 h-6 w-6 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                            id={innerItem.name}
                            // checked={PermissionDataArray.includes(innerItem.name)}
                            value={innerItem.name}

                            checked={PermissionDataArray.includes(innerItem.name) ? true : false}
                            // checked={checkboxes}
                            onChange={handleSelect}
                          // onChange={(e) => onAddingItem(e, item, index)}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> 

               /* </div> 
              </div>
              <div className="mb-6 w-full flex-wrap rounded bg-light  md:flex-nowrap">


                {/* <div className="w-full ">
                  {userPermission?.map((item, index) => (

                    <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                      <div>

                        <label >
                          <b>{t('common:role')}</b>
                        </label>
                      </div>
                      <div>
                        {/* <input
                        style={{ fontStyle: "normal" }}
                        type="checkbox"
                        className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                        value='Permission'
                      />
                      <label >
                        Select All
                      </label> 
                      </div>
                      <div></div>
                      {item.Role?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px', marginBottom: '10px' }}>
                          <input
                            style={{ fontStyle: "normal" }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}

                            value={innerItem.name}
                            checked={PermissionDataArray.includes(innerItem.name) ? true : false}
                            onChange={handleSelect}

                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> */}

          {/* <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (

                    <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                      <div>

                        <label >
                          <b>{t('common:product')}</b>
                        </label>
                      </div>
                      <div>
                        {/* <input
                        style={{ fontStyle: "normal" }}
                        type="checkbox"
                        className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                        value='Permission'
                      />
                      <label >
                        Select All
                      </label> 
                      </div>
                      <div></div>
                      {item.Product?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: "normal" }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={PermissionDataArray.includes(innerItem.name) ? true : false}
                            // checked={item.isAdded}
                            onChange={handleSelect}

                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> */}
          {/* <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (

                    <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                      <div>

                        <label >
                          <b>{t('common:customer')}</b>
                        </label>
                      </div>
                      <div>
                        {/* <input
                        style={{ fontStyle: "normal" }}
                        type="checkbox"
                        className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                        value='Permission'
                      />
                      <label >
                        Select All
                      </label> 
                      </div>
                      <div></div>
                      {item.Customer?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: "normal" }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={PermissionDataArray.includes(innerItem.name) ? true : false}
                            // checked={item.isAdded}
                            onChange={handleSelect}

                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> */}

          {/* <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (

                    <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-2 xl:grid-cols-2">
                      <div>

                        <label >
                          <b>POS</b>
                        </label>
                      </div>

                      {/* <div></div> 
                      <div></div>
                      {item.Pos?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: "normal" }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={PermissionDataArray.includes(innerItem.name) ? true : false}

                            // checked={item.isAdded}
                            onChange={handleSelect}

                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> */}
          {/* <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (

                    <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-2 xl:grid-cols-2">
                      <div>

                        <label >
                          <b>{t("common:sell")}</b>
                        </label>
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                      </div>
                      {/* <div></div> 
                      {item.Sell?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: "normal" }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={PermissionDataArray.includes(innerItem.name) ? true : false}

                            // checked={item.isAdded}
                            onChange={handleSelect}

                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> */}

          {/* <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (

                    <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                      <div>

                        <label >
                          <b>{t("common:brand")}</b>
                        </label>
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                      </div>
                      <div></div>
                      {/* <div></div> 
                      {item.Brand?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: "normal" }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={PermissionDataArray.includes(innerItem.name) ? true : false}

                            // checked={item.isAdded}
                            onChange={handleSelect}

                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> */}
          {/* <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (

                    <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                      <div>

                        <label >
                          <b>{t('common:tax-rate')}</b>
                        </label>
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                      </div>
                      <div></div>
                   
                      {item.Tax?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: "normal" }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={PermissionDataArray.includes(innerItem.name) ? true : false}

                            // checked={item.isAdded}
                            onChange={handleSelect}

                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> */}
          {/* <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (

                    <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                      <div>

                        <label >
                          <b>{t('common:unit')}</b>
                        </label>
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                      </div>
                      <div></div>
                  
                      {item.Unit?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: "normal" }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={PermissionDataArray.includes(innerItem.name) ? true : false}

                            // checked={item.isAdded}
                            onChange={handleSelect}

                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> */}
          {/* <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (

                    <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                      <div>

                        <label >
                          <b>{t('common:category')}</b>
                        </label>
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                      </div>
                      <div></div>
                
                      {item.Category?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: "normal" }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={PermissionDataArray.includes(innerItem.name) ? true : false}

                            // checked={item.isAdded}
                            onChange={handleSelect}

                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> */}
          {/* <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (

                    <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                      <div>

                        <label >
                          <b>{t('common:report')}</b>
                        </label>
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                      </div>
                      <div></div>
                   
                      {item.Report?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: "normal" }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={PermissionDataArray.includes(innerItem.name) ? true : false}

                            // checked={item.isAdded}
                            onChange={handleSelect}

                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> */}
          {/* <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (

                    <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                      <div>

                        <label >
                          <b>{t('common:settings')}</b>
                        </label>
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                      </div>
                      <div></div>
                   
                      {item.Settings?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: "normal" }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={PermissionDataArray.includes(innerItem.name) ? true : false}

                            // checked={item.isAdded}
                            onChange={handleSelect}

                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> */}
          {/* <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (

                    <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                      <div>

                        <label >
                          <b>{t('common:home')}</b>
                        </label>
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                      </div>
                      <div></div>
                    
                      {item.Home?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: "normal" }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={PermissionDataArray.includes(innerItem.name) ? true : false}

                            // checked={item.isAdded}
                            onChange={handleSelect}

                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> */}
          {/* <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (

                    <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                      <div>

                        <label >
                          <b>{t('common:cachier')}</b>
                        </label>
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                      </div>
                      <div></div>
                     
                      {item.Cash?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: "normal" }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            checked={PermissionDataArray.includes(innerItem.name) ? true : false}

                            // checked={item.isAdded}
                            onChange={handleSelect}

                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> 








              </div> 
              </div>

            </Card>
          </div> */}

          {/* <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:form-title-information')}
            details={t('Roles and Permissions  ')}
            className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
          />
        </div> */}

          <div className="mb-4 text-end">
            <Button loading={creatingLoading}>
              {initialValues.initialValues
                ? t('common:update-role')
                : t('common:add-role')}
            </Button>
          </div>
        </form>
      ) : slug ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('form:form-title-information')}
              details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <Input
                  label={t('common:role-name')}
                  {...register('role_name')}
                  type="text"
                  defaultValue={role}
                  variant="outline"
                  className="mb-4"
                />
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:user')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full ">
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        {/* <label >
                            <b>{t('common:user')}</b>
                          </label> */}
                      </div>
                      <div></div>
                      <div></div>
                      {/* <div></div> */}
                      {item.User?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className="bg-accent-100 mr-5 h-6 w-6 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                            id={innerItem.name}
                            // checked={PermissionDataArray.includes(innerItem.name)}
                            value={innerItem.name}
                            // checked={checkboxes}
                            onChange={handleSelect}
                            // onChange={(e) => onAddingItem(e, item, index)}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:role')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full ">
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        {/* <label >
                            <b>{t('common:role')}</b>
                          </label> */}
                      </div>
                      <div></div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Role?.map((innerItem, innerIndex) => (
                        <div
                          key={innerIndex}
                          style={{ paddingBottom: '6px', marginBottom: '10px' }}
                        >
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:product')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        {/* <label >
                            <b>{t('common:product')}</b>
                          </label> */}
                      </div>
                      <div></div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Product?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:supplier')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        {/* <label >
                            <b>{t('common:customer')}</b>
                          </label> */}
                      </div>
                      <div></div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Supplier?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:customer')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        {/* <label >
                            <b>{t('common:customer')}</b>
                          </label> */}
                      </div>
                      <div></div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Customer?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:agent')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        {/* <label >
                            <b>{t('common:customer')}</b>
                          </label> */}
                      </div>
                      <div></div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Agent?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('Purchase')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-2 xl:grid-cols-2"
                    >
                      <div>
                        {/* 
                          <label >
                            <b>POS</b>
                          </label> */}
                      </div>

                      <div></div>
                      {item.Purchase?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('POS')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-2 xl:grid-cols-2"
                    >
                      <div>
                        {/* 
                          <label >
                            <b>POS</b>
                          </label> */}
                      </div>

                      <div></div>
                      {item.Pos?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:sell')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        {/* <label >
                            <b>{t('common:sell')}</b>
                          </label> */}
                      </div>
                      <div></div>
                      <div></div>

                      {item.Sell?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:shipment')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        {/* <label >
                            <b>{t('common:sell')}</b>
                          </label> */}
                      </div>
                      <div></div>
                      <div></div>

                      {item.Shipments?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:brand')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        {/* <label >
                            <b>{t('common:brand')}</b>
                          </label> */}
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> */}
                      </div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Brand?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:tax-rate')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        {/* <label >
                            <b>{t('common:tax-rate')}</b>
                          </label> */}
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> */}
                      </div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Tax?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:unit')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div></div>
                      <div></div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Unit?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:category')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div></div>
                      <div></div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Category?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:report')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div></div>
                      <div></div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Report?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:settings')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div></div>
                      <div></div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Settings?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:home')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div>
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div></div>
                      <div></div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Home?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:cachier')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              {/* <Input
            label={t('common:role-name')}
            {...register('role_name')}
            type="text"
            defaultValue={role}
            variant="outline"
            className="mb-4"

          /> */}

              {/* <div style={{ float: 'left', width: '100%', height: '60px', marginBottom: '20px' }} >
            <div style={{ float: 'left' }} className="my-5 text-left flex flex-wrap  pb-8 sm:my-8">
              <Label>{t('common:user-type')}</Label>
            </div>
            <div style={{ float: 'right' }} className="my-5 text-end flex flex-wrap  pb-8 sm:my-8">
              <div className='text-end'>
                <Label>{t('common:service-staff')}</Label>

                <Switch
                  name='is_service_staff'
                  checked={status}
                  onChange={onChangeStatus}
                  value={status ? "active" : 'inactive'}
                  className={`${status ? 'bg-accent' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                  dir="ltr"
                >
                  <span className="sr-only">Enable </span>
                  <span
                    className={`${status ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                  />
                </Switch>
              </div>
            </div>

          </div> */}
              {/* <div style={{ float: 'left', width: '100%', height: '50' }} >
            <div style={{ float: 'left' }} className="my-5 text-left flex flex-wrap  pb-8 sm:my-8">
              <Label>{t('Permissions')}</Label>
            </div>
          </div> */}
              {/* <div className="mb-6 w-full flex-wrap rounded bg-light  md:flex-nowrap" style={{ marginTop: '40px' }}>
                  <p style={{ marginBottom: '10px' }}>{t('common:permissions')}:</p>

                  <div className="w-full ">
                    {userPermission?.map((item, index) => (

                      <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                        <div>

                          <label >
                            <b>{t('common:user')}</b>
                          </label>
                        </div>
                        <div>
                          {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='User'
                    />
                    <label >
                      Select All
                    </label> 
                        </div>
                        <div></div>
                        {/* <div></div> 
                        {item.User?.map((innerItem, innerIndex) => (
                          <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                            <input
                              style={{ fontStyle: "normal" }}
                              type="checkbox"
                              className="bg-accent-100 mr-5 h-6 w-6 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                              id={innerItem.name}
                              // checked={PermissionDataArray.includes(innerItem.name)}
                              value={innerItem.name}
                              // checked={checkboxes}
                              onChange={handleSelect}
                            // onChange={(e) => onAddingItem(e, item, index)}
                            />
                            <label htmlFor={innerItem.name}>
                              {t(`common:${innerItem.value}`)}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* </div> 
                </div> */}
              <div className="mb-6 w-full flex-wrap rounded bg-light  md:flex-nowrap">
                {/* <div className="w-full ">
                    {userPermission?.map((item, index) => (

                      <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                        <div>

                          <label >
                            <b>{t('common:role')}</b>
                          </label>
                        </div>
                        <div>
                          {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                        </div>
                        <div></div>
                        {/* <div></div> 
                        {item.Role?.map((innerItem, innerIndex) => (
                          <div key={innerIndex} style={{ paddingBottom: '6px', marginBottom: '10px' }}>
                            <input
                              style={{ fontStyle: "normal" }}
                              type="checkbox"
                              className=" mr-5 rounded h-6 w-6 accent-dark"
                              id={innerItem.name}

                              value={innerItem.name}
                              onChange={handleSelect}

                            />
                            <label htmlFor={innerItem.name}>
                              {t(`common:${innerItem.value}`)}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div> */}

                {/* <div className="w-full " style={{ marginTop: '10px' }}>
                    {userPermission?.map((item, index) => (

                      <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                        <div>

                          <label >
                            <b>{t('common:product')}</b>
                          </label>
                        </div>
                        <div>
                          {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                        </div>
                        <div></div>
                        {/* <div></div> 
                        {item.Product?.map((innerItem, innerIndex) => (
                          <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                            <input
                              style={{ fontStyle: "normal" }}
                              type="checkbox"
                              className=" mr-5 rounded h-6 w-6 accent-dark"
                              id={innerItem.name}
                              value={innerItem.name}
                              // checked={item.isAdded}
                              onChange={handleSelect}

                            />
                            <label htmlFor={innerItem.name}>
                              {t(`common:${innerItem.value}`)}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div> */}
                {/* <div className="w-full " style={{ marginTop: '10px' }}>
                    {userPermission?.map((item, index) => (

                      <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                        <div>

                          <label >
                            <b>{t('common:customer')}</b>
                          </label>
                        </div>
                        <div>
                          {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                        </div>
                        <div></div>
                        {/* <div></div>
                        {item.Customer?.map((innerItem, innerIndex) => (
                          <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                            <input
                              style={{ fontStyle: "normal" }}
                              type="checkbox"
                              className=" mr-5 rounded h-6 w-6 accent-dark"
                              id={innerItem.name}
                              value={innerItem.name}
                              // checked={item.isAdded}
                              onChange={handleSelect}

                            />
                            <label htmlFor={innerItem.name}>
                              {t(`common:${innerItem.value}`)}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div> */}

                {/* <div className="w-full " style={{ marginTop: '10px' }}>
                    {userPermission?.map((item, index) => (

                      <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-2 xl:grid-cols-2">
                        <div>

                          <label >
                            <b>POS</b>
                          </label>
                        </div>

                        <div></div>
                        {item.Pos?.map((innerItem, innerIndex) => (
                          <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                            <input
                              style={{ fontStyle: "normal" }}
                              type="checkbox"
                              className=" mr-5 rounded h-6 w-6 accent-dark"
                              id={innerItem.name}
                              value={innerItem.name}
                              // checked={item.isAdded}
                              onChange={handleSelect}

                            />
                            <label htmlFor={innerItem.name}>
                              {t(`common:${innerItem.value}`)}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div> */}
                {/* <div className="w-full " style={{ marginTop: '10px' }}>
                    {userPermission?.map((item, index) => (

                      <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                        <div>

                          <label >
                            <b>{t('common:sell')}</b>
                          </label>
                        </div>
                        <div>
                          {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                        </div>
                        <div></div>
                        {/* <div></div> 
                        {item.Sell?.map((innerItem, innerIndex) => (
                          <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                            <input
                              style={{ fontStyle: "normal" }}
                              type="checkbox"
                              className=" mr-5 rounded h-6 w-6 accent-dark"
                              id={innerItem.name}
                              value={innerItem.name}
                              // checked={item.isAdded}
                              onChange={handleSelect}

                            />
                            <label htmlFor={innerItem.name}>
                              {t(`common:${innerItem.value}`)}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div> */}

                {/* <div className="w-full " style={{ marginTop: '10px' }}>
                    {userPermission?.map((item, index) => (

                      <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                        <div>

                          <label >
                            <b>{t('common:tax-rate')}</b>
                          </label>
                        </div>
                        <div>
                          {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                        </div>
                        <div></div>
                        {/* <div></div> 
                        {item.Tax?.map((innerItem, innerIndex) => (
                          <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                            <input
                              style={{ fontStyle: "normal" }}
                              type="checkbox"
                              className=" mr-5 rounded h-6 w-6 accent-dark"
                              id={innerItem.name}
                              value={innerItem.name}
                              // checked={item.isAdded}
                              onChange={handleSelect}

                            />
                            <label htmlFor={innerItem.name}>
                              {t(`common:${innerItem.value}`)}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div> */}
                {/* <div className="w-full " style={{ marginTop: '10px' }}>
                    {userPermission?.map((item, index) => (

                      <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                        <div>

                          <label >
                            <b>{t('common:unit')}</b>
                          </label>
                        </div>
                        <div>
                          {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label>
                        </div>
                        <div></div>
                        {/* <div></div>
                        {item.Unit?.map((innerItem, innerIndex) => (
                          <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                            <input
                              style={{ fontStyle: "normal" }}
                              type="checkbox"
                              className=" mr-5 rounded h-6 w-6 accent-dark"
                              id={innerItem.name}
                              value={innerItem.name}
                              // checked={item.isAdded}
                              onChange={handleSelect}

                            />
                            <label htmlFor={innerItem.name}>
                              {t(`common:${innerItem.value}`)}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div> */}
                {/* <div className="w-full " style={{ marginTop: '10px' }}>
                    {userPermission?.map((item, index) => (

                      <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                        <div>

                          <label >
                            <b>{t('common:category')}</b>
                          </label>
                        </div>
                        <div>
                          {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                        </div>
                        <div></div>
                        {/* <div></div>
                        {item.Category?.map((innerItem, innerIndex) => (
                          <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                            <input
                              style={{ fontStyle: "normal" }}
                              type="checkbox"
                              className=" mr-5 rounded h-6 w-6 accent-dark"
                              id={innerItem.name}
                              value={innerItem.name}
                              // checked={item.isAdded}
                              onChange={handleSelect}

                            />
                            <label htmlFor={innerItem.name}>
                              {t(`common:${innerItem.value}`)}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div> */}
                {/* <div className="w-full " style={{ marginTop: '10px' }}>
                    {userPermission?.map((item, index) => (

                      <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                        <div>

                          <label >
                            <b>{t('common:category')}</b>
                          </label>
                        </div>
                        <div>
                          {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                        </div>
                        <div></div>
                        {/* <div></div>
                        {item.Report?.map((innerItem, innerIndex) => (
                          <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                            <input
                              style={{ fontStyle: "normal" }}
                              type="checkbox"
                              className=" mr-5 rounded h-6 w-6 accent-dark"
                              id={innerItem.name}
                              value={innerItem.name}
                              // checked={item.isAdded}
                              onChange={handleSelect}

                            />
                            <label htmlFor={innerItem.name}>
                              {t(`common:${innerItem.value}`)}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div> */}
                {/* <div className="w-full " style={{ marginTop: '10px' }}>
                    {userPermission?.map((item, index) => (

                      <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                        <div>

                          <label >
                            <b>{t('common:settings')}</b>
                          </label>
                        </div>
                        <div>
                          {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                        </div>
                        <div></div>
                        {/* <div></div> 
                        {item.Settings?.map((innerItem, innerIndex) => (
                          <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                            <input
                              style={{ fontStyle: "normal" }}
                              type="checkbox"
                              className=" mr-5 rounded h-6 w-6 accent-dark"
                              id={innerItem.name}
                              value={innerItem.name}
                              // checked={item.isAdded}
                              onChange={handleSelect}

                            />
                            <label htmlFor={innerItem.name}>
                              {t(`common:${innerItem.value}`)}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div> */}
                {/* <div className="w-full " style={{ marginTop: '10px' }}>
                    {userPermission?.map((item, index) => (

                      <div key={index} className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                        <div>

                          <label >
                            <b>{t('common:home')}</b>
                          </label>
                        </div>
                        <div>
                          {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> 
                        </div>
                        <div></div>
                        {/* <div></div> 
                        {item.Home?.map((innerItem, innerIndex) => (
                          <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                            <input
                              style={{ fontStyle: "normal" }}
                              type="checkbox"
                              className=" mr-5 rounded h-6 w-6 accent-dark"
                              id={innerItem.name}
                              value={innerItem.name}
                              // checked={item.isAdded}
                              onChange={handleSelect}

                            />
                            <label htmlFor={innerItem.name}>
                              {t(`common:${innerItem.value}`)}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div> */}
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        {/* <label >
                            <b>{t('common:cachier')}</b>
                          </label> */}
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> */}
                      </div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Cash?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {/* </div> */}
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:coupon')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="mb-6 w-full flex-wrap rounded bg-light  md:flex-nowrap">
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        {/* <label >
                            <b>{t('common:cachier')}</b>
                          </label> */}
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> */}
                      </div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Coupon?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {/* </div> */}
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:cart')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="mb-6 w-full flex-wrap rounded bg-light  md:flex-nowrap">
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        {/* <label >
                            <b>{t('common:cachier')}</b>
                          </label> */}
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> */}
                      </div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Cart?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {/* </div> */}
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('common:marketplace')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="mb-6 w-full flex-wrap rounded bg-light  md:flex-nowrap">
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                        {/* <label >
                            <b>{t('common:cachier')}</b>
                          </label> */}
                      </div>
                      <div>
                        {/* <input
                      style={{ fontStyle: "normal" }}
                      type="checkbox"
                      className="bg-accent-100 mr-5 h-6 w-6 permission rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                      value='Permission'
                    />
                    <label >
                      Select All
                    </label> */}
                      </div>
                      <div></div>
                      {/* <div></div> */}
                      {item.Marketplace?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {/* </div> */}
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('Table')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="mb-6 w-full flex-wrap rounded bg-light  md:flex-nowrap">
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Table?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {/* </div> */}
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('Size Chart')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="mb-6 w-full flex-wrap rounded bg-light  md:flex-nowrap">
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.SizeChart?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {/* </div> */}
              </div>
            </Card>
          </div>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('Notification')}
              // details={t('common:add-role-permission')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="mb-6 w-full flex-wrap rounded bg-light  md:flex-nowrap">
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      {item.Notification?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 h-6 w-6 rounded accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {/* </div> */}
              </div>
            </Card>
          </div>
          {/* <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('Approve Invoice')}
              // details={t('common:add-role-permission')}
              className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="mb-6 w-full flex-wrap rounded bg-light  md:flex-nowrap">
                <div className="w-full " style={{ marginTop: '10px' }}>
                  {userPermission?.map((item, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-6 gap-3 sm:grid-cols-3 xl:grid-cols-3"
                    >
                      <div>
                      </div>
                      <div>
                      </div>
                      <div></div>
                      {item.ApproveInvoice?.map((innerItem, innerIndex) => (
                        <div key={innerIndex} style={{ paddingBottom: '6px' }}>
                          <input
                            style={{ fontStyle: 'normal' }}
                            type="checkbox"
                            className=" mr-5 rounded h-6 w-6 accent-dark"
                            id={innerItem.name}
                            value={innerItem.name}
                            // checked={item.isAdded}
                            onChange={handleSelect}
                          />
                          <label htmlFor={innerItem.name}>
                            {t(`common:${innerItem.value}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div> */}
          {/* <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('Roles and Permissions  ')}
          className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
        />
      </div> */}
          <div className="mb-4 text-end">
            <Button loading={creatingLoading}>
              {initialValues.initialValues
                ? t('common:update-role')
                : t('common:add-role')}
            </Button>
          </div>
        </form>
      ) : (
        ''
      )}
    </>
  );
}
