import type * as Stitches from '@stitches/react';
import { keyframes } from '@stitches/react';
import { Typography } from './styled';

export function typography(variant: `$${Typography}`) {
  return {
    fontFamily: variant,
    fontWeight: variant,
    fontSize: variant,
    letterSpacing: variant,
    lineHeight: variant,
  };
}

export const paddingVertical = (value: Stitches.PropertyValue<'padding'>) => ({
  paddingTop: value,
  paddingBottom: value,
});

export const paddingHorizontal = (
  value: Stitches.PropertyValue<'padding'>
) => ({
  paddingLeft: value,
  paddingRight: value,
});

export const margingHorizontal = (value: Stitches.PropertyValue<'margin'>) => ({
  marginLeft: value,
  marginRight: value,
});

export const margingVertical = (value: Stitches.PropertyValue<'margin'>) => ({
  marginTop: value,
  marginBottom: value,
});

export const size = (value: Stitches.PropertyValue<'width'>) => ({
  width: value,
  height: value,
});

export const safeAreaInsets = (method: 'padding' | 'margin') =>
  method === 'padding'
    ? {
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }
    : {
        marginTop: 'env(safe-area-inset-top)',
        marginBottom: 'env(safe-area-inset-bottom)',
      };

export const absoluteFill = () => ({
  position: 'absolute',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
});

export const fixedFill = () => ({
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
});

export const flexCenter = () => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const gradientText = () => ({
  background:
    'linear-gradient(90deg, $colors$primary 0%, $colors$secondary 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

export const viewportHeight = (value: number) => ({
  height: `calc(${value} * var(--vh))`,
});

export const viewportMinHeight = (value: number) => ({
  minHeight: `calc(${value} * var(--vh))`,
});

const fadeInAnimation = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

type Ms = `${number}ms`;

export const fadeIn = (ms: Ms) => ({
  opacity: 0,
  animation: `${fadeInAnimation} ${ms} ease-in-out forwards`,
});

const fadeSlideInLeft = keyframes({
  from: { opacity: 0, transform: 'translateX(-100%)' },
  to: { opacity: 1, transform: 'translateX(0)' },
});

const fadeSlideInRight = keyframes({
  from: { opacity: 0, transform: 'translateX(100%)' },
  to: { opacity: 1, transform: 'translateX(0)' },
});

export const fadeSlideIn = (direction: 'left' | 'right') => ({
  opacity: 0,
  animation: `${
    direction === 'left' ? fadeSlideInLeft : fadeSlideInRight
  } 200ms ease-in-out forwards`,
});
