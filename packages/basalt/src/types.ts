/**
 * Public types. Kept free of Three.js imports so components can import them without
 * pulling the 3D engine into the initial bundle (scenes are loaded with dynamic import()).
 */

/** Every scene returns a controller; the React host calls `dispose()` when it unmounts. */
export type SceneController = {
  dispose(): void;
};

export type StepsController = SceneController & {
  /** 0 = bottlenecks flagged, 1 = in order, 2 = running on a pulse. */
  setStep(step: number): void;
};

export type AiGroup = "use" | "policy" | "gap";

export type AiGridController = SceneController & {
  highlight(group: AiGroup | null): void;
};

export type QuizController = SceneController & {
  /** `scores[i]` is the chosen option's score (0 = best, 2 = worst) or null when unanswered. */
  setAnswers(scores: Array<number | null>, currentStep: number, done: boolean): void;
};

export type HeroSceneParams = {
  /** The hero section; scroll progress is measured against it. */
  section: HTMLElement;
  /** Small screens get a smaller field and a closer camera. */
  compact: boolean;
  /** Scroll progress 0..1, called every frame (used to fade the copy). */
  onProgress?: (progress: number) => void;
};

export type SkylineSceneParams = {
  /** The whole footer band counts as "pointer inside". */
  region: HTMLElement;
  compact: boolean;
};
