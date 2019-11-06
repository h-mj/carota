interface EntityLike {
  toDto: (...args: any[]) => any;
}

export type DtoOf<T extends EntityLike> = ReturnType<
  T["toDto"]
> extends Promise<infer IDto>
  ? IDto
  : never;
