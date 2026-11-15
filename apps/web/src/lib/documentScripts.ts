/**
 * Marks the page as scripted before first paint (html.js), so reveal animations
 * only hide content when JavaScript runs. Rendered inline in <head>.
 */
export const MARK_SCRIPTED = "document.documentElement.classList.add('js')";
