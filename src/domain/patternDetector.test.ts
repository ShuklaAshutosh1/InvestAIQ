import { describe, expect, it } from "vitest";
import { detectPattern, suggestionFor } from "./patternDetector";

describe("detectPattern", () => {
  it("detects an upward streak", () => {
    const pattern = detectPattern([100, 101, 102, 103]);
    expect(pattern.direction).toBe("up");
    expect(pattern.length).toBe(3);
  });

  it("detects a downward streak", () => {
    const pattern = detectPattern([103, 102, 101]);
    expect(pattern.direction).toBe("down");
    expect(pattern.length).toBe(2);
  });

  it("returns flat when the last step didn't move", () => {
    const pattern = detectPattern([100, 100]);
    expect(pattern.direction).toBe("flat");
  });

  it("produces a suggestion for every pattern", () => {
    expect(suggestionFor({ direction: "up", length: 4 })).toMatch(/Sustained/);
    expect(suggestionFor({ direction: "flat", length: 0 })).toMatch(/flat/);
  });
});
