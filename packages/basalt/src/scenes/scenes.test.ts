import { mountAiGridScene } from "./aiGrid";
import { mountCaseStudyScene } from "./caseStudy";
import { mountHeroScene } from "./hero";
import { mountQuizScene } from "./quiz";
import { mountSkylineScene } from "./skyline";
import { mountStepsScene } from "./steps";

// jsdom has no WebGL: every scene must report "no scene" instead of throwing, so the
// React host can show its flat fallback.
describe("scenes without WebGL", () => {
  beforeAll(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  });

  const host = () => document.body.appendChild(document.createElement("div"));

  it("return null and leave no canvas behind", () => {
    const element = host();
    expect(mountHeroScene(element, { section: element, compact: false })).toBeNull();
    expect(mountStepsScene(element)).toBeNull();
    expect(mountAiGridScene(element)).toBeNull();
    expect(mountSkylineScene(element, { region: element, compact: true })).toBeNull();
    expect(mountCaseStudyScene(element)).toBeNull();
    expect(mountQuizScene(element, 5)).toBeNull();
    expect(element.querySelector("canvas")).toBeNull();
  });
});
