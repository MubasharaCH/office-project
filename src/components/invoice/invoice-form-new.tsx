import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { selectStyles } from '../ui/select/select.styles';
import Select, { createFilter } from 'react-select';
import TextArea from '@/components/ui/text-area';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import defaulImage from '../../assets/images/default.png';
import {
  AddingSellFunction,
  GetFunction,
  ShareOrder,
  site_url,
  UpdatingSellFunction,
  DashboardGetFun,
} from '@/services/Service';
import Loader from '@/components/ui/loader/loader';
import Label from '../ui/label';
import Search from '../common/Newearch';
import Modal from '@/components/ui/modal/modal';
import { useCart } from '@/contexts/quick-cart/cart.context';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import Drawer from '@/components/ui/drawer';
import usePrice from '@/utils/use-price';
import { CloseIcon } from '@/components/icons/close-icon';
import { FiCopy } from 'react-icons/fi';
import useClipboard from 'react-use-clipboard';
import CartItem from '../cart/item';
import { uid } from 'uid';
import { Switch } from '@headlessui/react';
import { FixedSizeList as List } from 'react-window';
import Counter from '../ui/counter';

export default function CreateOrUpdateTypeForm(initialValue: any) {
  const { t } = useTranslation();
  const {
    total,
    name,
    items,
    resetCart,
    resetPaymentCart,
    resetDiscountValue,
  } = useCart();

  const [loadingData, setloadingData] = useState(true);
  const [ListDataSearch, setListDataSearch] = useState<any>([]);
  const [newArr, setNewArr] = useState<any>([]);
  const [testArr, setTestArr] = useState<any>([]);
  const [customerID, setCustomerID] = useState<any>();
  const [locationID, setLocationID] = useState<any>();
  const [amountValue, setAmountValue] = useState<any>();
  const [status, setStatus] = useState<any>();
  const [paymentMethods, setPaymentMethods] = useState<any>();
  const [checked, setChecked] = useState<any>([]);
  const [openDrawer, setOpenDrawer] = useState<any>(false);
  const [paymentDrawer, setPaymentDrawer] = useState<any>(false);
  const [shippingDrawer, setShippingDrawer] = useState<any>(false);
  const [CustomerArray, setCustomerArray] = React.useState<any>([]);
  const [DefaultCustomerArray, setDefaultCustomerArray] = React.useState<any>(
    []
  );
  const [locationDataArray, setLocationDataArray] = React.useState<any>([]);
  const [
    DefaultlocationDataArray,
    setDefaultLocationDataArray,
  ] = React.useState<any>([]);
  const [paymentDataArray, setPaymentDataArray] = React.useState<any>([]);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [shreLoading, setShreLoading] = useState(false);
  const [balance, setBalance] = useState<any>();
  const [newBalance, setNewBalance] = useState<any>('');
  const [ShareURL, setShareURL] = useState<any>();
  const [closeDialog, setCloseDialog] = useState<any>(false);
  const [customProductModal, setCustomProductModal] = useState<any>(false);
  const [currency, setCurrency] = React.useState<any>();
  const [defaultProductName, setDefaultProductName] = React.useState<any>();
  const [defaultUnitPrise, setDefaultUnitPrise] = React.useState<any>(0);
  const [taxArray, setTaxDataArray] = useState<any>([]);
  const [NewTotal, setNewTotal] = useState<any>(0);
  const [TotalDiscount, setTotalDiscount] = useState<any>(0);
  const [OpenProduct, setOpenProduct] = useState<any>();

  const [shippingDetail, setShippingDetail] = useState();
  const [shippingAddress, setShippingAddress] = useState();
  const [shippingCharges, setShippingCharges] = useState();
  const [deliveredTo, setdeliveredTo] = useState();
  const [shippingStatus, setShippingStatus] = useState('pending');
  const [CountryList, setCountryList] = useState<any>([]);
  const [CityListNew, setCityListNew] = useState<any>([]);
  const [CityList, setCityList] = useState<any>([]);
  const [CityListPayload, setCityListPayload] = useState<any>();
  const [productNameText, setProductNameText] = useState<any>('');
  const [CountryListPayload, setCountryListPayload] = useState<any>([]);
  const [cardItemDiv, setCardItemDiv] = useState<any>(false);
  const router = useRouter();
  const height = 35;
  const MenuList = ({ options, children, maxHeight, getValue }) => {
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;

    return (
      <List
        width="100%"
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  };

  useEffect(() => {
    DashboardGetFun('/currencies').then((result1) => {
      let ordersData = result1.map((data, i) => {
        return {
          id: data.id,
          value: data.country.toLowerCase(),
          label: data.country,
          city: data.cities,
        };
      });
      setCountryList(ordersData);
    });
  }, []);

  React.useEffect(() => {
    resetCart();
    resetPaymentCart();
    resetDiscountValue();
  }, []);

  React.useEffect(() => {
    initialValue?.data?.sell_lines.map((res, i) => {
      let tax_amount = 0;
      GetFunction('/tax').then((result) => {
        let taxData = result.data;
        let taxArr = taxData.map((data, i) => {
          return {
            key: data.id,
            id: data.id,
            value: data.amount,
            label: data.name,
          };
        });
        taxArr.map((ressss) => {
          if (ressss.id === res.tax_id) {
            tax_amount = ressss.value;
          }
        });

        let producy_quantity;
        res.product.variation_options.map((res2) => {
          if (res.variation_id == res2.id) {
            res2.variation_location_details.map((responce) => {
              if (
                responce.variation_id == res.variation_id &&
                responce.location_id == initialValue?.data.location_id
              ) {
                producy_quantity = responce.qty_available;
              }
            });
            if (initialValue != null) {
              let object = {
                key: i,
                id: res.id,
                productId: res.product.id,
                variationsId: res.variation_id,
                name:
                  res.product.sku == 'IS-OP-SKU'
                    ? res.sell_line_note
                    : res.product.name,
                image: res2.media.length
                  ? res2.media[0].display_url
                  : res.product.image_url,
                product_tax_id: res.tax_id,
                product_tax: res.item_tax,
                product_tax_calculate: tax_amount,
                product_tax_percentage: tax_amount,
                enable_stock: res.product.enable_stock,
                price:
                  res2.sell_price_inc_tax != 0
                    ? res2.sell_price_inc_tax
                    : Number(res.unit_price_inc_tax),
                unit_price:
                  res2.default_sell_price != 0
                    ? res2.default_sell_price
                    : res.unit_price_before_discount,
                variation_location_details: res2.variation_location_details,
                product_qty: producy_quantity,
                discount: res.line_discount_amount,
              };

              addItemToCart(object, res.quantity);
            }
          }
        });
      });
    });
  }, []);

  function getTaxableAmount(array) {
    let value: any = 0;
    array.map((re) => {
      let unitValue =
        (Number(re.unit_price) - Number(re.discount)) * re.quantity;

      value = value + unitValue;
    });
    return value;
  }

  function getVatAmount(array) {
    let value: any = 0;

    array.map((re) => {
      let UnitValue: any = 0;
      UnitValue = Number(re.unit_price) - Number(re.discount);
      value =
        (UnitValue * (1 + re.product_tax_percentage / 100) - UnitValue) *
          re.quantity +
        value;
    });
    return value;
  }

  function getTotalAmount() {
    return getTaxableAmount(items) + getVatAmount(items);
  }

  const getProductFunction = (locationID) => {
    if (locationID) {
      GetFunction('/product?location_id=' + locationID + '&per_page=-1').then(
        (result) => {
          let newvariable: any = result?.data.filter(
            (item) => item.sku !== 'IS-OP-SKU'
          );
          setOpenProduct(result?.data[0]);
          let abc: any = [];
          newvariable?.map((data, i) => {
            data?.variation_options.map((res, i) => {
              let variationName = res.name == 'DUMMY' ? '' : '-' + res.name;
              let tax_id = data?.product_tax ? data?.product_tax?.id : '';

              let aaa = data?.product_tax?.amount
                ? data?.product_tax?.amount
                : 0;
              let tax_amount =
                res.default_sell_price * (1 + aaa / 100) -
                res.default_sell_price;

              let newObj = {
                key: i,
                id: res.id,
                productId: data.id,
                variationsId: res.id,
                name: data.name + variationName + ' (' + data.sku + ')',
                image: res.media.length
                  ? res.media[0].display_url
                  : data.image_url,
                product_tax_id: tax_id,
                product_tax: tax_amount,
                product_tax_calculate: aaa,
                product_tax_percentage: aaa,
                enable_stock: data.enable_stock,
                price: res.sell_price_inc_tax,
                unit_price: res.default_sell_price,
                variation_location_details: res.variation_location_details,
              };
              abc.push(newObj);
              return newObj;
            });
          });

          // setNewArr(abc);
          setTestArr(abc);
          setListDataSearch(abc);
        }
      );
    }
  };

  React.useEffect(() => {
    getProductFunction(locationID);
  }, [locationID]);

  React.useEffect(() => {
    GetFunction('/contactapi?per_page=-1').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });
      var item = ordersData.find(
        (item) => item.id === initialValue.data?.contact_id
      );
      setDefaultCustomerArray([{ label: item?.label }]);
      setCustomerArray(ordersData);
      setCustomerID(item?.id ? item.id : ordersData[0].id);
    });
  }, []);

  React.useEffect(() => {
    GetFunction('/business-location').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });
      let paymentData = result.data.map((data, i) => {
        let newData = data.payment_methods.map((res, i) => {
          return {
            key: i,
            value: res.name,
            label: res.name,
          };
        });
        return newData;
      });

      var item = ordersData.find(
        (item) => item.id === initialValue.data?.location_id
      );
      setDefaultLocationDataArray([{ label: item?.label }]);
      setLocationDataArray(ordersData);
      let paymentMethods = [
        {
          name: 'cash',
          label: 'cash',
          account_id: null,
        },
        {
          name: 'card',
          label: 'card',
          account_id: null,
        },
        {
          name: 'cheque',
          label: 'cheque',
          account_id: null,
        },
        {
          name: 'bank_transfer',
          label: 'bank_transfer',
          account_id: null,
        },
      ];
      setPaymentDataArray(paymentMethods);
      setLocationID(ordersData[0]?.id);
      setStatus('draft');
      setloadingData(false);
    });
  }, []);

  const filterBySearch = (event) => {
    setOpenDrawer(true);
  };

  const modalfilterBySearch = (event) => {
    const query = event.target.value;
    if (query.length > 0) {
      var updatedList = [...ListDataSearch];
      let searchLower = query.toLowerCase();
      let filtered = updatedList.filter((list) => {
        if (list.name.toLowerCase().includes(searchLower)) {
          return true;
        }
      });
      setNewArr(filtered);
      setProductNameText(query);
    } else {
      setNewArr([]);
      setProductNameText(query);
    }
  };

  const closeFunction = () => {
    setChecked([]);
    setOpenDrawer(false);
    setNewArr(ListDataSearch);
  };
  const closeFunctionPayment = () => {
    setPaymentDrawer(false);
    setShippingDrawer(false);
  };

  const onClickAddPayment = () => {
    setPaymentDrawer(true);
  };
  const onClickAddShipping = () => {
    setShippingDrawer(true);
  };

  const handleSelect = (event) => {
    setChecked([]);
    const value = event.target.id;
    const isChecked = event.target.checked;
    if (isChecked) {
      setChecked([...checked, value]);
    } else {
      const filteredList = checked.filter((item) => item !== value);
      setChecked(filteredList);
    }
  };

  const {
    addItemToCart,
    addPaymentToCart,
    clearPaymentItemFromCart,
  } = useCart();

  const { price } = usePrice({
    amount: total,
  });

  const onAddHandler = (id) => {
    const array = ListDataSearch;
    // checked.map((res) => {
    const object = array.find((obj) => obj.id == id);

    if (object.enable_stock == 1) {
      if (object.variation_location_details.length > 0) {
        object.variation_location_details.map((inner_res) => {
          if (inner_res && inner_res?.location_id == locationID) {
            if (inner_res.qty_available < 1) {
              toast.error(object.name + t('common:out-of-stock'), {
                autoClose: 5000,
              });
            } else {
              object.product_qty = inner_res.qty_available;
              object.discount = 0;
              if (newBalance != '') {
                let newVar = Math.round(newBalance) + Math.round(object?.price);
                setNewBalance(newVar);
                setBalance(newVar);
              }
              addItemToCart(object, 1);
            }
          }
        });
      } else {
        toast.error(object.name + t('common:out-of-stock'), {
          autoClose: 5000,
        });
      }
    } else {
      object.discount = 0;
      if (newBalance != '') {
        let newVar = Math.round(newBalance) + Math.round(object?.price);
        setNewBalance(newVar);
        setBalance(newVar);
      }
      addItemToCart(object, 1);
    }
    // });
    setOpenDrawer(false);
    setNewArr([]);
    setChecked([]);
    setProductNameText('');
    setCardItemDiv(false);
  };

  const OnChangeCustomers = (e) => {
    setCustomerID(e.id);
  };
  const OnChangeLocation = (e) => {
    setLocationID(e.id);
  };
  const OnChangeStatus = (e) => {
    setStatus(e.label);
  };
  const OnChangePaymentMethod = (e) => {
    setPaymentMethods(e.label);
  };
  const OnChangeShippingStatus = (e) => {
    setShippingStatus(e.label);
  };
  const onChangeAmmount = (e) => {
    setAmountValue(e.target.value);
  };

  const collectPayment = () => {
    setCreatingLoading(true);

    let productDetails = items.map((res) => {
      let qty: any = res.quantity;
      return {
        product_id: res.productId,
        variation_id: res.variationsId,
        quantity: res.quantity,
        unit_price: res.unit_price,
        tax_rate_id: res.product_tax_id,
        note: res.note,
        discount_amount: res.discount,
        discount_type: 'fixed',
        lot_no_line_id: res.lotNumber,
      };
    });

    let paymentDetails = name.map((res) => {
      return {
        amount: res.amount,
        method: res.name,
        card_type: '',
        note: 'Test notes',
      };
    });

    let formData = {
      sells: [
        {
          shipping_details: shippingDetail,
          shipping_address: shippingAddress,
          shipping_charges: shippingCharges,
          shipping_status: shippingStatus,
          delivered_to: deliveredTo,
          shipping_city: CityListPayload?.value ? CityListPayload?.value : '',
          order_type: 'Pickup',
          contact_id: customerID,
          location_id: locationID,
          status: status,
          change_return: 0,
          order_source: 'console',
          products: productDetails,
          payments: paymentDetails,
        },
      ],
    };

    let formDataUpdate = {
      shipping_details: shippingDetail,
      shipping_address: shippingAddress,
      shipping_charges: shippingCharges,
      shipping_status: shippingStatus,
      delivered_to: deliveredTo,
      shipping_city: CityListPayload?.value ? CityListPayload?.value : '',
      order_type: 'Pickup',
      contact_id: customerID,
      location_id: locationID,
      status: status,
      change_return: 0,
      order_source: 'console',
      products: productDetails,
      payments: paymentDetails,
    };
    if (initialValue.data) {
      let ID = initialValue?.data?.id;
      UpdatingSellFunction('/sell/' + ID, formDataUpdate).then((result) => {
        if (result[0]?.exception == null) {
          toast.error(result[0]?.original?.error?.message);
          setCreatingLoading(false);
        }
        setCustomerID(result[0]?.contact_id);
        if (result?.business_id) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          resetPaymentCart();
          router.back();
        }
      });
    } else {
      AddingSellFunction('/sell', formData).then((result) => {
        if (result[0]?.exception == null) {
          toast.error(result[0]?.original?.error?.message);
          setCreatingLoading(false);
        }
        if (result[0]?.business_id) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          resetPaymentCart();
          router.back();
        }
      });
    }
  };

  let StatusArray = [
    { label: 'draft', key: 'Draft' },
    { label: 'final', key: 'Final' },
  ];

  const onAddPaymentHandlew = () => {
    let id = Math.floor(Math.random() * 100);
    var txt = NewTotal;
    var numb = txt;
    let NEW_BALANCE: any;
    if (newBalance == '') {
      NEW_BALANCE = numb - amountValue;
      setNewBalance(NEW_BALANCE);
    } else {
      NEW_BALANCE = newBalance - amountValue;
      setNewBalance(NEW_BALANCE);
    }

    let obj = {
      id: id,
      name: paymentMethods,
      balance: NEW_BALANCE,
      amount: amountValue,
    };

    addPaymentToCart(obj);
    setBalance(NEW_BALANCE);
    setPaymentDrawer(false);
  };

  const onCrossAmount = (amont) => {
    let newAmount = Math.round(balance) + Math.round(amont);
    setBalance(newAmount);
    setNewBalance(newAmount);
  };

  const onShareClick = () => {
    setShreLoading(true);
    let productDetails = items.map((res) => {
      let qty: any = res.quantity;
      return {
        product_id: res.productId,
        variation_id: res.variationsId,
        quantity: res.quantity,
        unit_price: res.unit_price,
        tax_rate_id: res.product_tax_id,
        note: res.note,
        discount_amount: res.discount,
        discount_type: 'fixed',
      };
    });

    let paymentDetails = name.map((res) => {
      return {
        amount: res.amount,
        method: res.name,
        card_type: '',
        note: 'Test notes',
      };
    });

    let formData = {
      sells: [
        {
          shipping_details: shippingDetail,
          shipping_address: shippingAddress,
          shipping_charges: shippingCharges,
          shipping_status: shippingStatus,
          shipping_city: CityListPayload?.value ? CityListPayload?.value : '',
          delivered_to: deliveredTo,
          order_type: 'Pickup',
          contact_id: customerID,
          location_id: locationID,
          status: status,
          change_return: 0,
          order_source: 'console',
          products: productDetails,
          payments: paymentDetails,
        },
      ],
    };

    AddingSellFunction('/sell', formData).then((result) => {
      if (result[0]?.exception == null) {
        toast.error(
          result[0]?.original?.error?.message ==
            'ERROR: NOT ALLOWED: Mismatch between sold and purchase quantity. Product: manage stock 0 SKU: ds Quantity: 1'
            ? 'Product out of stock'
            : result[0]?.original?.error?.message
        );
        setShreLoading(false);
      }
      if (result[0]?.business_id) {
        let token = result[0]?.invoice_token;
        let obJData = {
          url: site_url + '/invoice/' + token,
        };
        resetPaymentCart();
        ShareOrder(obJData).then((res) => {
          if (res?.short) {
            setCloseDialog(true);
          }
          setShareURL(res?.short);
          setShreLoading(false);
        });
      }
    });
  };

  const [isCopied, setCopied] = useClipboard(ShareURL);

  const onClickClose = () => {
    setCloseDialog(false);
    router.back();
  };

  const onDecFun = (q) => {
    if (newBalance != '') {
      let newVar = Math.round(balance) - Math.round(q);
      setBalance(newVar);
      setNewBalance(newVar);
    }
  };

  const onIncFun = (q) => {
    if (newBalance != '') {
      let newVar = Math.round(balance) + Math.round(q);
      setBalance(newVar);
      setNewBalance(newVar);
    }
  };

  const removePaymentItem = (id) => {
    clearPaymentItemFromCart(id);
  };

  let shippingStatusDrop = [
    {
      name: 'pending',
      label: 'Pending',
      account_id: null,
    },
    {
      name: 'accepted',
      label: 'Accepted',
      account_id: null,
    },
    {
      name: 'rejected',
      label: 'Rejected',
      account_id: null,
    },
    {
      name: 'shipped',
      label: 'Shipped',
      account_id: null,
    },
    {
      name: 'completed',
      label: 'Completed',
      account_id: null,
    },
    {
      name: 'ready',
      label: 'Ready',
      account_id: null,
    },
    {
      name: 'canceled',
      label: 'Canceled',
      account_id: null,
    },
    {
      name: 'failed',
      label: 'Failed',
      account_id: null,
    },
  ];

  React.useEffect(() => {
    if (items.length === 0) {
      setBalance('');
      setNewBalance('');
    }
  }, [items]);

  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setCurrency(JSON.parse(businessDetails));
  }, []);

  const addCustomProduct = () => {
    setCustomProductModal(true);
  };

  const onChangeProductName = (e) => {
    setDefaultProductName(e.target.value);
  };
  const onChangeUnitPrise = (e) => {
    setDefaultUnitPrise(e.target.value);
    setdisSelect(false);
    if (incSwitch) {
      let value = e.target.value / (1 + TaxAmount / 100);
      let val2 = e.target.value - value;
      setTaxVal(val2);
    } else {
      let value = e.target.value * (1 + TaxAmount / 100);
      let val2 = value - e.target.value;
      setTaxVal(val2);
    }
  };

  const onProductAddButton = () => {
    let price = defaultUnitPrise;
    let tax = TaxAmount;
    let has_inc_tax = incSwitch;
    let unit_price;
    let sell_price_inc_tax;
    let tax_value;

    if (has_inc_tax) {
      unit_price = price / (1 + tax / 100);
      sell_price_inc_tax = price;
      tax_value = sell_price_inc_tax - unit_price;
    } else {
      sell_price_inc_tax = price * (1 + tax / 100);
      unit_price = price;
      tax_value = sell_price_inc_tax - unit_price;
    }

    let object = {
      showName: true,
      id: uid(),
      productId: OpenProduct?.id,
      name: defaultProductName,
      note: defaultProductName,
      price: sell_price_inc_tax,
      price_w_tax: tax_value,
      image: site_url + 'img/default.png',
      variationsId: OpenProduct?.variation_options[0]?.id,
      product_tax: tax_value,
      unit_price: unit_price,
      sell_price_inc_tax: sell_price_inc_tax,
      discount: 0,
      product_tax_calculate: TaxAmount,
      product_tax_percentage: TaxAmount,
      product_tax_id: taxValID,
      quantity: 0,
      product_qty: 0,
      key: uid(),
      enable_stock: 0,
      variation_location_details: [],
    };
    addItemToCart(object, 1);
    setCustomProductModal(false);
    setTaxAmount(0);
  };
  const [taxVal, setTaxVal] = useState<any>('');
  const [taxValID, setTaxValID] = useState<any>('');
  const [incSwitch, setincSwitch] = useState<any>(false);
  const [disSelect, setdisSelect] = useState<any>(true);
  const [TaxAmount, setTaxAmount] = useState<any>(0);

  const onChangeSwitch = () => {
    setincSwitch((value: any) => !value);
  };

  const TaxOnChange = (e) => {
    setTaxAmount(e.value);
    setTaxValID(e.id);
    if (incSwitch) {
      let value = defaultUnitPrise / (1 + e.value / 100);
      let val2 = defaultUnitPrise - value;
      setTaxVal(val2);
    } else {
      let value = defaultUnitPrise * (1 + e.value / 100);
      let val2 = value - defaultUnitPrise;
      setTaxVal(val2);
    }
  };

  const onCHangeShippingAddress = (e) => {
    setShippingAddress(e.target.value);
  };
  const onChangeShippingCharges = (e) => {
    setShippingCharges(e.target.value);
  };

  useEffect(() => {
    let calculateDis = items.reduce((accumulator, object: any) => {
      let plusDis = accumulator + Number(object.discount) * object.quantity;
      return plusDis;
    }, 0);

    setTotalDiscount(calculateDis);
    let new_total_val = getTaxableAmount(items) + getVatAmount(items);
    setNewTotal(new_total_val);
  });

  const onChangeCountry = (e) => {
    setCityListNew([]);
    setCityList([]);
    setCountryListPayload(e);
    let cityLiast = e?.city?.map((aa, i) => {
      return {
        label: aa,
        value: aa,
        id: i,
      };
    });

    setCityList(cityLiast);
    let cities: any = cityLiast;
    let finalArray = cities.sort(function (a, b) {
      var labelA = a.label.toUpperCase();
      var labelB = b.label.toUpperCase();

      // Check if the label contains "All"
      var containsAllA = labelA.includes('ALL');
      var containsAllB = labelB.includes('ALL');

      // Sort cities with "All" label at the start
      if (containsAllA && !containsAllB) {
        return -1;
      }
      if (!containsAllA && containsAllB) {
        return 1;
      }

      // Sort remaining cities alphabetically
      if (labelA < labelB) {
        return -1;
      }
      if (labelA > labelB) {
        return 1;
      }
      return 0;
    });

    setCityListNew(finalArray);
  };

  const onAddNewItemClick = () => {
    setCardItemDiv(true);
  };

  const onChangeCityLIst = (e) => {
    setCityListPayload(e);
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <div className="container m-auto grid gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8">
      <div className="sm:col-span-2 md:col-span-3 lg:col-span-5">
        <Card className="w-full ">
          <Label>{t('form:input-label-products')}</Label>
          <div className="pt-1">
            {items?.map((item) => (
              <CartItem
                item={item}
                key={item.id}
                onCrossIcoDecPress={() => onDecFun(item.price)}
                onCrossIcoIncPress={() => onIncFun(item.price)}
              />
            ))}
          </div>
          {cardItemDiv && (
            <div className="flex items-center border-b border-solid border-border-200 border-opacity-75 py-4 px-4 sm:px-6 text-sm ">
              <div className="flex-shrink-0">
                <Counter
                  value={0}
                  variant="pillVertical"
                  disabled={false}
                  onDecrement={() => alert('')}
                  onIncrement={() => alert('')}
                />
              </div>
              <div className="relative mx-4 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
                <Image
                  src={defaulImage}
                  alt="no image"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="pl-3">
                <input
                  onChange={modalfilterBySearch}
                  className="pb-3 border-2 w-72 rounded p-2 h-9"
                  value={productNameText}
                />
                <div className="dropdown-wrapper ">
                  {newArr.length > 0 ? (
                    <div className="absolute w-72 dropdown-list bg-gray-100 max-h-80 overflow-y-auto ">
                      {newArr?.map((res: any, index: any) => (
                        <div
                          onClick={() => onAddHandler(res.id)}
                          key={index}
                          className="dropdown-item grid grid-cols-6 gap-4 border-t-2 p-5 cursor-pointer"
                        >
                          <div className="col-span-5">
                            <div className="flex">
                              <div>
                                {res.name}
                                <br />
                                Price: {Math.round(res.price)}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-1">
                            <div></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className="flex">
                  <p className="my-2.5 mr-2 font-semibold text-accent">
                    <span className="font-bold text-heading">
                      {t('Taxable Price:')}{' '}
                    </span>
                    {'00:00' + currency?.symbol}
                  </p>
                  <p className="my-2.5 font-semibold text-accent">
                    <span className="font-bold text-heading">
                      {t('common:text-tax')}
                    </span>
                    {'00:00' + currency?.symbol}
                  </p>
                </div>
                <div className="flex">
                  <p
                    style={{ color: 'blue', cursor: 'pointer' }}
                    className="pt-0 "
                  >
                    {t('Discount')}
                  </p>
                  <span className="pl-2 font-semibold text-accent">00:00</span>
                </div>
              </div>
              <span className="font-bold text-heading ms-auto">00:00</span>
            </div>
          )}

          <div
            onClick={onAddNewItemClick}
            className="p-3 border-dashed w-full border-2 text-center text-sm mt-3 cursor-pointer"
          >
            Add new invooice item
          </div>

          {/* <div onClick={onCrossIcoDecPress}>
            <button
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 -me-2 ms-3 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
              onClick={() => clearItemFromCart(item.id)}
            >
              <span className="sr-only">{t('text-close')}</span>
              <CloseIcon className="h-3 w-3" />
            </button>
          </div> */}

          {/* <Drawer open={openDrawer} onClose={closeFunction} variant="right">
            <DrawerWrapper onClose={closeFunction} hideTopBar={false}>
              <div className="m-auto rounded bg-light sm:w-[28rem]">
                <div className="p-4">
                  <Label>{t('form:input-label-all-products')}</Label>
                  <Search
                    onChangeearchVal={modalfilterBySearch}
                    className="pb-3"
                  />
                  <div className="pb-20">
                    {newArr?.map((res: any, index: any) => (
                      <div
                        key={index}
                        className="grid grid-cols-6 gap-4 border-t-2 p-5"
                      >
                        <div className="col-span-5">
                          <div className="flex">
                            <div key={index}>
                              <input
                                type="checkbox"
                                className="mr-5 h-6 w-6 accent-dark"
                                name={res.name}
                                id={res.id}
                                onChange={handleSelect}
                              />
                            </div>
                            <label htmlFor={res.id}>
                              {res.name}
                              <br />
                              Price:{Math.round(res.price)}
                            </label>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <div></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      onClick={onAddHandler}
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('common:add-product')}
                      </div>
                    </button>
                  </footer>
                </div>
              </div>
            </DrawerWrapper>
          </Drawer> */}
          {/* <Button className="mt-3" onClick={addCustomProduct}>
            {t('form:form-button-add-custom-product')}
          </Button> */}
        </Card>
        <Card className="mt-5 w-full">
          <div className="mb-5 flex justify-between ">
            <Label className="mb-3">
              {t('form:input-label-payment-method')}
            </Label>
            <Label className="mb-3">{t('form:input-label-amount')}</Label>
          </div>
          <div>
            {name?.length > 0 &&
              items?.length > 0 &&
              name?.map((res, key) => (
                <div key={key}>
                  <div className="mb-3 flex justify-between ">
                    <div className="mt-1 text-sm">{res.name}</div>
                    <div className="flex">
                      <div className="mt-1 text-sm">
                        {res.amount + currency?.symbol}
                      </div>
                      <div onClick={() => onCrossAmount(res.amount)}>
                        <button
                          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 -me-2 ms-3 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
                          onClick={() => removePaymentItem(res.id)}
                        >
                          <span className="sr-only">{t('text-close')}</span>
                          <CloseIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {items?.length > 0 && name?.length > 0 && (
              <div className="mb-3 flex justify-between ">
                <Label className="mb-3">Balance:</Label>
                <Label
                  className="mb-3"
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                >
                  {Math.round(balance) + currency?.symbol}
                </Label>
              </div>
            )}
          </div>
        </Card>
        <Card className="mt-5 w-full">
          <div className="mb-5">
            <Label className="mb-3">{t('form:input-label-payment')}</Label>
          </div>

          <div className="mb-3 flex justify-between">
            <div className="text-sm">{t('form:from-label-add-discount')}</div>
            <div className="text-sm">
              {TotalDiscount.toFixed(2) + currency?.symbol}
            </div>
          </div>

          <div className="mb-3 flex justify-between">
            <div className="text-sm">{t('form:taxable-amount')}</div>
            <div className="text-sm">
              {getTaxableAmount(items).toFixed(2) + currency?.symbol}
            </div>
          </div>

          <div className="mb-3 flex justify-between">
            <div className="text-sm">{t('form:from-vat')}</div>
            <div className="text-sm">
              {getVatAmount(items).toFixed(2) + currency?.symbol}
            </div>
          </div>

          <div className="mb-3 flex justify-between ">
            <div className="text-sm">{t('form:form-item-total')}</div>
            <div className="text-sm">
              {getTotalAmount().toFixed(2) + currency?.symbol}
            </div>
          </div>

          {items?.length != 0 && (
            <div className="mt-5">
              <div className="flex justify-end">
                <Button loading={creatingLoading} onClick={collectPayment}>
                  {t('form:button-label-save')}
                </Button>
                <Button
                  loading={shreLoading}
                  className="ml-3 mr-3"
                  onClick={onShareClick}
                >
                  {t('form:button-label-share')}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
      <div className="sm:col-span-1 md:col-span-2 lg:col-span-3">
        <Card className="w-full ">
          <Label>{t('form:input-label-customers')}</Label>
          <Select
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.key}
            styles={selectStyles}
            options={CustomerArray}
            onChange={OnChangeCustomers}
            defaultValue={
              initialValue.data === undefined
                ? CustomerArray[0]
                : DefaultCustomerArray
            }
          />
        </Card>
        <Card className="mt-4 w-full">
          <Label>{t('form:input-label-location')}</Label>
          <Select
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.key}
            styles={selectStyles}
            options={locationDataArray}
            onChange={OnChangeLocation}
            defaultValue={
              initialValue.data === undefined
                ? locationDataArray[0]
                : DefaultlocationDataArray
            }
          />
        </Card>
        <Card className="mt-4 w-full">
          <Label>{t('form:input-label-status')}</Label>
          <Select
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.key}
            styles={selectStyles}
            options={StatusArray}
            onChange={OnChangeStatus}
            defaultValue={StatusArray[0]}
          />
        </Card>
        {items?.length != 0 && status == 'final' && (
          <Card className="mt-4  w-full justify-end">
            <Button className="w-full" onClick={onClickAddPayment}>
              {t('form:button-label-add-payment')}
            </Button>
            <Button className="mt-3 w-full" onClick={onClickAddShipping}>
              {t('Add Shipping Detail')}
            </Button>
          </Card>
        )}
        <Drawer
          open={paymentDrawer}
          onClose={closeFunctionPayment}
          variant="right"
        >
          <DrawerWrapper onClose={closeFunctionPayment} hideTopBar={false}>
            <div className="m-auto rounded bg-light sm:w-[28rem]">
              <div className="p-4">
                <div className="mt-3">
                  <Input
                    label={t('common:text-amount')}
                    name="credit_limit"
                    variant="outline"
                    type="number"
                    className="mb-4"
                    onChange={onChangeAmmount}
                  />
                </div>
                <div className="mt-3">
                  <Label>{t('common:text-payment-method')}</Label>
                  <Select
                    styles={selectStyles}
                    options={paymentDataArray}
                    onChange={OnChangePaymentMethod}
                  />
                </div>
                <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                  <button
                    className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                    onClick={onAddPaymentHandlew}
                  >
                    <div className="flex-1 pt-3 text-center text-light">
                      {t('form:button-label-add-payment')}
                    </div>
                  </button>
                </footer>
              </div>
            </div>
          </DrawerWrapper>
        </Drawer>
        <Drawer
          open={shippingDrawer}
          onClose={closeFunctionPayment}
          variant="right"
        >
          <DrawerWrapper onClose={closeFunctionPayment} hideTopBar={false}>
            <div className="m-auto rounded bg-light sm:w-[28rem]">
              <div className="p-4">
                <div className="mt-3">
                  <TextArea
                    onChange={onCHangeShippingAddress}
                    label="Shipping Address"
                    name="Shipping"
                  />
                </div>
                <div className="mt-3">
                  <Input
                    label={t('Shipping Charges')}
                    name="credit_limit"
                    variant="outline"
                    type="number"
                    className="mb-4"
                    onChange={onChangeShippingCharges}
                  />
                </div>

                <div className="mt-3">
                  <Label>Shipping Status</Label>
                  <Select
                    onChange={OnChangeShippingStatus}
                    options={shippingStatusDrop}
                    styles={selectStyles}
                  />
                </div>
                <div className="pt-5">
                  <Label>{t('form:input-label-select-country')}</Label>

                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    styles={selectStyles}
                    name="business_location_id"
                    options={CountryList}
                    // isMulti
                    onChange={onChangeCountry}
                  />
                </div>
                <div className="pt-5">
                  <Label>{t('form:input-label-select-city')}</Label>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    styles={selectStyles}
                    components={{ MenuList }}
                    // isMulti
                    options={CityListNew}
                    onChange={onChangeCityLIst}
                  />
                </div>
              </div>
            </div>
          </DrawerWrapper>
        </Drawer>
        <Drawer
          open={customProductModal}
          onClose={() => setCustomProductModal(true)}
          variant="right"
        >
          <DrawerWrapper
            onClose={() => setCustomProductModal(false)}
            hideTopBar={false}
          >
            <div className="m-auto rounded bg-light sm:w-[28rem]">
              <div className="p-4">
                <div style={{ textAlign: 'left', width: '100%' }}>
                  <p className=" font-bold text-heading">
                    {t('form:input-label-product-name')}{' '}
                  </p>
                  <Input
                    className="w-auto"
                    onChange={onChangeProductName}
                    name=""
                  />
                  <div className="mt-4 mb-4 flex justify-between">
                    <Label>{t('form:form-label-inclusive-tax')}</Label>
                    <Switch
                      checked={incSwitch}
                      onChange={onChangeSwitch}
                      className={`${
                        incSwitch ? 'bg-accent' : 'bg-gray-300'
                      } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                      dir="ltr"
                    >
                      <span className="sr-only">Enable </span>
                      <span
                        className={`${
                          incSwitch ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                      />
                    </Switch>
                  </div>
                  <div className="mb-5 mt-5">
                    <Label>{t('form:input-tax')}</Label>
                    <Select
                      styles={selectStyles}
                      name="taxType"
                      options={taxArray}
                      onChange={TaxOnChange}
                    />
                  </div>
                  <p className="my-2.5  font-semibold text-accent">
                    <p className=" font-bold text-heading">
                      {t('form:form-label-unit-price')}{' '}
                    </p>
                    <Input
                      className="w-auto"
                      onChange={onChangeUnitPrise}
                      name=""
                    />
                  </p>
                </div>
                <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setCustomProductModal(false)}
                      className="rounded-md border p-2"
                    >
                      {t('form:form-button-close')}
                    </button>
                    <Button
                      onClick={onProductAddButton}
                      className="rounded-md border p-2"
                    >
                      {t('form:item-description-add')}
                    </Button>
                  </div>
                </footer>
              </div>
            </div>
          </DrawerWrapper>
        </Drawer>
        <Modal open={closeDialog} onClose={() => setCloseDialog(true)}>
          <Card className="mt-4" style={{ width: 600 }}>
            <div className="flex">
              <Input
                name="credit_limit"
                variant="outline"
                className="w-full"
                value={ShareURL}
                disabled
              />
              <Button onClick={setCopied} className="mt-3">
                {isCopied ? 'Copied' : <FiCopy />}
              </Button>
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={onClickClose} className="rounded-md border p-2">
                {t('form:form-button-close')}
              </button>
            </div>
          </Card>
        </Modal>
      </div>
    </div>
  );
}
