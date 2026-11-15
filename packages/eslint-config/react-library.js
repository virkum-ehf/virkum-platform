import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";

import { base } from "./base.js";

/** Shared React packages (design system, 3D engine bindings). */
export function reactLibrary({ tsconfigRootDir }) {
  return [...base({ tsconfigRootDir }), reactHooks.configs.flat["recommended-latest"], jsxA11y.flatConfigs.recommended];
}

export default reactLibrary;
