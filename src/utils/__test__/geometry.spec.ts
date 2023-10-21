import { test, describe, expect } from "vitest";
import { arePointsTouching } from "../geometry";

describe("geometry", () => {
  test("Points", () => {
    const result = arePointsTouching(
      {
        pos: {
          x: 10,
          y: 10,
        },
        size: {
          width: 20,
          height: 20,
        },
      },
      {
        pos: {
          x: 10,
          y: 0,
        },
        size: { width: 3, height: 90 },
      }
    );

    expect(result).toBe(true);
  });
});
