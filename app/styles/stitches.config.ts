import { createStitches } from "@stitches/react";

const stitches = createStitches({
  theme: {
    colors: {
      red: "#ff6d6d",
      steel: "#363645",
      black: "#000",
      white: "#fff",
      grey: "#666",
    },
  },
  media: {
    tabletUp: "(min-width: 768px)",
    desktopUp: "(min-width: 1024px)",
    largeDesktopUp: "(min-width: 1680px)",
  },
});

const { styled, globalCss, getCssText } = stitches;

export const globalStyles = globalCss({
  "*, *::before, *::after": {
    boxSizing: "border-box",
  },
  "*": {
    margin: 0,
  },
  "html, body": {
    margin: 0,
    padding: 0,
    height: "100%",
    fontSize: "16px",
  },
  body: {
    lineHeight: 1.5,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    WebkitOverflowScrolling: "touch",
    WebkitTapHighlightColor: "transparent",
    WebkitTouchCallout: "none",
  },
  button: {
    border: "none",
    background: "none",
    outline: "none",
    padding: 0,
  },
  "img, picture, video, canvas, svg": {
    display: "block",
    maxWidth: "100%",
  },
  "input, button, textarea, select": {
    font: "inherit",
  },
  "p, h1, h2, h3, h4, h5, h6": {
    overflowWrap: "breakWord",
  },
  a: {
    textDecoration: "none",
  },
  ul: {
    padding: 0,
    margin: 0,
  },
  li: {
    listStyle: "none",
  },
});

export { styled, getCssText, globalCss };
