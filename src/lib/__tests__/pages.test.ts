import { flattenPages } from "../pages";
import type { InfiniteData } from "@tanstack/react-query";

describe("flattenPages", () => {
  it("returns empty array when data is undefined", () => {
    expect(flattenPages(undefined)).toEqual([]);
  });

  it("returns empty array when pages array is empty", () => {
    const data: InfiniteData<{ results: string[] }> = {
      pages: [],
      pageParams: [],
    };
    expect(flattenPages(data)).toEqual([]);
  });

  it("flattens a single page of results", () => {
    const data: InfiniteData<{ results: number[] }> = {
      pages: [{ results: [1, 2, 3] }],
      pageParams: [undefined],
    };
    expect(flattenPages(data)).toEqual([1, 2, 3]);
  });

  it("flattens multiple pages of results in order", () => {
    const data: InfiniteData<{ results: string[] }> = {
      pages: [
        { results: ["a", "b"] },
        { results: ["c", "d"] },
        { results: ["e"] },
      ],
      pageParams: [undefined, "cursor1", "cursor2"],
    };
    expect(flattenPages(data)).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("handles pages with empty results arrays", () => {
    const data: InfiniteData<{ results: number[] }> = {
      pages: [{ results: [1] }, { results: [] }, { results: [2] }],
      pageParams: [undefined, "c1", "c2"],
    };
    expect(flattenPages(data)).toEqual([1, 2]);
  });

  it("works with complex object types", () => {
    interface Item {
      id: string;
      name: string;
    }
    const data: InfiniteData<{ results: Item[] }> = {
      pages: [
        { results: [{ id: "1", name: "Alice" }] },
        {
          results: [
            { id: "2", name: "Bob" },
            { id: "3", name: "Charlie" },
          ],
        },
      ],
      pageParams: [undefined, "next"],
    };
    expect(flattenPages(data)).toEqual([
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
      { id: "3", name: "Charlie" },
    ]);
  });
});
