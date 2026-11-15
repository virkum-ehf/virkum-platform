import { render } from "@testing-library/react";

import { cn } from "./cn";
import { initials, noBreak, splitTick } from "./text";

describe("initials", () => {
  it("takes the first letters of the first two names", () => {
    expect(initials("Helgi Már Þórðarson")).toBe("HM");
    expect(initials("Íris")).toBe("Í");
  });
});

describe("noBreak", () => {
  it("wraps number ranges in a no-wrap span and keeps the text", () => {
    const { container } = render(<p>{noBreak("A 60-minute call in 2–4 weeks")}</p>);
    expect(container.textContent).toBe("A 60-minute call in 2–4 weeks");
    expect([...container.querySelectorAll(".nw")].map((span) => span.textContent)).toEqual(["60-minute", "2–4"]);
  });

  it("returns plain text unchanged", () => {
    expect(noBreak("No ranges here")).toBe("No ranges here");
  });
});

describe("splitTick", () => {
  it("separates a leading tick", () => {
    expect(splitTick("✓ No obligation")).toEqual({ tick: true, text: "No obligation" });
    expect(splitTick("Plain")).toEqual({ tick: false, text: "Plain" });
  });
});

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});
