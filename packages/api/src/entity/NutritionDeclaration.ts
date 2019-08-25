import { Column } from "typeorm";

/**
 * Class that holds nutrition information of some product.
 */
export class NutritionDeclaration {
  /**
   * Quantity of energy in kilocalories.
   */
  @Column("float4")
  public energy!: number;

  /**
   * Quantity of fat in grams.
   */
  @Column("float4")
  public fat!: number;

  /**
   * Quantity of saturates in grams.
   */
  @Column("float4", { nullable: true })
  public saturates!: number | null;

  /**
   * Quantity of mono-unsaturates in grams.
   */
  @Column("float4", { nullable: true })
  public monoUnsaturates!: number | null;

  /**
   * Quantity of polyunsaturates in grams.
   */
  @Column("float4", { nullable: true })
  public polyunsaturates!: number | null;

  /**
   * Quantity of carbohydrate in grams.
   */
  @Column("float4")
  public carbohydrate!: number;

  /**
   * Quantity of sugars in grams.
   */
  @Column("float4", { nullable: true })
  public sugars!: number | null;

  /**
   * Quantity of polyols in grams.
   */
  @Column("float4", { nullable: true })
  public polyols!: number | null;

  /**
   * Quantity of starch in grams.
   */
  @Column("float4", { nullable: true })
  public starch!: number | null;

  /**
   * Quantity of fibre in grams.
   */
  @Column("float4", { nullable: true })
  public fibre!: number | null;

  /**
   * Quantity of protein in grams.
   */
  @Column("float4")
  public protein!: number;

  /**
   * Quantity of salt in grams.
   */
  @Column("float4", { nullable: true })
  public salt!: number | null;

  /**
   * Returns a representation of this model that will be transferred to the
   * client.
   */
  public toData = () => ({
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

/**
 * Nutrition declaration model data transfer object type.
 */
export type NutritionDeclarationData = ReturnType<
  NutritionDeclaration["toData"]
>;
