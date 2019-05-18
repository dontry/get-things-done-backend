export default class Pagination<T> {
  constructor(
    public readonly items: T[],
    public readonly itemCount: number,
    public readonly totalItems: number,
    public readonly pageCount: number,
    public readonly next?: string,
    public readonly previous?: string
  ) {}
}
