import type { ReactNode } from 'react';
import { useTransform, useScroll, motion } from 'framer-motion';

import { Stack, Text } from '~components/uikit';
import { styled } from '~styles/styled';

type Props = {
  title: string;
  renderLeft?: () => ReactNode;
  renderRight?: () => ReactNode;
};

export default function Navbar({ title, renderLeft, renderRight }: Props) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [30, 60], [0, 1]);
  const translateY = useTransform(scrollY, [30, 40], [-10, 0]);

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
        <StickyNavContent style={{ backgroundColor, borderBottomColor }}>
          {renderLeft ? renderLeft() : <div />}
          <StickyNavTitle style={{ opacity, translateY }}>
            {title}
          </StickyNavTitle>
          {renderRight ? renderRight() : <div />}
        </StickyNavContent>
      </StickyNav>

      <StaticNav direction="x" spacing="large" align="end" justify="between">
        <Text variant="title1">{title}</Text>
        {renderRight ? renderRight() : <div />}
      </StaticNav>
    </>
  );
}

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
  height: 'calc(50px + env(safe-area-inset-top))',
});

const StickyNavContent = styled(motion.div, {
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(0,0,0,1)',
  borderBottom: '1px solid rgba(0,0,0,0.1)',
  backdropFilter: 'blur(16px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: 'env(safe-area-inset-top)',
});

const StickyNavTitle = styled(motion.span, {
  typography: '$bodyBold',
  color: '$text',
});
