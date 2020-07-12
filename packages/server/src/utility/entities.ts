interface Data {
  toDto: (...args: any) => any;
}

export type DtoOf<T extends Data> = ReturnType<T["toDto"]> extends Promise<
  infer IDto
>
  ? IDto
  : never;

interface Entity extends Data {
  id: string;
}

interface LinkedEntity extends Entity {
  nextId: string | null;
}

export const ordered = <T extends LinkedEntity>(entities: T[]): T[] => {
  const reverse = new Map(entities.map((entity) => [entity.nextId, entity]));

  const order: T[] = [];
  let current = reverse.get(null);

  while (current !== undefined) {
    order.push(current);
    current = reverse.get(current.id);
  }

  return order.reverse();
};
