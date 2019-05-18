import paginate from "../../../src/api/types/paginate";
import { Repository, FindManyOptions } from "typeorm";
import createTask from "../../fixture/createTask";
import Pagination from "../../../src/api/types/Pagination";
import { Task } from "../../../src/api/models";

class MockRepository extends Repository<any> {
  private items: any[] = [];
  constructor(entityAmount: number) {
    super();
    for (let index = 0; index < entityAmount; index++) {
      const task = createTask();
      this.items.push(task);
    }
  }

  /**
   * findAndCount
   */
  public async findAndCount(
    options?: FindManyOptions<any>
  ): Promise<[any[], number]> {
    if (options) {
      const selectedItems = this.items.slice(0, options.take);
      return [selectedItems, this.items.length];
    } else {
      return [[], 0];
    }
  }
}

describe("Test paginate function", () => {
  it("Can call method", async done => {
    const mockRepository = new MockRepository(0);

    const actual = await paginate<any>(mockRepository, {
      limit: 10,
      page: 1
    });

    expect(actual).toBeInstanceOf(Pagination);
    done();
  });

  it("Item length should be correct", async done => {
    const mockRepository = new MockRepository(10);

    const actual = await paginate<any>(mockRepository, {
      limit: 4,
      page: 1
    });

    expect(actual.items.length).toBe(4);
    expect(actual.itemCount).toBe(4);
    done();
  });

  it("Page count should be correct", async done => {
    const mockRepository = new MockRepository(10);

    const actual = await paginate<any>(mockRepository, {
      limit: 4,
      page: 1
    });

    expect(actual.pageCount).toBe(3);
    done();
  });

  it("Routes return successfully", async done => {
    const mockRepository = new MockRepository(10);

    const actual = await paginate<any>(mockRepository, {
      limit: 4,
      page: 2,
      route: "http://example.com/tasks"
    });

    expect(actual.next).toBe("http://example.com/tasks?page=3&limit=4");
    expect(actual.previous).toBe("http://example.com/tasks?page=1&limit=4");
    done();
  });

  it("Route previous return blank when page = 1", async done => {
    const mockRepository = new MockRepository(10);

    const actual = await paginate<any>(mockRepository, {
      limit: 4,
      page: 1,
      route: "http://example.com/tasks"
    });

    expect(actual.next).toBe("http://example.com/tasks?page=2&limit=4");
    expect(actual.previous).toBe("");
    done();
  });

  it("Route next return successfully blank", async done => {
    const mockRepository = new MockRepository(10);

    const actual = await paginate<any>(mockRepository, {
      limit: 4,
      page: 3,
      route: "http://example.com/tasks"
    });

    expect(actual.next).toBe("");
    expect(actual.previous).toBe("http://example.com/tasks?page=2&limit=4");
    done();
  });

  it("Can pass FindConditions", async () => {
    const mockRepository = new MockRepository(2);

    const results = await paginate<any>(
      mockRepository,
      {
        limit: 4,
        page: 1
      },
      {
        where: {
          test: 1
        }
      }
    );

    expect(results).toBeTruthy();
  });
});
