import type { EnumOptionDto } from '../../common/dto/enum-option.dto.js';

export enum ProductCategoryEnum {
  Equipment = 1,
  Apparel = 2,
  Footwear = 3,
}

/** Texts and the `{ id, value }` list the forms need (`GET product/getParams`). */
export class ProductCategoryEnumHelper {
  private static readonly texts: Record<ProductCategoryEnum, string> = {
    [ProductCategoryEnum.Equipment]: 'Equipment',
    [ProductCategoryEnum.Apparel]: 'Apparel',
    [ProductCategoryEnum.Footwear]: 'Footwear',
  };

  public static GetText(value: ProductCategoryEnum): string {
    return this.texts[value];
  }

  public static GetList(): EnumOptionDto[] {
    return Object.entries(this.texts).map(([id, value]) => ({
      id: Number(id),
      value,
    }));
  }
}
