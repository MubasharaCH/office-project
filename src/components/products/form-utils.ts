import {
  ProductType,
  Product,
  ProductStatus,
  CreateProduct,
  Type,
  Author,
  Manufacturer,
  Category,
  Tag,
  AttachmentInput,
  VariationOption,
  Variation,
} from '@/types';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import sum from 'lodash/sum';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { omitTypename } from '@/utils/omit-typename';
import { cartesian } from '@/utils/cartesian';
import { object } from 'yup';

export type ProductFormValues = Omit<
  CreateProduct,
  | 'author_id'
  | 'type_id'
  | 'manufacturer_id'
  | 'shop_id'
  | 'categories'
  | 'category_id'
  | 'tags'
  | 'digital_file'
> & {
  id: any;
  name: any;
  arabic_name: any;
  product_type: ProductTypeOption;
  category_id: any;
  brand_id: any;
  sku: any;
  unit_id: any;
  single_dpp: any;
  single_dpp_inc_tax: any;
  type: any;
  enable_stock: boolean;
  barcode_type: any;
  taxType: any;
  tax_rate_id: any;
  qty_available: any;
  business_location_id: any;
  not_for_selling: any;
  product_description: any;
  des: any;
  ExecPrice: any;
  IncPrice: any;
  QName: any;
  alertQName: any;
  enable_sr_no: any;
  alert_quantity: any;

  author: Pick<Author, 'id' | 'name'>;
  manufacturer: Pick<Manufacturer, 'id' | 'name'>;
  categories: Pick<Category, 'id' | 'name'>[];
  tags: Pick<Tag, 'id' | 'name'>[];
  digital_file_input: AttachmentInput;
  is_digital: boolean;
  slug: string;
  template: any;
};

export type ProductTypeOption = {
  value: ProductType;
  name: string;
};
export const productTypeOptions: ProductTypeOption[] = Object.entries(
  ProductType
).map(([key, value]) => ({
  name: key,
  value,
}));

export function getFormattedVariations(variations: any) {
  const variationGroup = groupBy(variations, 'attribute.slug');
  return Object.values(variationGroup)?.map((vg) => {
    return {
      attribute: vg?.[0]?.attribute,
      value: vg?.map((v) => ({ id: v.id, value: v.name })),
    };
  });
}

export function processOptions(options: any) {
  try {
    return JSON.parse(options);
  } catch (error) {
    return options;
  }
}

export function calculateMinMaxPrice(variationOptions: any) {
  if (!variationOptions || !variationOptions.length) {
    return {
      min_price: null,
      max_price: null,
    };
  }
  const sortedVariationsByPrice = orderBy(variationOptions, ['price']);
  const sortedVariationsBySalePrice = orderBy(variationOptions, ['sale_price']);
  return {
    min_price:
      sortedVariationsBySalePrice?.[0].sale_price <
      sortedVariationsByPrice?.[0]?.price
        ? sortedVariationsBySalePrice?.[0].sale_price
        : sortedVariationsByPrice?.[0]?.price,
    max_price:
      sortedVariationsByPrice?.[sortedVariationsByPrice?.length - 1]?.price,
  };
}

export function calculateQuantity(variationOptions: any) {
  return sum(
    variationOptions?.map(({ quantity }: { quantity: number }) => quantity)
  );
}

export function getProductDefaultValues(
  product: Product,
  isNewTranslation: boolean = false
) {
  if (!product) {
    return {
      product_type: productTypeOptions[0],
      min_price: 0.0,
      max_price: 0.0,
      categories: [],
      tags: [],
      in_stock: true,
      is_taxable: false,
      image: [],
      product_images: [],
      gallery: [],
      status: ProductStatus.Publish,
      // isVariation: false,
      variations: <any>[],
      variation_options: [],
    };
  }
  const {
    variations,
    variation_options,
    product_type,
    is_digital,
    digital_file,
  } = product;

  return cloneDeep({
    ...product,
    product_type: productTypeOptions.find(
      (option) => product_type === option.value
    ),
    ...(product_type === ProductType.Simple && {
      ...(is_digital && {
        digital_file_input: {
          id: digital_file?.attachment_id,
          thumbnail: digital_file?.url,
          original: digital_file?.url,
        },
      }),
    }),

    // ...(product_type === ProductType.Variable && {
    variations: getFormattedVariations(variations),
    variation_options: variation_options?.map(({ image, ...option }: any) => {
      return {
        ...option,
        ...(!isEmpty(image) && { image: omitTypename(image) }),
        ...(option?.digital_file && {
          digital_file_input: {
            id: option?.digital_file?.attachment_id,
            thumbnail: option?.digital_file?.url,
            original: option?.digital_file?.url,
          },
        }),
      };
    }),
    // }),
    // isVariation: variations?.length && variation_options?.length ? true : false,

    // Remove initial dependent value for new translation
    ...(isNewTranslation && {
      type: null,
      categories: [],
      author_id: null,
      manufacturer_id: null,
      tags: [],
      author: [],
      manufacturer: [],
      variations: [],
      variation_options: [],
      digital_file: '',
      digital_file_input: {},
      ...(product_type === ProductType.Variable && {
        quantity: null,
      }),
    }),
  });
}

export function filterAttributes(
  attributes: any,
  variations: any,
  editId: any = null,
  checkedVariation: any = null
) {
  let res = attributes?.filter((el: any) => {
    if (editId && checkedVariation.includes(el.name)) {
      return !variations?.some((element: any) => {
        return element?.attribute?.name === el?.name;
      });
    } else if (!editId) {
      return !variations?.some((element: any) => {
        return element?.attribute?.name === el?.name;
      });
    }
    return false;
  });
  return res;
}

export function getCartesianProduct(values: any) {
  const formattedValues = values
    ?.map((v: any) =>
      v?.value?.map((a: any) => ({ name: v?.attribute?.name, value: a?.name }))
    )
    .filter((i: any) => i !== undefined);

  if (isEmpty(formattedValues)) return [];
  return cartesian(...formattedValues);
}
export function getSelectedCartesianProduct(values: any, options: any) {
  const attrKeys = Array.isArray(options.options)
    ? Object.keys(arrayToObject(options.options))
    : Object.keys(options.options);
  const opt = options.options;
  const option = Array.isArray(opt) ? arrayToObject(opt) : opt;

  var formattedValue = values
    ?.map((v: any) =>
      v?.value?.map((a: any) => ({ name: v?.attribute?.name, value: a?.name }))
    )
    .filter((i: any) => i !== undefined);

  var formattedValues = attrKeys
    ?.map((v: any, index) =>
      option[v]?.map((a: any) => ({ name: v, value: a }))
    )
    .filter((i: any) => i !== undefined);
  formattedValues = !isEmpty(formattedValue) ? formattedValue : formattedValues;

  if (isEmpty(formattedValues)) return [];

  return cartesian(...formattedValues);
}
export function getCartesianOption(values: any, options: any, editId: any) {
  if (editId) {
    var formattedValues = options
      ?.map((v: any) => v?.variation_template_id)
      .filter((i: any) => i !== undefined);
  } else {
    var formattedValues = values
      ?.map((v: any) => v?.value?.map((a: any) => v?.attribute?.id))
      .filter((i: any) => i !== undefined);
  }

  if (isEmpty(formattedValues)) return [];
  return formattedValues;
}
export function arrayToObject(array) {
  const object = {};

  array.forEach((item) => {
    object[item.name] = item.value;
  });

  return object;
}
export function getProductInputValues(
  values: ProductFormValues,
  initialValues: any,
  stock: any,
  productType: any
) {
  const {
    id,
    name,
    arabic_name,
    category_id,
    brand_id,
    sku,
    unit_id,
    single_dpp,
    single_dpp_inc_tax,
    type,
    enable_stock,
    barcode_type,
    taxType,
    tax_rate_id,
    qty_available,
    business_location_id,
    not_for_selling,
    des,
    enable_sr_no,
    alert_quantity,
    product_images,
    product_type,
    quantity,
    author,
    manufacturer,
    image,
    is_digital,
    categories,
    tags,
    template,
    digital_file_input,
    variation_options,
    variations,
    ...simpleValues
  } = values;
  // const { locale } = useRouter();
  // const router = useRouter();

  return {
    ...simpleValues,
    is_digital,
    type_id: type?.id,
    product_type: product_type?.value,
    id: id,
    // category_id: categories?.key,
    tax_type: taxType?.id,
    enable_stock: stock,
    brand_id: brand_id?.id,
    business_location_id: business_location_id?.id,
    template: template,
    product_description: des,
    // tags: tags.map((tag) => tag?.id),
    product_image: omitTypename<any>(product_images),
    gallery: values.gallery?.map((gi: any) => omitTypename(gi)),

    // ...(product_type?.value === ProductType?.Simple && {
    //   quantity,
    //   ...(is_digital && {
    //     digital_file: {
    //       id: initialValues?.digital_file?.id,
    //       attachment_id: digital_file_input.id,
    //       url: digital_file_input.original,
    //     },
    //   }),
    // }),
    variations: [],
    variation_options: {
      upsert: [],
      delete: initialValues?.variation_options?.map(
        (variation: Variation) => variation?.id
      ),
    },
    ...(productType === 'variable' && {
      quantity: calculateQuantity(variation_options),
      variations: variations?.flatMap(({ value }: any) =>
        value?.map(({ id }: any) => ({ id: id }))
      ),
      variation_options: {
        // @ts-ignore
        upsert: variation_options?.map(
          ({
            options,
            status,
            id,
            digital_file,
            image: variationImage,
            digital_file_input: digital_file_input_,
            ...rest
          }: any) => ({
            ...(id !== '' ? { id } : {}),
            ...omit(rest, '__typename'),
            ...(!isEmpty(variationImage) && {
              image: omitTypename(variationImage),
            }),
            ...(rest?.is_digital && {
              digital_file: {
                id: digital_file?.id,
                attachment_id: digital_file_input_?.id,
                url: digital_file_input_?.original,
              },
            }),
            options: processOptions(options).map(
              ({ name, value }: VariationOption) => ({
                name,
                value,
              })
            ),
            status: initialValues?.id ? '' : 1,
          })
        ),
        delete: initialValues?.variation_options
          ?.map((initialVariationOption: Variation) => {
            // @ts-ignore
            const find = variation_options?.find(
              (variationOption: Variation) =>
                variationOption?.id === initialVariationOption?.id
            );
            if (!find) {
              return initialVariationOption?.id;
            }
          })
          .filter((item?: number) => item !== undefined),
      },
    }),
    ...calculateMinMaxPrice(variation_options),
  };
}
