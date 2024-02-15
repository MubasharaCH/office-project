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
import { TiTick } from 'react-icons/ti';

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
  const [amountid, setAmountid] = useState<any>('');
  const [status, setStatus] = useState<any>('draft');
  const [showPaymentButton, setshowPaymentButton] = useState<any>(false);
  const [type, setType] = useState<any>('');
  const [documentType, setDocumentType] = useState<any>('');
  const [selectedTable, setSelectedTable] = useState<any>('');
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
  const [DefaultlocationDataArray, setDefaultLocationDataArray] =
    React.useState<any>([]);
  const [paymentDataArray, setPaymentDataArray] = React.useState<any>([]);
  const [creditNotesArray, setCreditNotesArray] = React.useState<any>([]);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [shreLoading, setShreLoading] = useState(false);
  const [balance, setBalance] = useState<any>();
  const [newBalance, setNewBalance] = useState<any>('');
  const [ShareURL, setShareURL] = useState<any>();
  const [closeDialog, setCloseDialog] = useState<any>(false);
  const [customProductModal, setCustomProductModal] = useState<any>(false);
  const [listofCredits, setListofCredits] = useState<any>(false);
  const [currency, setCurrency] = React.useState<any>();
  const [defaultProductName, setDefaultProductName] = React.useState<any>();
  const [defaultUnitPrise, setDefaultUnitPrise] = React.useState<any>(0);
  const [taxArray, setTaxDataArray] = useState<any>([]);
  const [NewTotal, setNewTotal] = useState<any>(0);
  const [TotalDiscount, setTotalDiscount] = useState<any>(0);
  const [OpenProduct, setOpenProduct] = useState<any>();
  const [customFiieldsData, setCustomFiieldsData] = useState<any>('');
  const [invoiceType, setInvoiceType] = useState<any>('');
  const [enableEinvoice, setEnableEinvoice] = useState<any>(false);

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
  const [cartItemHeader, setCartItemHeader] = useState<any>(false);
  const [permissionData, setPermissionData] = useState([]);
  const [tableArr, setTableArr] = useState([]);
  const [notesChange, setNotesChange] = useState([]);

  const [customFieldsData, setCustomFieldsData] = useState({
    custom_field_1: '',
    custom_field_2: '',
    custom_field_3: '',
    custom_field_4: '',
  });

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
  const onNotesChange = (e) => {
    setNotesChange(e.target.value);
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
    GetFunction('/tax').then((result) => {
      let datas = result.data.map((data, i) => {
        return {
          id: data.id,
          value: data.amount,
          label: data.name,
        };
      });
      setTaxDataArray(datas);
    });
    setCustomFieldsData({
      custom_field_1: initialValue?.data?.custom_field_1
        ? initialValue?.data?.custom_field_1
        : '',
      custom_field_2: initialValue?.data?.custom_field_2
        ? initialValue?.data?.custom_field_2
        : '',
      custom_field_3: initialValue?.data?.custom_field_3
        ? initialValue?.data?.custom_field_3
        : '',
      custom_field_4: initialValue?.data?.custom_field_4
        ? initialValue?.data?.custom_field_4
        : '',
    });
  }, []);

  React.useEffect(() => {
    resetCart();
    resetPaymentCart();
    resetDiscountValue();
    GetFunction('/user/loggedin').then((result) => {
      setPermissionData(result?.data?.all_permissions);
      localStorage.setItem('user_detail', JSON.stringify(result.data));
    });

    setNotesChange(initialValue?.data?.additional_notes);
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
            let customFieldsArray =
              res?.product?.custom_fields?.length == 0
                ? res?.product?.category?.custom_fields
                : res?.product?.custom_fields;

            const businessDetail = JSON.parse(
              localStorage.getItem('user_business_details')!
            );
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
                price: Number(res.unit_price_inc_tax),
                unit_price: res.unit_price_before_discount,
                variation_location_details: res2.variation_location_details,
                product_qty: producy_quantity,
                discount: res.line_discount_amount,
                new_custom_fields:
                  res?.custom_field != 'null' ? res?.custom_field : null,
                custom_fields: customFieldsArray,
                custom_fields_subscription:
                  businessDetail?.subscriptions[0]?.package_details
                    .custom_field,
                // selling_price: res.group_prices,
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
              let calculateUniitPrice =
                res?.group_prices[0]?.price_inc_tax /
                (1 + aaa / res.group_prices[0]?.price_inc_tax);

              let tax_amount =
                res.default_sell_price * (1 + aaa / 100) -
                res.default_sell_price;
              let selling_tax_amount =
                calculateUniitPrice * (1 + aaa / 100) - calculateUniitPrice;
              let customFieldsArray =
                data.custom_fields.length == 0
                  ? data?.category?.custom_fields
                  : data.custom_fields;
              const businessDetail = JSON.parse(
                localStorage.getItem('user_business_details')!
              );

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
                product_tax:
                  res.group_prices.length > 0 ? selling_tax_amount : tax_amount,
                product_tax_calculate: aaa,
                product_tax_percentage: aaa,
                enable_stock: data.enable_stock,
                price: res.sell_price_inc_tax,
                unit_price:
                  res.group_prices.length > 0
                    ? calculateUniitPrice
                    : res.default_sell_price,
                variation_location_details: res.variation_location_details,
                custom_fields: customFieldsArray,
                custom_fields_subscription:
                  businessDetail?.subscriptions[0]?.package_details
                    .custom_field,
                selling_price: res.group_prices,
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
    GetFunction('/business-einvoice-details?location_id=' + locationID).then(
      (result) => {
        if (result?.einvoice_settings) {
          if (result?.einvoice_settings?.enable_einvoice) {
            setEnableEinvoice(true);
          }
          if (result?.einvoice_settings?.invoiceType === '1000') {

            
            setDocumentTypeArray([
              { label: 'TAX_INVOICE', key: 'TAX_INVOICE' },
            ]);
          }

          if (result?.einvoice_settings?.invoiceType === '0100') {
            setDocumentTypeArray([
              {
                label: 'SIMPLIFIED_TAX_INVOICE',
                key: 'SIMPLIFIED_TAX_INVOICE',
              },
            ]);
          }

          if (result.data?.einvoice_settings?.invoiceType === '1100') {
            setDocumentTypeArray([
              {
                label: 'SIMPLIFIED_TAX_INVOICE',
                key: 'SIMPLIFIED_TAX_INVOICE',
              },
              { label: 'TAX_INVOICE', key: 'TAX_INVOICE' },
            ]);
          }
         
        }
      }
    );
  }, [locationID]);

  React.useEffect(() => {
    GetFunction('/contactapi?per_page=-1&&type=customer').then((result) => {
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
      GetFunction('/table?location_id=' + result.data[0]?.id).then((result) => {
        let ordersData = result.data.map((data, i) => {
          return {
            key: i,
            id: data.id,
            value: data.name,
            label: data.name,
          };
        });
        setSelectedTable(ordersData[0]?.id);
        setTableArr(ordersData);
      });
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
        {
          name: 'credit note',
          label: 'Credit Note',
          account_id: null,
        },
      ];
      setLocationID(ordersData[0]?.id);
      setStatus('draft');
      customFields();
      setloadingData(false);
    });
  }, []);

  useEffect(() => {
    GetFunction('/business-location/' + locationID).then((result) => {
      let ordersData = result?.data[0]?.payment_methods?.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.label,
        };
      });
      setPaymentDataArray(ordersData);
    });
  }, [locationID]);

  useEffect(() => {
    GetFunction(
      '/list-sell-return?order_by=asc&per_page=-1&contact_id=' + customerID
    ).then((result) => {
    
      let businessDetails: any = localStorage.getItem('business_details');
      let con = JSON.parse(businessDetails);
      if (result?.data) {
        // Filter and map the data within the if block
        let ordersData = result.data
          .filter((data) => data.payment_status === 'due')
          .map((data, i) => ({
            key: i,
            id: data.id,
            value: Number(data.final_total).toFixed(),
            label:
              data.invoice_no +
              // data.id +
              ' (' +
              con.symbol +
              Number(data.final_total).toFixed() +
              ')',
          }));
        setCreditNotesArray(ordersData);
      }
    });
  }, [customerID]);

  const customFields = () => {
    GetFunction('/business-details').then((result) => {
      if (result?.data) {
        setCustomFiieldsData(result?.data?.custom_labels?.sell);
      }
    });
  };

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

  const { addItemToCart, addPaymentToCart, clearPaymentItemFromCart } =
    useCart();

  const { price } = usePrice({
    amount: total,
  });

  const onAddHandler = (id) => {
    const array = ListDataSearch;
  
    // checked.map((res) => {
      const object = array.find((obj) => obj.id == id);
    
    if (object?.enable_stock == 1) {
      if (object.variation_location_details.length > 0) {
        let variationAvailable = false; // Flag to check if any variation is available for the selected location
        object.variation_location_details.map((inner_res) => {
          if (inner_res && inner_res?.location_id == locationID) {
            variationAvailable = true; // Set the flag to true if at least one variation is found for the selected location
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
        if (!variationAvailable) {
          toast.error(object.name + t('common:out-of-stock'), {
            autoClose: 5000,
          });
        }
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
    GetFunction('/table?location_id=' + e.id).then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });
      setTableArr(ordersData);
    });
  };
  const OnChangeStatus = (e) => {
    setStatus(e.label);
    if (e.label === 'draft') {
      setshowPaymentButton(false);
      resetPaymentCart();
    } else if (e.label === 'final') {
      setshowPaymentButton(true);
    }
  };
  const OnChangeType = (e) => {
    setType(e.label);
  };
  const OnChangeTable = (e) => {
    setSelectedTable(e.id);
  };
  const OnChangeCreditPayment = (e) => {
    setAmountValue(e.value);
    setAmountid(e.id);
  };
  const OnChangePaymentMethod = (e) => {
    setPaymentMethods(e.value);
   

    if (e.value == 'credit_note') {
      setListofCredits(true);
    } else {
      setListofCredits(false);
    }
  };
  const OnChangeShippingStatus = (e) => {
    setShippingStatus(e.name);
  };
  const onChangeAmmount = (e) => {
    setAmountValue(e.target.value);
  };

  const collectPayment = () => {
    if (
      customFiieldsData?.is_custom_field_1_required == 1 &&
      customFieldsData?.custom_field_1?.length == 0
    ) {
      return toast.error(customFiieldsData?.custom_field_1 + ' is Requried');
    } else if (
      customFiieldsData?.is_custom_field_2_required == 1 &&
      customFieldsData?.custom_field_2?.length == 0
    ) {
      return toast.error(customFiieldsData?.custom_field_2 + ' is Requried');
    } else if (
      customFiieldsData?.is_custom_field_3_required == 1 &&
      customFieldsData?.custom_field_3?.length == 0
    ) {
      return toast.error(customFiieldsData?.custom_field_3 + ' is Requried');
    } else if (
      customFiieldsData?.is_custom_field_4_required == 1 &&
      customFieldsData?.custom_field_4?.length == 0
    ) {
      return toast.error(customFiieldsData?.custom_field_4 + ' is Requried');
    }
    setCreatingLoading(true);
    let productDetails = items.map((res) => {
      let qty: any = res.quantity;
      return {
        product_id: res.productId,
        variation_id: res.variationsId,
        quantity: res.quantity,
        unit_price: res.unit_price,
        tax_rate_id: res.product_tax_id,
        note: res.name,
        discount_amount: res.discount,
        discount_type: 'fixed',
        lot_no_line_id: res.lotNumber,
        custom_field:
          res.new_custom_fields == 'null'
            ? null
            : JSON.stringify(res.new_custom_fields),
      };
    });

    let paymentDetails = name.map((res) => {
      return {
        amount: res.amount,
        method: res.name,
        card_type: '',
        note: 'Test notes',
        cn_transaction_id: amountid,
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
          table_id: selectedTable,
          status: status,
          invoice_type: type,
          document_type: documentType,
          auto_push_to_zatca: isAutoPush ? 1 : 0,
          change_return: 0,
          order_source: 'web',
          products: productDetails,
          payments: paymentDetails,
          sale_note: notesChange,
          custom_field_1: customFieldsData?.custom_field_1,
          custom_field_2: customFieldsData?.custom_field_2,
          custom_field_3: customFieldsData?.custom_field_3,
          custom_field_4: customFieldsData?.custom_field_4,
          ...(items[0]?.selling_price
            ? {
                selling_price_group_id:
                  items[0]?.selling_price[0]?.price_group_id,
              }
            : {}),
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
      table_id: selectedTable,
      invoice_type: type,
      document_type: documentType,
      auto_push_to_zatca: isAutoPush ? 1 : 0,
      change_return: 0,
      order_source: 'web',
      products: productDetails,
      payments: paymentDetails,
      sale_note: notesChange,
      custom_field_1: customFieldsData?.custom_field_1,
      custom_field_2: customFieldsData?.custom_field_2,
      custom_field_3: customFieldsData?.custom_field_3,
      custom_field_4: customFieldsData?.custom_field_4,
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
          resetCart();
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
          resetCart();
          router.back();
        }
      });
    }
  };

  let StatusArray = [{ label: 'draft', key: 'Draft' }];
  let TypeArray = [
    { label: 'B2B', key: 'B2B' },
    { label: 'B2C', key: 'B2C' },
  ];

  permissionData?.map((item: any) => {
    if (item.toLocaleLowerCase().includes('create_approve_invoice')) {
      StatusArray.push({ label: 'final', key: 'Final' });
    }
  });

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
    // console.log(obj)
    setPaymentDrawer(false);
    setAmountValue('');
    setListofCredits(false);
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
        note: res.name,
        discount_amount: res.discount,
        discount_type: 'fixed',
        lot_no_line_id: res.lotNumber,
        custom_field: JSON.stringify(res.new_custom_fields),
      };
    });

    let paymentDetails = name.map((res) => {
      return {
        amount: res.amount,
        method: res.name,
        card_type: '',
        note: 'Test notes',
        cn_transaction_id: amountid,
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
          invoice_type: type,
          document_type: documentType,
          auto_push_to_zatca: isAutoPush ? 1 : 0,
          change_return: 0,
          order_source: 'web',
          products: productDetails,
          payments: paymentDetails,
          sale_note: notesChange,
          ...(items[0]?.selling_price
            ? {
                selling_price_group_id:
                  items[0]?.selling_price[0]?.price_group_id,
              }
            : {}),
        },
      ],
    };



    

    if (initialValue.data) {
      let ID = initialValue?.data?.id;
      UpdatingSellFunction('/sell/' + ID, formData.sells[0]).then((result) => {
        if (result?.exception == null) {
          toast.error(
            result[0]?.original?.error?.message ==
              'ERROR: NOT ALLOWED: Mismatch between sold and purchase quantity. Product: manage stock 0 SKU: ds Quantity: 1'
              ? 'Product out of stock'
              : result?.original?.error?.message
          );
          setShreLoading(false);
        }
        if (result?.business_id) {
          let token = result?.invoice_token;
          let obJData = {
            url: site_url + 'invoice/' + token,
          };
          resetPaymentCart();
          ShareOrder(obJData).then((res) => {
            if (res?.short) {
              setCloseDialog(true);
            }
            setShareURL(res?.short + '?wm=0');
            setShreLoading(false);
          });
        }
      });
    } else {
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
            url: site_url + 'invoice/' + token,
          };
          resetPaymentCart();
          ShareOrder(obJData).then((res) => {
            if (res?.short) {
              setCloseDialog(true);
            }
            setShareURL(res?.short + '?wm=0');
            setShreLoading(false);
          });
        }
      });
    }
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
    if (items.length == 0) {
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
    let subtotal = e.target.value * (1 + TaxAmount / 100);
    setSubTotal(subtotal.toFixed(2));
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
  // const handleKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //     onProductAddButton();
  //   }
  // };
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
      name: productNameText,
      note: productNameText,
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
      type: 'CustomProduct',
    };
    addItemToCart(object, 1);
    setCustomProductModal(false);
    setTaxAmount(0);
    setProductNameText('');
  };
  const [taxVal, setTaxVal] = useState<any>('');
  const [taxValID, setTaxValID] = useState<any>('');
  const [incSwitch, setincSwitch] = useState<any>(false);
  const [disSelect, setdisSelect] = useState<any>(true);
  const [TaxAmount, setTaxAmount] = useState<any>(0);
  const [subTotal, setSubTotal] = useState<any>(0);
  const [borderCoolor, setBorderCoolor] = useState<any>(false);
  const [isAutoPush, setIsAutoPush] = useState(false);
  const [DocumentTypeArray, setDocumentTypeArray] = useState<any>([]);

  const onChangeSwitch = () => {
    setincSwitch((value: any) => !value);
  };

  const TaxOnChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    const selectedOption = e.target[selectedIndex];
    const selectedId = Number(selectedOption.id);
    setTaxAmount(e.target.value);
    let value = defaultUnitPrise * (1 + e.target.value / 100);
    setSubTotal(value.toFixed(2));

    setTaxValID(selectedId);
    if (incSwitch) {
      let value = defaultUnitPrise / (1 + e.target.value / 100);
      let val2 = defaultUnitPrise - value;
      setTaxVal(val2);
    } else {
      let value = defaultUnitPrise * (1 + e.target.value / 100);
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
  const OnChangeDocumentType = (e) => {
    setDocumentType(e.label);
  };

  const onAddNewItemClick = () => {
    onAddCustomProductIco();
    setCartItemHeader(true);
    setCardItemDiv(true);
  };
  const handleAutoPush = () => {
    setIsAutoPush(!isAutoPush);
  };

  const onChangeCityLIst = (e) => {
    setCityListPayload(e);
  };

  const onAddCustomProductIco = () => {
    if (productNameText == '') {
      // toast.error('Please enter product name');
      setBorderCoolor(true);
      setTimeout(() => {
        setBorderCoolor(false);
      }, 1000);
    } else {
      if (!!newArr.length) {
      } else {
        onProductAddButton();
        setDefaultUnitPrise('');
        setTaxAmount('');
        setSubTotal('');
        setCardItemDiv(false);
      }
    }
  };

  const onItemmCross = () => {
    setCardItemDiv(false);
    setDefaultUnitPrise('');
    setTaxAmount('');
    setProductNameText('');
    setSubTotal('');
    setNewArr([]);
    if (items.length == 0) {
      setCartItemHeader(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCustomFieldsData({
      ...customFieldsData,
      [name]: value,
    });
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <div className="container m-auto grid gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8">
      <div className=" md:col-span-4 lg:col-span-6">
        <Card className="w-full p-3 !p-5">
          <Label>{t('form:input-label-products')}</Label>
          <div className="flex w-full items-center border-b border-solid border-border-200 border-opacity-75 py-4  text-sm  ">
            {/* <div className="relative mx-4 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
                <Image
                  src={defaulImage}
                  alt="no image"
                  layout="fill"
                  objectFit="contain"
                />
              </div> */}

            {/* <div className="pl-3">
                <input
                  onChange={modalfilterBySearch}
                  className="h-9 w-72 rounded border-2 p-2 pb-3"
                  value={productNameText}
                  onKeyDown={handleKeyDown}
                />
                <div className="dropdown-wrapper ">
                  {newArr.length > 0 ? (
                    <div className="dropdown-list absolute max-h-80 w-72 overflow-y-auto bg-gray-100 ">
                      {newArr?.map((res: any, index: any) => (
                        <div
                          onClick={() => onAddHandler(res.id)}
                          key={index}
                          className="dropdown-item grid cursor-pointer grid-cols-6 gap-4 border-t-2 p-5"
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
              </div> */}

            {/* <span className="mt-5 font-bold text-heading ms-auto">00:00</span>
              <div className="flex pt-5  ms-auto">
                <button
                  onClick={() => setCardItemDiv(false)}
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 -me-2 ms-3 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
                >
                  <span className="sr-only">{t('text-close')}</span>
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div> */}
            <div className="w-full">
              <div className="w-full">
                <table className="w-full divide-y divide-gray-200">
                  {(cardItemDiv || items.length != 0) && (
                    <thead>
                      <tr>
                        <th className=" bg-gray-50 px-3 py-3 text-left text-xs font-medium  tracking-wider text-gray-500">
                          {t('form:input-qty')}
                        </th>
                        <th className=" bg-gray-50 px-3 py-3 text-left text-xs font-medium  tracking-wider text-gray-500">
                          {t('form:input-name')}
                        </th>
                        <th className=" bg-gray-50 px-3 py-3 text-left text-xs font-medium  tracking-wider text-gray-500">
                          {t('form:input-unit')}
                        </th>
                        <th className=" bg-gray-50 px-3 py-3 text-left text-xs font-medium  tracking-wider text-gray-500">
                          {t('form:input-tax')}
                        </th>
                        <th className=" bg-gray-50 px-3 py-3 text-left text-xs font-medium  tracking-wider text-gray-500">
                          {t('form:input-total')}
                        </th>
                        {/* <th className=" bg-gray-50 px-3 py-3 text-left text-xs font-medium  tracking-wider text-gray-500">
                          Action
                        </th> */}
                      </tr>
                    </thead>
                  )}

                  {cardItemDiv && (
                    <tbody className="bg-white">
                      <tr>
                        <td className="w-10 whitespace-nowrap px-3 py-4">
                          <div className="flex-shrink-0 pr-1">
                            <Counter
                              value={1}
                              variant="pillVertical"
                              disabled={true}
                              onDecrement={() => console.log('')}
                              onIncrement={() => console.log('')}
                            />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <input
                            onChange={modalfilterBySearch}
                            autoFocus
                            className={`h-9 w-full rounded border-2 p-2 pb-3 focus:border-black focus:outline-black ${
                              borderCoolor ? 'border-red-500' : ''
                            }`}
                            // className="h-9 w-48 rounded border-2 p-2 pb-3 borderCoolor"
                            value={productNameText}
                          />
                          <div className="dropdown-wrapper ">
                            {newArr.length > 0 ? (
                              <div
                                // style={{ width: 570 }}
                                className="dropdown-list absolute max-h-80 w-[570px] overflow-y-auto bg-gray-100 "
                              >
                                {newArr?.map((res: any, index: any) => (
                                  <div
                                    onClick={() => onAddHandler(res.id)}
                                    key={index}
                                    className="dropdown-item grid cursor-pointer grid-cols-6 gap-4 border-t-2 p-5"
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
                        </td>
                        <td className="w-20 whitespace-nowrap px-3 py-4">
                          <input
                            className="h-9 w-20  rounded border-2 p-2 pb-3 pt-3 text-center focus:outline-black"
                            onChange={onChangeUnitPrise}
                            value={defaultUnitPrise}
                            type="number"
                          />
                        </td>
                        <td className="w-20 whitespace-nowrap px-3 py-4">
                          <select
                            onChange={TaxOnChange}
                            value={TaxAmount}
                            className=" h-9 w-20 rounded border-2 focus:outline-black "
                          >
                            <option></option>
                            {taxArray.map((res, index) => (
                              <option id={res.id} value={res.value} key={index}>
                                {res.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 pt-12">
                          <span className="pl-3">{subTotal}</span>
                          <div className="flex pt-3">
                            <button
                              onClick={onItemmCross}
                              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
                            >
                              <span className="sr-only">{t('text-close')}</span>
                              <CloseIcon className="h-3 w-3" />
                            </button>
                            <button
                              onClick={onAddCustomProductIco}
                              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
                            >
                              <span className="sr-only">{t('text-close')}</span>
                              <TiTick className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  )}
                  {items?.map((item) => (
                    <CartItem
                      item={item}
                      key={item.id}
                      onCrossIcoDecPress={() => onDecFun(item.price)}
                      onCrossIcoIncPress={() => onIncFun(item.price)}
                    />
                  ))}
                </table>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div
              onClick={onAddNewItemClick}
              className="border-bllack mt-3 mr-2 w-full cursor-pointer rounded border-2 border-dashed border-black bg-slate-50 p-3 text-center text-sm hover:border-solid hover:border-black hover:text-black"
            >
              {t('form:invoices')}
              {/* Add new invoice item  */}
            </div>
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
        {showPaymentButton &&  name?.length>0 &&(
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
        )}
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
        </Card>
        <Card className="mt-5">
          <TextArea
            onChange={onNotesChange}
            value={notesChange}
            label={t('form:form-notes')}
            name={'Notes'}
          />
        </Card>
      </div>

      <div className=" md:col-span-1 lg:col-span-2">
        {customFiieldsData?.custom_field_1 == null &&
        customFiieldsData?.custom_field_2 == null &&
        customFiieldsData?.custom_field_3 == null &&
        customFiieldsData?.custom_field_4 == null ? (
          ''
        ) : (
          <Card className="mb-4 w-full">
            {customFiieldsData.custom_field_1 != null && (
              <div>
                <Label>
                  {customFiieldsData.custom_field_1}
                  {customFiieldsData?.is_custom_field_1_required && '*'}
                </Label>
                <Input
                  name="custom_field_1"
                  value={customFieldsData.custom_field_1}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {customFiieldsData.custom_field_2 != null && (
              <div className="mt-4">
                <Label>
                  {customFiieldsData.custom_field_2}
                  {customFiieldsData?.is_custom_field_2_required && '*'}
                </Label>
                <Input
                  name="custom_field_2"
                  value={customFieldsData.custom_field_2}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {customFiieldsData.custom_field_3 != null && (
              <div className="mt-4">
                <Label>
                  {customFiieldsData.custom_field_3}
                  {customFiieldsData?.is_custom_field_3_required && '*'}
                </Label>
                <Input
                  name="custom_field_3"
                  value={customFieldsData.custom_field_3}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {customFiieldsData.custom_field_4 != null && (
              <div className="mt-4">
                <Label>
                  {customFiieldsData.custom_field_4}
                  {customFiieldsData?.is_custom_field_4_required && '*'}
                </Label>

                <Input
                  name="custom_field_4"
                  value={customFieldsData.custom_field_4}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </Card>
        )}

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
        {/* {
          <Card className="mt-4 w-full">
            <Label>{t('form:input-label-type')}</Label>
            <Select
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.key}
              styles={selectStyles}
              options={TypeArray}
              onChange={OnChangeType}
              defaultValue={TypeArray[0]}
            />
          </Card>
        } */}
        {enableEinvoice && (
          <>
            <Card className="mt-4 w-full">
              <Label>{t('form:input-label-auto-push-zatca')}</Label>
              <Switch
                checked={isAutoPush}
                onChange={handleAutoPush}
                className={`${
                  isAutoPush ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                dir="ltr"
              >
                <span className="sr-only">Enable </span>
                <span
                  className={`${
                    isAutoPush ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                />
              </Switch>
            </Card>
            <Card className="mt-4 w-full">
              <Label>{t('form:input-label-document-type')}</Label>
              <Select
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.key}
                styles={selectStyles}
                options={DocumentTypeArray}
                onChange={OnChangeDocumentType}
                // defaultValue={DocumentTypeArray[0]}
              />
            </Card>
          </>
        )}

        {permissionData?.map((item: any, i: any) => {
          if (item.toLocaleLowerCase().includes('table.view')) {
            return (
              <Card key={i} className="mt-4 w-full">
                <Label>{t('Table')}</Label>
                <Select
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.key}
                  styles={selectStyles}
                  options={tableArr}
                  onChange={OnChangeTable}
                />
              </Card>
            );
          }
        })}

        {items?.length != 0 && (
          <Card className="mt-4  w-full justify-end">
            {showPaymentButton ? (
              <Button className="w-full" onClick={onClickAddPayment}>
                {t('form:button-label-add-payment')}
              </Button>
            ) : (
              ''
            )}
            <Button className="mt-3 w-full !px-3" onClick={onClickAddShipping}>
              {t('Add Shipping Detail')}
            </Button>
          </Card>
        )}
        {items?.length != 0 && (
          <Card className="mt-4 w-full">
            <div className="">
              <Button
                className="mr-2 w-full"
                loading={creatingLoading}
                onClick={collectPayment}
              >
                {t('form:button-label-save')}
              </Button>

              <Button
                loading={shreLoading}
                style={{
                  backgroundColor: 'transparent',
                  color: 'black',
                  border: '2px solid black',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  transition: 'color 0.3s, border-color 0.3s',
                }}
                className="mr-3 mt-3 w-full"
                onClick={onShareClick}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = '#333';
                  e.currentTarget.style.backgroundColor = 'black';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'black';
                  e.currentTarget.style.borderColor = 'black';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                {t('Payment link')}
              </Button>
            </div>
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
                    value={amountValue}
                    onChange={onChangeAmmount}
                    disabled={paymentMethods === 'credit_note' ? true : false}
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
               

                {listofCredits && (
                  <div className="mt-3">
                    <Label>{t('Select Credit note')}</Label>
                    <Select
                      styles={selectStyles}
                      options={creditNotesArray}
                      onChange={OnChangeCreditPayment}
                    />
                  </div>
                )}
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
        {/* <Drawer
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
        </Drawer> */}
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
