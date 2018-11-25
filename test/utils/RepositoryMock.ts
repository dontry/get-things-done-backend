export class RepositoryMock<T> {
  public one: T;
  public list: T[];

  public findMock = jest.fn();
  public findAllMock = jest.fn();
  public findOneMock = jest.fn();
  public saveMock = jest.fn();
  public deleteMock = jest.fn();

  /**
   * find
   */
  public find(...args: any[]): Promise<T[]> {
    this.findMock(args);
    return Promise.resolve(this.list);
  }

  public findAll(): Promise<T[]> {
    this.findAllMock();
    return Promise.resolve(this.list);
  }

  /*
   * findOne
   */
  public findOne(...args: any[]): Promise<T> {
    this.findOneMock(args);
    return Promise.resolve(this.one);
  }

  /*
   * save
   */
  public save(value: T, ...args: any[]): Promise<T> {
    this.saveMock(value, args);
    return Promise.resolve(value);
  }

  /**
   * delete
   */
  public delete(value: T, ...args: any[]): Promise<T> {
    this.deleteMock(value, args);
    return Promise.resolve(value);
  }
}
