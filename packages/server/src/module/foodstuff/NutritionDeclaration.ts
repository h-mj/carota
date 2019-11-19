import { Column } from "typeorm";

import { DtoOf } from "../../utility/entities";

export class NutritionDeclaration {
  @Column("float4")
  public energy!: number;

  @Column("float4")
  public fat!: number;

  @Column("float4", { nullable: true })
  public saturates!: number | null;

  @Column("float4", { nullable: true })
  public monoUnsaturates!: number | null;

  @Column("float4", { nullable: true })
  public polyunsaturates!: number | null;

  @Column("float4")
  public carbohydrate!: number;

  @Column("float4", { nullable: true })
  public sugars!: number | null;

  @Column("float4", { nullable: true })
  public polyols!: number | null;

  @Column("float4", { nullable: true })
  public starch!: number | null;

  @Column("float4", { nullable: true })
  public fibre!: number | null;

  @Column("float4")
  public protein!: number;

  @Column("float4", { nullable: true })
  public salt!: number | null;

  public toDto = async () => ({
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

export type NutritionDeclarationDto = DtoOf<NutritionDeclaration>;
