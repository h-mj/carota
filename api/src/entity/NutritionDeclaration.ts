import { Column } from "typeorm";

import { NutritionDeclarationData } from "../../types";

/**
 * Class that holds nutrition information of some product.
 */
export class NutritionDeclaration {
  /**
   * Amount of energy in kilocalories.
   */
  @Column("float4")
  public energy!: number;

  /**
   * Amount of fat in grams.
   */
  @Column("float4")
  public fat!: number;

  /**
   * Amount of saturates in grams.
   */
  @Column("float4", { nullable: true })
  public saturates!: number | null;

  /**
   * Amount of mono-unsaturates in grams.
   */
  @Column("float4", { nullable: true })
  public monoUnsaturates!: number | null;

  /**
   * Amount of polyunsaturates in grams.
   */
  @Column("float4", { nullable: true })
  public polyunsaturates!: number | null;

  /**
   * Amount of carbohydrate in grams.
   */
  @Column("float4")
  public carbohydrate!: number;

  /**
   * Amount of sugars in grams.
   */
  @Column("float4", { nullable: true })
  public sugars!: number | null;

  /**
   * Amount of polyols in grams.
   */
  @Column("float4", { nullable: true })
  public polyols!: number | null;

  /**
   * Amount of starch in grams.
   */
  @Column("float4", { nullable: true })
  public starch!: number | null;

  /**
   * Amount of fibre in grams.
   */
  @Column("float4", { nullable: true })
  public fibre!: number | null;

  /**
   * Amount of protein in grams.
   */
  @Column("float4")
  public protein!: number;

  /**
   * Amount of salt in grams.
   */
  @Column("float4", { nullable: true })
  public salt!: number | null;

  /**
   * Creates `NutritionDeclarationData` type object from this instance.
   */
  public toData = (): NutritionDeclarationData => ({
    energy: this.energy,
    fat: this.fat,
    saturates: this.saturates || undefined,
    monoUnsaturates: this.monoUnsaturates || undefined,
    polyunsaturates: this.polyunsaturates || undefined,
    carbohydrate: this.carbohydrate,
    sugars: this.sugars || undefined,
    polyols: this.polyols || undefined,
    starch: this.starch || undefined,
    fibre: this.fibre || undefined,
    protein: this.protein,
    salt: this.salt || undefined
  });
}
