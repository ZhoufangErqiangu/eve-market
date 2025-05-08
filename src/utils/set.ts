export class JsonSet<T> extends Set<T> {
  constructor(iterable?: Iterable<T>) {
    super(iterable);
  }

  toJSON() {
    return Array.from(this);
  }
}
