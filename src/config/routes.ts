export const Routes = {
  dashboard: '/',
  login: '/login',
  businessDetail: '/register',
  selectUser: '/selectUser',
  logout: '/logout',
  registerBusiness: '/registerBusiness',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  adminMyShops: '/my-shops',
  profile: '/profile',
  verifyCoupons: '/coupons/verify',
  settings: '/settings',
  channelSales: '/channelSales',
  marketPlace: '/marketPlace',
  socialCommerce: '/socialCommerce',
  mobileApp: '/mobileApp',
  payLink: '/payLink',
  businessettings: 'businessSettings',
  otp: 'otp',
  withDraw: 'withdraw',
  registerOtp: 'registerOtp',
  //devices:"devices",
  salesSummary: 'salesSummary',
  productSales: 'productSales',
  categorySales: 'categorySales',
  employeeSales: 'employeeSales',
  reportSales: 'reportSales',
  profitLossReport: 'profitLossReport',
  reportSalesByPayment: 'reportSalesByPayment',
  stockSaleReport: 'stockSaleReport',
  taxSales: 'taxSales',
  shiftReport: 'shiftReport',
  stockReport: 'stockReport',
  tipreport: 'tipReport',
  storesettings: 'storesSettings',
  // storeSettings: '/vendor/settings',
  storeKeepers: '/vendor/store_keepers',
  profileUpdate: '/profile-update',
  checkout: '/orders/checkout',
  igniteShip: '/igniteShip',
  payment: '/payment',
  igniteShipCreate: '/settings/igniteShip/create',
  unauthorize: '/unauthorize',
  updateSubscription: '/updateSubscription',
  reviewSubscription: '/reviewSubscription',

  //  igniteShip: {
  //   ...routesFactory('/igniteShip'),
  // },

 
  user: {
    ...routesFactory('users'),
  },
  onBoarding: {
    ...routesFactory('onboarding'),
  },
  role: {
    ...routesFactory('roles'),
  },
  salesAgent: {
    ...routesFactory('salesAgent'),
  },
  shiftReports: {
    ...routesFactory('shiftReport'),
  },
  type: {
    ...routesFactory('/groups'),
  },
  brands: {
    ...routesFactory('brands'),
  },
  customer: {
    ...routesFactory('customers'),
  },
  superAdmin: {
    ...routesFactory('/superAdmin'),
  },
  supplier: {
    ...routesFactory('supplier'),
  },
  igniteShipEdit: {
    ...routesFactory('/igniteShipEdit'),
  },
  sms: {
    ...routesFactory('sms'),
  },
  table: {
    ...routesFactory('table'),
  },

  catalogs: '/catalog',

  salesChannel: '/salesChannel',
  category: {
    ...routesFactory('categories'),
  },
  blogCategory: {
    ...routesFactory('/blog/blogCategories'),
  },
  blog: {
    ...routesFactory('blog'),
  },

  attribute: {
    ...routesFactory('/attributes'),
  },
  attributeValue: {
    ...routesFactory('/attribute-values'),
  },
  tag: {
    ...routesFactory('/tags'),
  },
  collection: {
    ...routesFactory('/collections'),
  },
  units: {
    ...routesFactory('units'),
  },
  invoice: {
    ...routesFactory('invoice'),
  },
  purchase: {
    ...routesFactory('purchase'),
  },
  booking: {
    ...routesFactory('booking'),
  },
  invoices: {
    ...routesFactory('invoices'),
  },
  editInvoice: {
    ...routesFactory('editInvoice'),
  },
  draft: {
    ...routesFactory('drafts'),
  },
  reviews: {
    ...routesFactory('/reviews'),
  },
  abuseReviews: {
    ...routesFactory('/abusive_reports'),
  },
  abuseReviewsReport: {
    ...routesFactory('/abusive_reports/reject'),
  },
  author: {
    ...routesFactory('authors'),
  },
  variant: {
    ...routesFactory('variant'),
  },
  coupon: {
    ...routesFactory('/coupons'),
  },
  manufacturer: {
    ...routesFactory('/manufacturers'),
  },
  importProduct: {
    ...routesFactory('importProducts'),
  },
  importInvoice: {
    ...routesFactory('importInvoice'),
  },
  order: {
    ...routesFactory('/orders'),
  },
  creditNotes: {
    ...routesFactory('creditNotes'),
  },
  orderStatus: {
    ...routesFactory('/order-status'),
  },
  orderCreate: {
    ...routesFactory('/orders/create'),
  },

  product: {
    ...routesFactory('products'),
  },
  shop: {
    ...routesFactory('/shops'),
  },
  tax: {
    ...routesFactory('tax'),
  },
  subscription: {
    ...routesFactory('subscription'),
  },
  location: {
    ...routesFactory('location'),
  },
  devices: {
    ...routesFactory('devices'),
  },
  sizeChart: {
    ...routesFactory('sizeChart'),
  },
  invoiceLayout: {
    ...routesFactory('invoiceLayout'),
  },
  coupons: {
    ...routesFactory('coupons'),
  },
  abandonedCart: {
    ...routesFactory('abandonedCart'),
  },
  shipping: {
    ...routesFactory('/shippings'),
  },
  withdraw: {
    ...routesFactory('/withdraws'),
  },
  staff: {
    ...routesFactory('/staffs'),
  },
  refund: {
    ...routesFactory('/refunds'),
  },
  question: {
    ...routesFactory('questions'),
  },
  stockTransfer: {
    ...routesFactory('stockTransfer'),
  },
  stockAdjustment: {
    ...routesFactory('stockAdjustment'),
  },
  manageStock: {
    ...routesFactory('manageStock'),
  },
};

function routesFactory(endpoint: string) {
  return {
    list: `${endpoint}`,
    create: `${endpoint}/create`,
    editWithoutLang: (slug: string, shop?: string) => {
      return `${endpoint}/${slug}/edit`;
    },
    edit: (slug: string, language: string, shop?: string) => {
      return shop
        ? `/${language}/${shop}${endpoint}/${slug}/edit`
        : `${language}${endpoint}/${slug}/edit`;
    },
    translate: (slug: string, language: string, shop?: string) => {
      return shop
        ? `/${language}/${shop}${endpoint}/${slug}/translate`
        : `${language}${endpoint}/${slug}/translate`;
    },
    details: (slug: string) => `${endpoint}/${slug}`,
  };
}
