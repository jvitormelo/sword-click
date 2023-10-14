import { test, describe, expect } from "vitest";
import { arePointsTouching } from "../geometry";

describe("geometry", () => {
  test("Points", () => {
    const result = arePointsTouching(
      { x: 10, y: 10, width: 20, height: 20 },
      { x: 10, y: 0, width: 3, height: 90 }
    );

    expect(result).toBe(true);
  });
});
