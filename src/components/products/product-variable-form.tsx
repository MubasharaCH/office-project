import Input from '@/components/ui/input';
import { useFieldArray, useFormContext, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import Title from '@/components/ui/title';
import Checkbox from '@/components/ui/checkbox/checkbox';
import SelectInput from '@/components/ui/select-input';
import React, { useEffect, useState } from 'react';
import { Product } from '@/types';
import { useTranslation } from 'next-i18next';
import { useAttributesQuery } from '@/data/attributes';
import FileInput from '@/components/ui/file-input';
import ValidationError from '@/components/ui/form-validation-error';
import Select from 'react-select';
import { selectStyles } from '../ui/select/select.styles';
import {
  getCartesianProduct,
  filterAttributes,
  getCartesianOption,
  getSelectedCartesianProduct,
} from './form-utils';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import { Switch } from '@headlessui/react';
import { RxCross1 } from 'react-icons/rx';
import Modal from '../ui/modal/modal';
import { DashboardGetFun } from '@/services/Service';
import { AiFillDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { GetFunction } from '@/services/Service';
import { useCallback } from 'react';

type IProps = {
  initialValues?: Product | null | any;
  shopId: string | undefined;
  setImage: any;
  setStatus: any;
  taxValue: any;
  setTaxValues: any;
  setExcValues: any;
  excValues: any;
  taxValues: any;
};

export default function ProductVariableForm({
  shopId,
  initialValues,
  setImage,
  setStatus,
  taxValue,
  setTaxValues,
  setExcValues,
  excValues,
  taxValues,
}: IProps) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { attributes, loading } = useAttributesQuery({
    shop_id: '',
    language: '',
  });
  const [product_variations, setVariation] = useState<any>([]);
  const [editId, setEditId] = useState<any>();
  const [imageFile, setImageFile] = useState<any>([]);
  const [imageIndxes, setImageIndex] = useState<any>();
  const [path, setPath] = useState<any>();
  const [imgArr, setImageArr] = useState<any>();
  const [images, setImages] = useState<any>([]);
  const [value, setValues] = React.useState<any>(false);
  const [variationDataArray, setVariationDataArray] = useState<any>([]);
  const [checkedVariation, setCheckedVariation] = useState<any>([]);
  const [inputValues, setInputValues] = useState({});
  const [excInputValues, setExcInputValues] = useState({});
  const [imagePath, setImagePath] = useState<any>({});
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState([]);
  const [selectedOptionList, setSlectedOptionList] = useState([]);
  const disabledOptions: boolean[] = [];

  let newImages: any = [];
  let newVariation: any = [];

  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  // This field array will keep all the attribute dropdown fields
  const { fields, append, remove } = useFieldArray({
    shouldUnregister: true,
    control,
    name: 'variations',
  });

  const variations = watch('variations');
  useEffect(() => {
    append(initialValues?.product_variations);
    if (initialValues?.id) {
      setEditId(initialValues?.id);
    }
    if (initialValues?.variation_options) {
      let statusData = initialValues?.variation_options.map((data, i) => {
        if (data?.status != 0) {
          newVariation[i] = i;
          setVariationDataArray(newVariation);
          setStatus(newVariation);
        }
      });
    }
  }, []);

  useEffect(() => {
    setloadingData(true);

    if (initialValues?.variation_options) {
      const newExcInputValues = {};
      const newInputValues = {};
      const newTaxValues = {};
      const newExcTaxValues = {};
      initialValues?.variation_options.forEach((data, i) => {
        if (data.id) {
          newExcInputValues[i] = parseFloat(data.default_sell_price).toFixed(2);
          newInputValues[i] = parseFloat(data.sell_price_inc_tax).toFixed(2);
          newTaxValues[i] = data.sell_price_inc_tax;
          newExcTaxValues[i] = data.default_sell_price;
        }
      });

      setExcInputValues({ ...excInputValues, ...newExcInputValues });
      setInputValues({ ...inputValues, ...newInputValues });
      setTaxValues({ ...taxValues, ...newTaxValues });
      setExcValues({ ...excValues, ...newExcTaxValues });
      // const newExc = {...excInputValues};
      //  initialValues?.variation_options.map((data, i) => {
      //    // const newData = [...variationDataArray];
      //    if(data.id){
      //     console.log('ii',data.id);
      //     setExcInputValues({
      //       ...excInputValues,
      //       [i]: data.default_sell_price
      //     });
      //   }
      //   // setInputValues({
      //   //   ...inputValues,
      //   //   [i]: parseFloat(data.sell_price_inc_tax).toFixed(2),
      //   // });
      //   // setTaxValues({
      //   //   ...inputValues,
      //   //   [i]: data.sell_price_inc_tax,
      //   // });
      //   // setExcValues({
      //   //   ...excInputValues,
      //   //   [i]: data.default_sell_price,
      //   // });

      // });
      // setloadingData(true);
    }
  }, []);
  // console.log('excinput',excInputValues);

  const onChange = (checked, event) => {
    const value = event;
    if (checked) {
      setVariationDataArray([...variationDataArray, value]);
      setStatus([...variationDataArray, value]);
    } else {
      const filteredList = variationDataArray.filter((item) => item !== value);
      setVariationDataArray(filteredList);
      setStatus(filteredList);
    }
  };
  // console.log('variation-data-arrat',variationDataArray);

  // console.log('chekcd',variationDataArray);

  useEffect(() => {
    setImageFile('');
    if (imageFile) {
      imageFile.map((res) => {
        const newImages = [...images];
        newImages[imageIndxes] = res;
        setImages(newImages);
        setImage(newImages);
        setImagePath({
          ...imagePath,
          [imageIndxes]: URL.createObjectURL(res),
        });
        // //  const newImages = [...images];
        //  newImages[imageIndxes] = (current) => [...current, res];
        //  console.log('images',newImages);
        // setImageArr((current) => [...current, res]);

        // if (imgArr != undefined) {
        //   setImageArr((current) => [...current, res]);
        // } else {
        //   setImageArr([res]);
        // }

        // if (path != undefined) {
        //   setPath((current) => [...current, URL.createObjectURL(res)]);
        // } else {
        //   setPath([URL.createObjectURL(res)]);
        // }
      });
    }
  }, [imageFile]);

  const handleFileIndex = (e, index) => {
    setImageIndex(index);
  };
  const handleChange = (e, index, type) => {
    const { name, value } = e.target;

    if (type == 'exc') {
      setExcInputValues({
        ...excInputValues,
        [index]: value,
      });
      setInputValues({
        ...inputValues,
        [index]: taxValue
          ? Math.round(value * (1 + taxValue / 100)).toFixed(2)
          : value,
      });
      setTaxValues({
        ...taxValues,
        [index]: taxValue ? value * (1 + taxValue / 100) : value,
      });

      setExcValues({
        ...excValues,
        [index]: value,
      });
    } else if (type == 'inc') {
      setInputValues({
        ...inputValues,
        [index]: value,
      });
      setExcInputValues({
        ...excInputValues,
        [index]: taxValue
          ? Math.round(value / (1 + taxValue / 100)).toFixed(2)
          : value,
      });

      setExcValues({
        ...excValues,
        [index]: taxValue ? value / (1 + taxValue / 100) : value,
      });
      setTaxValues({
        ...taxValues,
        [index]: value,
      });
    }
  };

  const cartesianOption = editId
    ? getCartesianOption(
        getValues('variations'),
        initialValues?.product_variations,
        editId
      )
    : getCartesianOption(getValues('variations'), '', '');
  const cartesianProduct = editId
    ? getSelectedCartesianProduct(getValues('variations'), initialValues)
    : getCartesianProduct(getValues('variations'));

  useEffect(() => {
    console.log(cartesianProduct, 'cartesianProduct');

    if (cartesianProduct && initialValues?.id) {
      let newVariation: any = [];
      let defaultSwitchValues = cartesianProduct.map(
        (fieldAttributeValue, index) => {
          if (fieldAttributeValue.length != undefined) {
            fieldAttributeValue?.forEach((innerValue, innerKey) => {
              newVariation[innerKey] = innerValue.name;
            });
          } else {
            newVariation[index] = fieldAttributeValue.name;
          }
        }
      );
      setCheckedVariation(newVariation);
    }
  }, []);

  useEffect(() => {
    GetFunction('/get_variations').then((result) => {
      setListData(result);
    });
  }, [editId]);
  useEffect(() => {
    if (editId) {
      let selected_options: any = [];
      fields.forEach((field: any, index) => {
        if (field.variations) {
          field.variations.map((innerField, innerIndex) => {
            selected_options[innerIndex] = innerField.options;
          });
        }
      });
      setSlectedOptionList(selected_options);
      fields.forEach((field: any, index) => {
        const matchingItem: any = ListData.find(
          (item: any) => item.name === field.name
        );
        if (matchingItem) {
          const { id, values } = matchingItem;

          // Filter out the values that are already selected
          const unmatchedValues = values.filter((value: any) => {
            return !selected_options.some(
              (selected: any) => selected[field.name] === value.name
            );
          });

          // Set the id and unmatched values to the attribute field
          setValue(
            `variations.${index}.attribute`,
            editId
              ? { name: field.name, id, values: unmatchedValues }
              : field.name
          );

          // Check if the currently selected value is already in the selected_options list
          const currentValue = getValues(`variations.${index}.value`);
          const shouldPreventSelect = selected_options.some(
            (selected: any) => selected[field.name] === currentValue
          );

          if (shouldPreventSelect) {
            // Retrieve the current value of the control
            const updatedValue = unmatchedValues.filter(
              (value: any) => value.name !== currentValue
            );

            // Update the value in the control using setValue
            setValue(`variations.${index}.value`, updatedValue);
          }
        } else {
          // If the matching item is not found, set the default value
          setValue(
            `variations.${index}.attribute`,
            editId ? { name: field.name } : field.name
          );
        }

        let name: any = field.name;
        const matched: any = [];
        if (matchingItem) {
          selected_options.forEach((key) => {
            const matchedValue = matchingItem.values.find(
              (value) => value.name == key[name]
            );
            if (matchedValue && !matched.includes(matchedValue)) {
              matched.push(matchedValue);
            }
          });
        }

        setValue(`variations.${index}.value`, matched);
        // setValue(`variations.${index}.values`, matched);
      });
    }
  }, [fields, variations, editId, checkedVariation, setValue, ListData]);

  const handleFileUpload = async (e, index) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      // update the images state with the new image at the specific index
      // setImages(prevImages => {
      //   prevImages[index] = response.data.url;
      //   return [...prevImages];
      // });
    } catch (error) {
      console.error(error);
    }
  };
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleImgLoader, setDeleImgLoader] = useState(false);
  const [deleteImgId, setDeleteImgId] = useState('');
  const [deleteImgIndex, setDeleteImgIndex] = useState('');
  const onRemooveImage = (e, id, index) => {
    e.preventDefault();
    setDeleteModal(true);
    setDeleteImgId(id);
    setDeleteImgIndex(index);
  };
  const onRemooveImageAddCase = (index) => {
    // Create a copy of the current imagePath state
    const updatedImagePath = { ...imagePath };
    // Remove the image source at the specified index
    delete updatedImagePath[index];
    // Update the state with the modified imagePath
    setImagePath(updatedImagePath);
  };
  const onConfirmDelet = () => {
    // console.log(deleteImgId);
    setDeleImgLoader(true);
    DashboardGetFun('/product/delete/' + deleteImgId).then((result) => {
      if (result.success) {
        initialValues.variation_options[
          deleteImgIndex
        ].media = initialValues.variation_options[deleteImgIndex].media.filter(
          (res) => res.id !== deleteImgId
        );
        toast.success(result.message);
        setDeleImgLoader(false);
        setDeleteModal(false);
      } else {
        toast.success(result.message);
        setDeleImgLoader(false);
      }
    });
  };

  // useEffect(() => {
  //   if(editId){
  //     fields.forEach((field, index) => {
  //       console.log('insidefiled',field);
  //       const attributeValue = watch(`variations.${index}.attribute`);
  //       const filteredValues = filterAttributes(attributes, variations, editId, checkedVariation);

  //       // Update the value of the second dropdown directly using setValue
  //       setValue(`variations.${index}.value`, filteredValues[index]?.values);
  //       console.log('fitlered',filteredValues[index]?.values);

  //       // You can also console.log the filtered values to verify
  //     });
  //   }
  // }, [fields, attributes, variations, editId, checkedVariation, setValue]);
  // const handleSelectChange = (index, value) => {
  //   const selectedOptions = Array.isArray(value) ? value : [value];

  //   // Retrieve the current value of the control
  //   const currentValue = getValues(`variations.${index}.value`);

  //   // Filter out the options that are already selected and should not be removed
  //   const filteredOptions = selectedOptions.filter(
  //     (option) => !selectedOptionList.some((selected :any) => selected.itemName === option.itemName && selected.id === option.id)
  //   );
  //   // Combine the filtered options with the current value
  //   const updatedValue = [...filteredOptions, ...currentValue];

  //   // Update the value in the control using setValue
  //   setValue(`variations.${index}.value`, updatedValue);
  // };
  const handleSelectChange = (index, value) => {
    const currentValue = watch(`variations.${index}.value`);
    console.log('removed', value);
    if (editId) {
      if (Array.isArray(value)) {
        // Handle the case where multiple values are selected or removed
        const updatedValue = value.reduce(
          (acc, option) => {
            if (!currentValue.some((item) => item?.id === option?.id)) {
              // Add the option if it doesn't exist
              acc.push(option);
            }
            return acc;
          },
          [...currentValue]
        );

        setValue(`variations.${index}.value`, updatedValue);
      } else if (value) {
        // Handle the case where a single value is selected or removed
        if (!currentValue.some((item) => item?.id === value?.id)) {
          // Add the value if it doesn't exist
          const updatedValue = [...currentValue, value];
          setValue(`variations.${index}.value`, updatedValue);
        } else {
          // Remove the value if it already exists
          const filteredValue = currentValue.filter(
            (item) => item?.id !== value?.id
          );
          setValue(`variations.${index}.value`, filteredValue);
        }
      }
    } else {
      if (value) {
        // Add the value if it doesn't exist in currentValue
        if (value.length > 0) {
          setValue(`variations.${index}.value`, value);
        } else {
          // Remove the value if it already exists
          const filteredValue = currentValue.filter(
            (item) => item?.id !== value?.id
          );
          setValue(`variations.${index}.value`, filteredValue);
        }
      }
    }
  };

  const handleRemoveValue = (index, removedValue) => {
    const currentValue = watch(`variations.${index}.value`);
    const updatedValue = currentValue.filter(
      (item) => item?.id !== removedValue?.id
    );
    setValue(`variations.${index}.value`, updatedValue);
  };
  const filterOptions = (index) => {
    // const currentValue = watch(`variations.${index}.value`);
    // const updatedValue = currentValue.filter((item) => item?.id !== removedValue?.id);
    // console.log('updatedValue', updatedValue);
    // setValue(`variations.${index}.value`, updatedValue);
  };

  return (
    <div className="my-5 flex flex-wrap sm:my-8">
      <Description
        title={t('form:form-title-variation-product-info')}
        details={`${
          initialValues
            ? t('form:item-description-update')
            : t('form:item-description-choose')
        } ${t('form:form-description-variation-product-info')}`}
        className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
      />
      <Card className="w-full p-0 sm:w-8/12 md:w-2/3 md:p-0">
        <div className="mb-5 border-t border-dashed border-border-200 md:mb-8">
          <Title className="mb-0 mt-8 px-5 text-center text-lg uppercase md:px-8">
            {t('form:form-title-options')}
          </Title>

          {fields != null
            ? fields?.map((field: any, index: number) => {
                return (
                  <>
                    <div
                      key={field.id}
                      className="border-b border-dashed border-border-200 p-5 last:border-0 md:p-8"
                    >
                      <div className="flex items-center justify-between">
                        <Title className="mb-0">
                          {t('variants')} {index + 1}
                        </Title>
                        {initialValues?.id ? (
                          ''
                        ) : (
                          <button
                            onClick={() => remove(index)}
                            type="button"
                            className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none"
                          >
                            {t('form:button-label-remove')}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-fit gap-5">
                        <div className="mt-5">
                          <Label>{t('form:input-label-attribute-name')}*</Label>
                          <SelectInput
                            name={`variations.${index}.attribute`}
                            control={control}
                            defaultValue={
                              editId
                                ? { name: field.name, value: 'green' }
                                : field.name
                            } // Provide the static value here
                            getOptionLabel={(option: any) => option.name}
                            getOptionValue={(option: any) => option.id}
                            options={
                              filterAttributes(
                                attributes,
                                variations,
                                editId,
                                checkedVariation
                              )!
                            }
                            isLoading={loading}
                            disabled={editId ? true : false}
                          />
                        </div>

                        <div className="col-span-2 mt-5">
                          <Label>
                            {t('form:input-label-attribute-value')}*
                          </Label>
                          <Select
                            isMulti
                            name={`variations.${index}.value`}
                            styles={selectStyles}
                            // control={control}
                            defaultValue={field.value}
                            getOptionLabel={(option: any) => option.name}
                            getOptionValue={(option: any) => option.id}
                            options={
                              watch(`variations.${index}.attribute`)?.values
                            }
                            isClearable={false}
                            onChange={(
                              selectedOptions,
                              { action, removedValue }
                            ) => {
                              if (action === 'remove-value' && removedValue) {
                                handleSelectChange(index, removedValue); // Send the value of the removed item
                              } else {
                                handleSelectChange(index, selectedOptions);
                              }
                            }}
                          />
                          <div
                            style={{
                              display: 'flex',
                              marginRight: '10px',
                              marginTop: '10px',
                            }}
                          >
                            {watch(`variations.${index}.value`)?.map(
                              (selectedValue, selectedIndex) => (
                                <span
                                  key={selectedIndex}
                                  style={{
                                    marginRight: '5px',
                                    backgroundColor: 'lightgray',
                                    padding: '5px',
                                  }}
                                >
                                  {selectedValue?.name}
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        <div></div>
                      </div>
                    </div>
                  </>
                  // <>
                  //   {initialValues?.id ? (
                  //     ''
                  //   ) : (

                  //   )}
                  // </>
                );
              })
            : ''}
          {initialValues?.id ? (
            ''
          ) : (
            <div className="px-5 md:px-8">
              <Button
                disabled={fields.length === attributes?.length}
                onClick={(e: any) => {
                  e.preventDefault();
                  append({ attribute: '', value: [] });
                }}
                type="button"
              >
                {t('form:button-label-add-option')}
              </Button>
            </div>
          )}

          {/* Preview generation section start */}
          {!!cartesianProduct?.length && (
            <div className="mt-5 border-t border-dashed border-border-200 pt-5 md:mt-8 md:pt-8">
              <Title className="mb-0 px-5 text-center text-lg uppercase md:px-8">
                {cartesianProduct?.length} {t('form:total-variation-added')}
              </Title>
              {cartesianProduct.map(
                (fieldAttributeValue: any, index: number) => {
                  // console.log('field',fieldAttributeValue)

                  return (
                    <div
                      key={`fieldAttributeValues-${index}`}
                      className="mb-5 mt-5 border-b border-dashed border-border-200 p-5 last:mb-8 last:border-0 md:p-8 md:last:pb-0"
                    >
                      {initialValues?.id ? (
                        <Switch
                          checked={
                            variationDataArray.includes(index)
                              ? true
                              : initialValues?.variation_options?.[index]
                                  ?.sub_sku
                              ? false
                              : true
                          }
                          {...register(`variation_options.${index}.status`)}
                          onChange={(checked) => onChange(checked, index)}
                          style={{ float: 'right' }}
                          className={`${
                            variationDataArray.includes(index)
                              ? 'bg-accent'
                              : initialValues?.variation_options?.[index]
                                  ?.sub_sku
                              ? 'bg-gray-300'
                              : 'bg-accent'
                          } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                          dir="ltr"
                        >
                          <span className="sr-only">Enable </span>
                          <span
                            className={`${
                              variationDataArray.includes(index)
                                ? 'translate-x-6'
                                : initialValues?.variation_options?.[index]
                                    ?.sub_sku
                                ? 'translate-x-1'
                                : 'translate-x-6'
                            } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                          />
                        </Switch>
                      ) : (
                        <Switch
                          checked={true}
                          {...register(`variation_options.${index}.status`)}
                          onChange={(checked) => onChange(checked, index)}
                          style={{ float: 'right' }}
                          className={`${'bg-accent'} relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                          dir="ltr"
                          defaultChecked={true}
                        >
                          <span className="sr-only">Enable </span>
                          <span
                            className={`${'translate-x-6'} inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                          />
                        </Switch>
                      )}

                      <Title className="mb-8 !text-lg">
                        {t('form:form-title-variant')}:{' '}
                        <span className="font-normal text-blue-600">
                          {Array.isArray(fieldAttributeValue)
                            ? fieldAttributeValue?.map((a) => a.value).join('/')
                            : fieldAttributeValue.value}
                        </span>
                      </Title>
                      <TitleAndOptionsInput
                        register={register}
                        setValue={setValue}
                        index={index}
                        fieldAttributeValue={fieldAttributeValue}
                      />

                      <input
                        {...register(`variation_options.${index}.id`)}
                        type="hidden"
                        // value={initialValues?.variation_options[index]['id']}
                      />
                      {index == 0 ? (
                        <input
                          {...register('template')}
                          type="hidden"
                          value={
                            Array.isArray(cartesianOption)
                              ? cartesianOption
                              : cartesianOption
                          }
                        />
                      ) : (
                        ''
                      )}

                      <input
                        {...register(`variation_options.${index}.name`)}
                        value={
                          Array.isArray(fieldAttributeValue)
                            ? fieldAttributeValue?.map((a) => a.value).join('/')
                            : fieldAttributeValue.value
                        }
                        type="hidden"
                      />

                      <div className="grid grid-cols-2 gap-5">
                        <Input
                          label={`${t('Exec Price')}*`}
                          //  value={initialValues?.variation_options[index]['default_sell_price']}
                          type="number"
                          value={excInputValues?.[index]}
                          {...register(
                            `variation_options.${index}.default_sell_price`
                          )}
                          error={t(
                            errors.variation_options?.[index]
                              ?.default_sell_price?.message
                          )}
                          variant="outline"
                          className="mb-5"
                          onChange={(e) => handleChange(e, index, 'exc')}
                        />
                        <Input
                          label={t('Inc Price')}
                          type="number"
                          id={
                            'variation_options' + index + 'sell_price_inc_tax'
                          }
                          // name = "variation_options.0.sell_price_inc_tax"
                          //  value={initialValues?.variation_options[index]['sell_price_inc_tax']}
                          value={inputValues?.[index]}
                          {...register(
                            `variation_options.${index}.sell_price_inc_tax`
                          )}
                          error={t(
                            errors.variation_options?.[index]
                              ?.sell_price_inc_tax?.message
                          )}
                          onChange={(e) => handleChange(e, index, 'inc')}
                          variant="outline"
                          className="mb-5"
                        />

                        <input
                          {...register(`variation_options.${index}.sub_sku`)}
                          // value={initialValues?.variation_options[index]['sub_sku']}
                          type="hidden"
                        />

                        <>
                          <Input
                            label={`${t('form:input-label-sku')}`}
                            value={
                              initialValues?.variation_options?.[index]?.sub_sku
                            }
                            disabled={
                              initialValues?.id &&
                              initialValues?.variation_options?.[index]?.sub_sku
                                ? true
                                : false
                            }
                            note={
                              Config.enableMultiLang
                                ? `${t('form:input-note-multilang-sku')}`
                                : ''
                            }
                            {...register(`variation_options.${index}.sub_sku`)}
                            error={t(
                              errors.variation_options?.[index]?.sku?.message
                            )}
                            variant="outline"
                            className="mb-5"
                          />
                        </>
                      </div>
                      <div onClick={(e) => handleFileIndex(e, index)}>
                        <Label>{t('form:input-label-image')}</Label>
                        {/* <input type="file" onChange={e => handleFileUpload(e, index)} /> */}
                        <FileInput
                          setImageFile={setImageFile}
                          name={`variation_options.${index}.image`}
                          control={control}
                          multiple={true}
                        />
                        {JSON.stringify(imagePath) !== '{}' &&
                        imagePath[index] ? (
                          <div className="mt-6 flex">
                            <img
                              style={{
                                paddingTop: 5,
                                marginLeft: 10,
                                width: '50px',
                                height: '50px',
                              }}
                              src={imagePath[index]}
                              alt="cate-image"
                            />
                            <div className="h-5 rounded-full bg-slate-200 p-1">
                              <RxCross1
                                onClick={() => onRemooveImageAddCase(index)}
                                className=" flex h-3 w-3 cursor-pointer  justify-end"
                              />
                            </div>
                          </div>
                        ) : (
                          ''
                        )}

                        {initialValues?.variation_options?.[index]?.media &&
                        imagePath[index] == undefined
                          ? initialValues?.variation_options?.[
                              index
                            ]?.media.map((res, inner) => (
                              <div className="mt-6 flex" key={inner}>
                                <img
                                  key={inner}
                                  style={{
                                    paddingTop: 5,
                                    marginLeft: 10,
                                    width: '50px',
                                    height: '50px',
                                  }}
                                  src={res.display_url}
                                  alt="cate-image"
                                />
                                <div className="h-5 rounded-full bg-slate-200 p-1">
                                  <RxCross1
                                    onClick={(e) =>
                                      onRemooveImage(e, res.id, index)
                                    }
                                    className=" flex h-3 w-3 cursor-pointer  justify-end"
                                  />
                                </div>
                              </div>
                            ))
                          : ''}
                        {/* <div className="flex">
                  {path &&
                    path.map((res, indexs) => (
                    <>
                     {indexs == index ? (

                          <img
                          key={indexs}
                          style={{
                            padding: 10,
                            width: '50px',
                            height: '50px',
                            marginTop: '1rem',
                          }}
                          src={res}
                          alt="cate-image"
                          />
                          ):''
                          }
                    </>
                    

                    ))}
          </div> */}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </Card>
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(true)}
        style={{ width: '45%' }}
      >
        <Card className="" style={{ width: 400 }}>
          <div className="flex">
            <AiFillDelete
              color="red"
              width={10}
              height={10}
              className="h-8 w-8"
            />
            <Label className="pt-2 text-lg">
              Are you sure you want to delete
            </Label>
          </div>

          <div className="mt-10 flex justify-end">
            <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button
              loading={deleImgLoader}
              className="ml-5"
              onClick={onConfirmDelet}
            >
              Yes
            </Button>
          </div>
        </Card>
      </Modal>
    </div>
  );
}

export const TitleAndOptionsInput = ({
  fieldAttributeValue,
  index,
  setValue,
  register,
}: any) => {
  const title = Array.isArray(fieldAttributeValue)
    ? fieldAttributeValue?.map((a) => a.value).join('/')
    : fieldAttributeValue.value;
  const options = Array.isArray(fieldAttributeValue)
    ? JSON.stringify(fieldAttributeValue)
    : JSON.stringify([fieldAttributeValue]);
  // console.log('fieldoptions', fieldAttributeValue);

  useEffect(() => {
    setValue(`variation_options.${index}.name`, title);
    setValue(`variation_options.${index}.options`, options);
  }, [fieldAttributeValue]);

  return (
    <>
      <input {...register(`variation_options.${index}.name`)} type="hidden" />
      <input
        {...register(`variation_options.${index}.options`)}
        type="hidden"
      />
    </>
  );
};
