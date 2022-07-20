import { createStitches } from '@stitches/react';

const stitches = createStitches({
  theme: {
    colors: {
      red: '#ff6d6d',
      steel: '#363645',
      black: '#000',
      white: '#fff',
      grey: '#666',
    },
  },
});

const { styled, globalCss, getCssText } = stitches;

export { styled, globalCss, getCssText };
