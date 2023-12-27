import { useState, type ReactNode } from 'react';
import { useTransform, useScroll, motion } from 'framer-motion';
import useMeasure from 'react-use-measure';

import { Icon, IconButton, Stack, Text, Touchable } from '~/components/uikit';
import { styled } from '~/styles/styled';

type Props = {
  title: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  search?: { value: string; onChange: (value: string) => void };
};

export function Navbar({ title, search, leftSlot, rightSlot }: Props) {
  const [searchVisible, setSearchVisible] = useState(false);
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

            <StickyNavTitle variant="bodyBold" align="center">
              {title}
            </StickyNavTitle>

            <div ref={rightSlotRef} style={{ minWidth: maxSlotWidth }}>
              {rightSlot}
            </div>
          </StickyNavContent>
        </StickyNavWrapper>
      </StickyNav>

      <StaticNav direction="x" spacing="small" align="center">
        {searchVisible && search ? (
          <SearchBar
            value={search.value}
            onChange={search.onChange}
            onClear={() => search.onChange('')}
            onClose={() => setSearchVisible(false)}
          />
        ) : (
          <>
            <StaticNavTitle variant="title1">{title}</StaticNavTitle>

            <div>{leftSlot}</div>
            <div>{rightSlot}</div>

            {!!search && (
              <IconButton
                icon="search"
                onPress={() => setSearchVisible(true)}
              />
            )}
          </>
        )}
      </StaticNav>
    </>
  );
}

function SearchBar({
  value,
  onChange,
  onClear,
  onClose,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  return (
    <SearchBarWrapper>
      <Stack direction="x" spacing="small" align="center">
        <SearchInputWrapper>
          <SearchInputIcon name="search" size={20} color="textMuted" />
          <SearchInput
            type="text"
            placeholder="Etsi"
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {!!value && (
            <SearchInputClearButton
              icon="close"
              size={16}
              color="textMuted"
              onPress={onClear}
            />
          )}
        </SearchInputWrapper>

        <SearchCloseButton onPress={onClose}>Sulje</SearchCloseButton>
      </Stack>
    </SearchBarWrapper>
  );
}

export const NAVBAR_HEIGHT = 'calc(50px + env(safe-area-inset-top))';

const StaticNav = styled(Stack, {
  paddingHorizontal: '$regular',
  paddingBottom: '$regular',
});

const StaticNavTitle = styled(Text, {
  flex: 1,
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

const StickyNavTitle = styled(Text, {
  flex: 1,
});

const StickyNavContent = styled(motion.div, {
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: '$regular',
});

const SearchBarWrapper = styled('div', {
  width: '100%',
  fadeIn: '300ms',
});

const SearchInputWrapper = styled('div', {
  position: 'relative',
  flex: 1,
});

const SearchInput = styled('input', {
  border: 'none',
  borderRadius: '$regular',
  paddingLeft: '$xlarge',
  paddingRight: '$small',
  paddingVertical: '$xsmall',
  flex: 1,
  backgroundColor: '$surface2',
  outline: 'none',
  typography: '$body',
  color: '$text',
  minHeight: 40,
  width: '100%',
});

const SearchCloseButton = styled(Touchable, {
  typography: '$bodySmallBold',
  color: '$textMuted',
  fadeSlideIn: 'right',
  animationDelay: '200ms',
});

const SearchInputIcon = styled(Icon, {
  position: 'absolute',
  left: '$small',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
});

const SearchInputClearButton = styled(IconButton, {
  position: 'absolute',
  right: '$xsmall',
  top: '50%',
  transform: 'translateY(-50%)',
});
