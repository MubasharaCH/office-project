import { adminAndOwnerOnly, adminOwnerAndStaffOnly } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';

export const siteSettings = {
  name: 'PickBazar',
  description: '',
  logo: {
    // url: '/logo.svg',
    url: '/ignite-logo.png',
    alt: 'Ignite',
    href: '/',
    width: 128,
    height: 48,
  },
  defaultLanguage: 'en',

  author: {
    name: 'RedQ, Inc.',
    websiteUrl: 'https://redq.io',
    address: '',
  },
  headerLinks: [],
  authorizedLinks: [
    {
      href: Routes.profileUpdate,
      labelTransKey: 'authorized-nav-item-profile',
    },
    {
      href: Routes.logout,
      labelTransKey: 'authorized-nav-item-logout',
    },
  ],
  currencyCode: 'USD',
  sidebarLinks: {
    admin: [
      {
        href: Routes.superAdmin.list,
        label: 'superAdmin',
        icon: 'DashboardIcons',
      },
 
      {
        href: Routes.dashboard,
        label: 'dashboard',
        icon: 'DashboardIcons',
      },

      {
        href: '/userManagements',
        label: 'contacts',
        icon: 'CustomerIcons',
        children: [
          {
            href: Routes.user.list,
            label: 'users',
            icon: 'CustomerIcons',
          },
          {
            href: Routes.role.list,
            label: 'roles',
            icon: 'TagIcon',
          },
          {
            href: Routes.salesAgent.list,
            label: 'Sales-agent',
            icon: 'TagIcon',
          },
          {
            href: Routes.supplier.list,
            label: 'supplier',
            icon: 'CatalogIcons',
          },
          {
            href: Routes.customer.list,
            label: 'customers',
            icon: 'CustomerIcons',
          },
        ],
      },

      {
        href: '/catalog',
        label: 'catalog',
        icon: 'CatalogIcons',
        children: [
          {
            href: Routes.product.list,
            label: 'products',
            icon: 'TypesIcon',
          },
          {
            href: Routes.importProduct.list,
            label: 'import-products',
            icon: 'TypesIcon',
          },
          {
            href: Routes.category.list,
            label: 'categories',
            icon: 'TagIcon',
          },
          {
            href: Routes.brands.list,
            label: 'brands',
            icon: 'BrandIcons',
          },
          {
            href: Routes.units.list,
            label: 'units',
            icon: 'UnitIcons',
          },
          {
            href: Routes.variant.list,
            label: 'variation',
            icon: 'FountainPenIcon',
          },
          {
            href: Routes.tag.list,
            label: 'tags',
            icon: 'TagIcon',
          },
          {
            href: Routes.collection.list,
            label: 'collections',
            icon: 'TypesIcon',
          },
          
        ],
      },
      {
        href: '/sales',
        label: 'sales',
        icon: 'SalesIcons',
        children: [
          {
            href: Routes.invoice.list,
            label: 'invoices',
            icon: 'InvoiceIcon',
          },
          {
            href: Routes.creditNotes.list,
            label: 'credit-notes',
            icon: 'CalendarScheduleIcon',
          },
          {
            href: Routes.importInvoice.list,
            label: 'import-invoice',
            icon: 'InvoiceIcon',
          },
          
          
        ],
      },
      {
        href: '/bookings',
        label: 'bookings',
        icon: 'CalendarIcon',
        children: [
          {
            href: Routes.booking.list,
            label: 'booking-list',
            icon: 'InvoiceIcon',
          },
          
        ],
      },
    
      {
        href: '/purchases',
        label: 'purchases',
        icon: 'purchase',
        children: [
          {
            href: Routes.purchase.list,
            label: 'purchase',
            icon: 'InvoiceIcon',
          },
        ],
      },
      {
        href: '/inventory',
        label: 'inventory',
        icon: 'InventoryIcons',
        children: [
          {
            href: Routes.stockTransfer.list,
            label: 'stock-transfer',
            icon: 'transferIcons',
          },
          {
            href: Routes.stockAdjustment.list,
            label: 'stock-adjustment',
            icon: 'AdjustIcons',
          },
          // {
          //   href: Routes.manageStock.create,
          //   label: 'manage-stock',
          //   icon: 'AdjustIcons',
          // },
        ],
      },
      {
        href: '/marketing',
        label: 'marketing-label',
        icon: 'DashboardIcons',
        children: [
          {
            href: Routes.coupons.list,
            label: 'coupons',
            icon: 'InvoiceIcon',
          },
          {
            href: Routes.abandonedCart.list,
            label: 'abandoned-cart',
            icon: 'SalesIcons',
          },
        ],
      },
      {
        href: '/reports',
        label: 'reports',
        icon: 'ReviewIcon',
        children: [
          {
            href: Routes.profitLossReport,
            label: 'profit-loss-report',
            icon: 'SalesReportIcon',
          },
          {
            href: Routes.reportSales,
            label: 'sales-report',
            icon: 'SalesReportIcon',
          },
          {
            href: Routes.reportSalesByPayment,
            label: 'sales-report-by-payment',
            icon: 'SalesReportIcon',
          },
          {
            href: Routes.salesSummary,
            label: 'sales-summary',
            icon: 'UnitIcons',
          },
          {
            href: Routes.productSales,
            label: 'product-sales',
            icon: 'SalesIcons',
          },
          {
            href: Routes.categorySales,
            label: 'category-sales',
            icon: 'CategoriesIcon',
          },
          {
            href: Routes.employeeSales,
            label: 'employee-sales',
            icon: 'UsersIcon',
          },
          {
            href: Routes.taxSales,
            label: 'tax-summary',
            icon: 'TaxesIcon',
          },
          {
            href: Routes.stockSaleReport,
            label: 'stock-sale-report',
            icon: 'TaxesIcon',
          },
          {
            href: Routes.shiftReport,
            label: 'shift-report',
            icon: 'TaxesIcon',
          },
          {
            href: Routes.stockReport,
            label: 'stock-report',
            icon: 'TaxesIcon',
          },
          {
            href: Routes.tipreport,
            label: 'tip-report',
            icon: 'SalesReportIcon',
          },
        ],
      },
      {
        href: '/salesChannel',
        label: 'sales-channel',
        icon: 'TypesIcon',
        children: [
          // {
          //   href: Routes.channelSales,
          //   label: 'sales-channel',
          //   icon: 'TypesIcon',
          // },
          {
            href: '../settings/' + Routes.storesettings,
            label: 'text-storefront',
            icon: 'WebsiteIcon',
          },
          {
            href: Routes.mobileApp,
            label: 'mobile-app',
            icon: 'MobileIcon',
          },
          {
            href: '../sales/' + Routes.invoice.create,
            label: 'text-pay-link',
            icon: 'PayLinkIcon',
          },
          {
            href: Routes.marketPlace,
            label: 'marketPlace',
            icon: 'Market',
          },
          {
            href: Routes.socialCommerce,
            label: 'socialCommerce',
            icon: 'Market',
          },
        ],
      },
      // {
      //   href: '/purchases',
      //   label: 'booking-channel',
      //   icon: 'SalesIcons',
      //   children: [
      //     {
      //       href: Routes.purchase.list,
      //       label: 'booking-channel',
      //       icon: 'InvoiceIcon',
      //     },
      //   ],
      // },
      // {
      //   href: '/settings/' + Routes.storesettings,
      //   label: 'text-website',
      //   icon: 'WebsiteIcon',
      // },
      // {
      //   href: "/mobileApp",
      //   label: 'mobile-app',
      //   icon: 'MobileIcon',
      // },
      // {
      //   href: '/sales/' + Routes.invoice.create,
      //   label: 'text-pay-link',
      //   icon: 'PayLinkIcon',
      // },
      // {
      //   href: Routes.marketPlace,
      //   label: 'marketPlace',
      //   icon: 'Flame',
      // },
      // {
      //   href: Routes.igniteShip,
      //   label: 'ignite-shipping',
      //   icon: '',
      // },

      {
        href: '/settings',
        label: 'settings',
        icon: 'SettingsIcon',
        children: [
          {
            href: Routes.businessettings,
            label: 'business',
            icon: 'BusinesSettingIcon',
          },
          {
            href: Routes.sms.list,
            label: 'notification',
            icon: 'Notification',
          },
          {
            href: Routes.table.list,
            label: 'table',
            icon: 'TableIcon',
          },
          {
            href: '/product',
            label: 'POS_Setting',
            icon: 'CalendarScheduleIcon',
          },
          {
            href: Routes.subscription.list,
            label: 'text-billing',
            icon: 'BillingIcon',
          },

          {
            href: Routes.tax.list,
            label: 'tax',
            icon: 'CalendarScheduleIcon',
          },

          {
            href: Routes.devices.list,
            label: 'devices',
            icon: 'DeviceIcons',
          },
          // {
          //   href: Routes.storesettings,
          //   label: 'online-store',
          //   icon: 'SettingsIcon',
          // },
          {
            href: '/ignitePlugin',
            label: 'store-plugin',
            icon: 'ElecticIcon',
          },
          {
            href: '/integrations',
            label: 'Integrations',
            icon: 'DashboardIcons',
          },
          {
            href: Routes.location.list,
            label: 'location',
            icon: 'LocationIcons',
          },
          {
            href: Routes.invoiceLayout.list,
            label: 'Invoice-Layout',
            icon: 'InvoiceIcon',
          },
          {
            href: Routes.igniteShip,
            label: 'ignite-shipping',
            icon: 'Flame',
          },
          {
            href: Routes.payment,
            label: 'payment',
            icon: 'Payment',
          },
          {
            href: Routes.sizeChart.list,
            label: 'sizeChart',
            icon: 'sizeChart',
          },
          {
            href: Routes.onBoarding.list,
            label: 'onBoarding',
            icon: 'sizeChart',
          },
        ],
      },
    ],
    shop: [
      {
        href: (shop: string) => `${Routes.dashboard}${shop}`,
        label: 'sidebar-nav-item-dashboard',
        icon: 'DashboardIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.attribute.list}`,
        label: 'sidebar-nav-item-attributes',
        icon: 'AttributeIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.product.list}`,
        label: 'sidebar-nav-item-products',
        icon: 'ProductsIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.author.list}`,
        label: 'sidebar-nav-item-authors',
        icon: 'FountainPenIcon',
        permissions: adminAndOwnerOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.manufacturer.list}`,
        label: 'sidebar-nav-item-manufacturers',
        icon: 'DiaryIcon',
        permissions: adminAndOwnerOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.order.list}`,
        label: 'sidebar-nav-item-orders',
        icon: 'OrdersIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.refund.list}`,
        label: 'sidebar-nav-item-refunds',
        icon: 'RefundsIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.staff.list}`,
        label: 'sidebar-nav-item-staffs',
        icon: 'UsersIcon',
        permissions: adminAndOwnerOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.withdraw.list}`,
        label: 'sidebar-nav-item-withdraws',
        icon: 'AttributeIcon',
        permissions: adminAndOwnerOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.reviews.list}`,
        label: 'sidebar-nav-item-reviews',
        icon: 'ReviewIcon',
        permissions: adminAndOwnerOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.question.list}`,
        label: 'sidebar-nav-item-questions',
        icon: 'QuestionIcon',
        permissions: adminAndOwnerOnly,
      },
    ],
  },
  product: {
    placeholder: '/product-placeholder.svg',
  },
  avatar: {
    placeholder: '/avatar-placeholder.svg',
  },
};
