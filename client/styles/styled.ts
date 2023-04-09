import type * as Stitches from '@stitches/react';
import { createStitches } from '@stitches/react';

import * as tokenUtils from './tokens/utils';
import * as typography from './tokens/typography';
import * as colors from './tokens/colors';
import * as space from './tokens/spacing';
import * as radii from './tokens/radii';
import * as utils from './utils';

const stitches = createStitches({
  theme: {
    colors: {
      transparent: 'transparent',
      ...colors,
    },
    space: {
      none: '0px',
      ...tokenUtils.mapToPx(space),
    },
    radii: {
      none: '0px',
      circle: '50%',
      ...tokenUtils.mapToPx(radii),
    },
    fontSizes: {
      ...tokenUtils.mapTypography(typography, 'fontSize'),
    },
    fontWeights: {
      ...tokenUtils.mapTypography(typography, 'fontWeight'),
    },
    fonts: {
      ...tokenUtils.mapTypography(typography, 'fontFamily'),
    },
    lineHeights: {
      ...tokenUtils.mapTypography(typography, 'lineHeight'),
    },
    letterSpacings: {
      ...tokenUtils.mapTypography(typography, 'letterSpacing'),
    },
  },
  media: {
    sm: '(min-width: 576px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 992x)',
    xl: '(min-width: 1200px)',
  },
  utils,
});

const { styled, css, keyframes, theme, config, globalCss, getCssText } =
  stitches;

export type CSS = Stitches.CSS<typeof config>;
export type Theme = typeof config['theme'];
export type Color = keyof typeof theme['colors'];
export type Space = keyof typeof theme['space'];
export type Radii = keyof typeof theme['radii'];
export type Typography = keyof typeof typography;

export { styled, css, keyframes, theme, config, globalCss, getCssText };
