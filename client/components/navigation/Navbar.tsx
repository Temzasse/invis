import type { ReactNode } from 'react';
import { useTransform, useScroll, motion } from 'framer-motion';
import useMeasure from 'react-use-measure';

import { Stack, Text } from '~components/uikit';
import { styled } from '~styles/styled';

type Props = {
  title: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
};

export default function Navbar({ title, leftSlot, rightSlot }: Props) {
  const [leftSlotRef, leftSlotBounds] = useMeasure();
  const [rightSlotRef, rightSlotBounds] = useMeasure();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [30, 60], [0, 1]);
  const translateY = useTransform(scrollY, [30, 40], [-10, 0]);
  const maxSlotWidth = Math.max(leftSlotBounds.width, rightSlotBounds.width);

  const backgroundColor = useTransform(
    scrollY,
    [80, 160],
    ['rgba(0,0,0,1)', 'rgba(50,50,50,0.6)']
  );

  const borderBottomColor = useTransform(
    scrollY,
    [80, 160],
    ['rgba(255,255,255,0)', 'rgba(255,255,255,0.1)']
  );

  return (
    <>
      <StickyNav>
        <StickyNavWrapper style={{ backgroundColor, borderBottomColor }}>
          <StickyNavContent style={{ opacity, translateY }}>
            <div ref={leftSlotRef} style={{ minWidth: maxSlotWidth }}>
              {leftSlot}
            </div>
            <Text variant="bodyBold">{title}</Text>
            <div ref={rightSlotRef} style={{ minWidth: maxSlotWidth }}>
              {rightSlot}
            </div>
          </StickyNavContent>
        </StickyNavWrapper>
      </StickyNav>

      <StaticNav direction="x" spacing="large" align="end" justify="between">
        <Text variant="title1">{title}</Text>
        <div>{rightSlot}</div>
      </StaticNav>
    </>
  );
}

export const NAVBAR_HEIGHT = 'calc(50px + env(safe-area-inset-top))';

const StaticNav = styled(Stack, {
  paddingHorizontal: '$regular',
  paddingBottom: '$regular',
});

const StickyNav = styled('nav', {
  zIndex: 999,
  position: 'sticky',
  top: 0,
  width: '100%',
  minHeight: 50,
  height: NAVBAR_HEIGHT,
});

const StickyNavWrapper = styled(motion.div, {
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(0,0,0,1)',
  borderBottom: '1px solid rgba(0,0,0,0.1)',
  backdropFilter: 'blur(16px)',
  paddingTop: 'env(safe-area-inset-top)',
});

const StickyNavContent = styled(motion.div, {
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: '$regular',
});
