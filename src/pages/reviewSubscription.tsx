import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { Tab } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useUI } from '@/contexts/ui.context';
import { Routes } from '@/config/routes';
import { adminOnly } from '@/utils/auth-utils';
import RoleList from '@/components/subscription/subscription-list';
import PackageList from '@/components/subscription/packages-list';
import {
  GetBusinessDetail,
  GetFunction,
  UpdatingBusiness,
  UpdatingProduct,
  UpdatingSellFunction,
} from '@/services/Service';
import React from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import CartCounterButton from '@/components/cart/cart-counter-button';
import Script from 'next/script';
import CartItem from '@/components/cart/item';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import Cart from '@/components/cart/cart';
import ProductCard from '@/components/product/card';
import Drawer from '@/components/ui/drawer';
import SubscriptionCart from '@/components/cart/subscription-cart';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { TiTick } from 'react-icons/ti';
import Button from '@/components/ui/button';
import { ExpandLessIcon } from '@/components/icons/expand-less-icon';
import { ExpandMoreIcon } from '@/components/icons/expand-more-icon';
import Modal from '@/components/ui/modal/modal';
import usePrice from '@/utils/use-price';
import Navbar from '@/components/layouts/navigation/top-navbar';

export default function TypesPage() {
  const { t } = useTranslation();
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState<any>([]);
  const [displayCartSidebarinFile, setdisplayCartSidebar] = useState(false);
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const [subscribeModal, setSubscribeModal] = useState(false);
  const [section, setSection] = useState();
  const [selectedData, setSelectedData] = useState<any>('');
  const { totalUniqueItems, total, resetCart, resetPaymentCart } = useCart();
  const [isSubscription, setIsSubscription] = useState(false);
  const [packagesList, setPackagesList] = useState<any>([]);
  const [addonList, setAddonList] = useState<any>([]);
  const { closeCartSidebar,openCartSidebar,displayCartSidebar } = useUI();
  const { price: totalPrice } = usePrice({
    amount: total,
  });
  useEffect(() => {

    if(displayCartSidebar==false){
      console.log(displayCartSidebar)
      setdisplayCartSidebar(false);
    }
  }, [displayCartSidebar]);
  useEffect(() => {
  
    setloadingData(true);
    GetFunction('/pabbly/subscriptions-and-related-addons').then((result) => {
      if (result?.success) {
        setIsSubscription(true);
        setPackagesList(result?.data?.customer_subscriptions);
        setAddonList(result?.data?.related_addons);
        setloadingData(false);
      } else {
        setIsSubscription(false);
      }
      setloadingData(false);
    });
    GetFunction('/pabbly/list-all-plans').then((result) => {
      setloadingData(false);
      if (result.success) {
        setListData(result.plans);
      }
    });
  }, []);
  let currencyCode: any = localStorage.getItem('business_details');
  currencyCode = JSON.parse(currencyCode)?.code;

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  let [categories]: any = useState({
    Monthly: [
      {
        status: 'Monthly',
      },
    ],
    'Yearly (save 17%)': [
      {
        status: 'Yearly (save 17%)',
      },
    ],
  });

  const itemss = [
    {
      title: 'What type of businesses can use Ignite?',
      content:
        'Ignite is best suited for business owners who do most or all of their business online. In addition if your business model relies on frequent repeat purchases from customers, Ignite add-on features can help customers make those purchases more easily and faster, thus boosting customer loyalty and reducing the number of abandoned cart',
    },
    {
      title:
        'Can I use a third party payment provider with Ignite? Are there any transaction fees?',
      content:
        'You can accept international payments via your preferred payment gateway. Ignite is integrated with multiple global gateways like Stripe, PayPal, Xendit, dLocal, etc to accept digital payments from your customers Ignite has ZERO commissions, which means we wont charge anything on top of what is being charged by Stripe/PayPal (as transaction fees).',
    },
    {
      title: 'Do I need to enter my payment details to sign up?',
      content:
        'No, sign up on Ignite is completely FREE. We do not ask for any payment information upfront.You get a 7-day free trial period to explore Ignite post which you need to purchase a plan to continue using Ignite.',
    },
    {
      title: 'What delivery partner integrations do you offer?',
      content:
        'For shipping orders, Ignite offers integration with Shippo as a plugin on Ignite plugin marketplace. You can obtain the best rates from top carriers and start shipping your orders instantly',
    },
    {
      title: 'What is Ignite plugin marketplace?',
      content:
        'Dukaa plugin marketplace offers you the ability to add additional functionality on top of your existing Ignite store via plugins for FREE. These include plugins for marketing purposes, enhancing customer support, analytics, delivery, SEO and other store optimization plugins to boost your online business. Find more about Ignite plugins here.',
    },
    {
      title: 'Can I use a custom domain name for my site?',
      content:
        'All Ignite stores get a free myIgnite.io domain name on signup. You can choose to purchase a new custom domain name from Ignite at an additional cost. This custom domain will be linked to your Ignite store (HTTPS enabled) and will be live within 10 minutes across the globe',
    },
    {
      title: 'Can I link my existing domain name to Ignite?',
      content:
        'Yes, you can choose to link an existing domain that you have with your Ignite store for free. To know more about linking an existing domain, click here.',
    },

    {
      title: 'Can I move my existing Shopify store to Ignite?',
      content:
        'Yes, you can move your existing Shopify site to Ignite. You can use the Shopify importer to import your products to Ignite. Get to know more about it by clicking here',
    },
    {
      title: 'Can I customize the design of my ecommerce store?',
      content:
        'Yes, Ignite has a themes marketplace where you can find themes which are suitable for your business. You can customize the fonts, colors and various sections of the theme. Find more details about Ignite Themes here.',
    },
    {
      title: 'Can I give access to my staff on Ignite?',
      content:
        'Yes, you can choose to share access with your staff with the help of staff accounts on Ignite. Check out how to make a staff account here.',
    },
    {
      title: 'Will there be an auto-debit after the subscription ends?',
      content:
        'No, the subscription charges wont be deducted automatically once the subscription ends.',
    },
    {
      title: 'Any restriction on products that can be sold on Ignite?',
      content:
        'Anything that is legal to sell in your country is allowed to be sold on Ignite. You can refer to the list of restricted products on Ignite by clicking here.',
    },
  ];

  let expandIcon;

  if (Array.isArray(itemss) && itemss.length) {
    expandIcon = !isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />;
  }

  const handleFAQ = (e) => {
    setSection(e);
    setOpen(!isOpen);
  };

  const inDrawerClick = () => {
    setdisplayCartSidebar(true);
  };

  useEffect(() => {
    resetPaymentCart();
  }, []);

  const onSubscribePress = (res) => {
    setSubscribeModal(true);
    setSelectedData(res);
  };

  const { price: itemPrice } = usePrice({
    amount: selectedData.price,
  });

  const regex = /(\d+)/g;
  const itemValue = parseFloat(itemPrice?.match(regex));
  const totalValue = parseFloat(totalPrice?.match(regex));
  const sum = itemValue + totalValue;

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      {isSubscription ? (
        <>
          <RoleList list={packagesList} />
          <div className="flex space-x-5">
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 3xl:grid-cols-6">
              {addonList?.map((addon: any, index: any) => (
                <ProductCard key={index} item={addon} />
              ))}
            </div>
          </div>
          <div onClick={inDrawerClick}>
            <CartCounterButton />
          </div>
          <Drawer
            open={displayCartSidebarinFile}
            onClose={() => setdisplayCartSidebar(false)}
            variant="right"
          >
            <DrawerWrapper hideTopBar={true}>
              <SubscriptionCart data={packagesList} />
            </DrawerWrapper>
          </Drawer>
        </>
      ) : (
        <>
          <Card>
            <h1 className="text-center text-2xl mb-6">
              Select a plan that best suits your business requirements
            </h1>
            <div className="justify-center">
              <Tab.Group>
                <div className="flex justify-center items-center">
                  <Tab.List className="flex w-1/2 justify-center space-x-1 rounded-xl bg-blue-900/20 p-1">
                    {Object.keys(categories).map((category) => (
                      <Tab
                        key={category}
                        className={({ selected }) =>
                          classNames(
                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                            selected
                              ? 'bg-white shadow'
                              : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                          )
                        }
                      >
                        {category}
                      </Tab>
                    ))}
                  </Tab.List>
                </div>

                <Tab.Panels className="mt-2">
                  {Object.values(categories).map((posts: any, idx) => (
                    <Tab.Panel
                      key={idx}
                      className={classNames(
                        'rounded-xl bg-white p-3',
                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                      )}
                    >
                      <ul>
                        <div className="ld:grid-cols-3 md:grid-cols-3 grid gap-4 flex">
                          {ListData.map((res, i) => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(
                              res.plan_description,
                              'text/html'
                            );
                            const listItems = Array.from(
                              doc.querySelectorAll('li')
                            );
                            if (
                              posts[0]?.status == 'Monthly' &&
                              res.billing_period == 'm' &&
                              res.currency_code == currencyCode
                            ) {
                              return (
                                <Card key={i} className="border flex flex-col">
                                  <span className="text-xl">
                                    {res.plan_name}
                                  </span>
                                  <h1 className="text-md text-gray-500 pt-2">
                                    For small business and influencers.
                                  </h1>
                                  <div className=" mt-8 mb-3">
                                    <span className=" text-3xl font-bold">
                                      {res.currency_symbol}
                                      {res.price}
                                    </span>
                                    <span className="text-md text-gray-500">
                                      / month
                                    </span>
                                  </div>
                                  <div className="mb-5">
                                    {listItems.map((item, index) => (
                                      <div className="flex pt-2" key={index}>
                                        <TiTick className="w-6 h-6" />
                                        <div
                                          className="text-gray-500 pl-2 pt-1 text-sm"
                                          dangerouslySetInnerHTML={{
                                            __html: item.innerHTML,
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-auto">
                                    <Button
                                      onClick={() => onSubscribePress(res)}
                                      className="w-full"
                                    >
                                      Add to cart
                                    </Button>
                                  </div>
                                </Card>
                              );
                            } else if (
                              res.billing_period == 'y' &&
                              posts[0]?.status == 'Yearly (save 17%)' &&
                              res.currency_code == currencyCode
                            ) {
                              return (
                                <Card key={i} className="border flex flex-col">
                                  <span className="text-xl">
                                    {res.plan_name}
                                  </span>
                                  <h1 className="text-md text-gray-500 pt-2">
                                    For small business and influencers.
                                  </h1>
                                  <div className=" mt-8 mb-3">
                                    <span className=" text-3xl font-bold">
                                      {res.currency_symbol}
                                      {res.price}
                                    </span>
                                    <span className="text-md text-gray-500">
                                      / year
                                    </span>
                                  </div>
                                  <div className="mb-5">
                                    {listItems.map((item, index) => (
                                      <div className="flex pt-2" key={index}>
                                        <TiTick className="w-6 h-6" />
                                        <div
                                          className="text-gray-500 pl-2 pt-1 text-sm"
                                          dangerouslySetInnerHTML={{
                                            __html: item.innerHTML,
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-auto">
                                    <Button
                                      onClick={() => onSubscribePress(res)}
                                      className="w-full"
                                    >
                                      Add to cart
                                    </Button>
                                  </div>
                                </Card>
                              );
                            }
                          })}
                        </div>
                      </ul>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>
          </Card>
          <div onClick={inDrawerClick}>
            <CartCounterButton />
          </div>
          <Card className="mt-5">
            <div className="">
              {itemss.map((item, index) => (
                <>
                  <div className="my-2 ">
                    <button
                      className="flex w-full items-center rounded-t border-0 bg-slate-200 p-2 text-base outline-none text-start  focus:ring-0"
                      onClick={() => {
                        handleFAQ(index);
                      }}
                    >
                      <p className="flex-1 text-emerald-700">
                        {t(`${item.title}`)}
                      </p>
                      <span className="text-emerald-700">{expandIcon}</span>
                    </button>

                    {isOpen && section === index && (
                      <div className="rounded-b bg-stone-100 p-2 ">
                        <section>{t(`${item.content}`)}</section>
                      </div>
                    )}
                  </div>
                </>
              ))}
            </div>
          </Card>

          <Modal open={subscribeModal} onClose={() => setSubscribeModal(false)}>
            <Card className="mt-4" style={{ width: 750 }}>
              <div className="flex">
                <div className="w-full pr-5">
                  <div>
                    <h1 className="text-justify text-sm font-black">
                      Billing plan
                    </h1>
                  </div>
                  <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-300"></hr>
                  <div className="flex justify-between">
                    <p className="text-justify text-sm">
                      {selectedData.plan_name}
                    </p>
                    <p className="text-justify text-md font-black">
                      {selectedData.currency_symbol}
                      {selectedData.price}
                    </p>
                  </div>
                  <div className="flex justify-end mt-2 mb-1">
                    <p className="text-justify text-xs font-black text-gray-400">
                      Then {selectedData.currency_symbol}
                      {selectedData.price} yearly
                    </p>
                  </div>
                  <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-300"></hr>
                  <div className="flex justify-between">
                    <p className="text-justify text-sm">Due Today</p>
                    <p className="text-justify text-md font-black">
                      {selectedData.currency_symbol}
                      {selectedData?.price}
                    </p>
                  </div>
                  <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-300"></hr>
                  <div className="flex justify-between items-end">
                    <p className="text-justify text-sm">Total</p>
                    <p className="text-justify text-md font-black">
                      {selectedData.currency_symbol}
                      {sum}
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  {selectedData?.addons?.map((res: any, i: any) => (
                    <ProductCard planData={selectedData} key={i} item={res} />
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-5 pt-3 border-t-2">
                <Button onClick={() => setSubscribeModal(false)}>Close</Button>
                <Button onClick={() => setSubscribeModal(false)}>
                  Confirm
                </Button>
              </div>
            </Card>
          </Modal>
          <Drawer
            open={displayCartSidebarinFile}
            onClose={() => setdisplayCartSidebar(false)}
            variant="right"
          >
            <DrawerWrapper hideTopBar={true}>
              <SubscriptionCart data={ListData} />
            </DrawerWrapper>
          </Drawer>
        </>
      )}
    </>
  );
}

TypesPage.authenticate = {
  permissions: adminOnly,
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
  },
});
