import { motion, LayoutGroup } from 'framer-motion';
import { Fragment } from 'react';
import { styled } from '~/styles/styled';
import { Text } from './Text';
import { Touchable } from './Touchable';

type Props<T> = {
  segments: Array<{ value: T; label: string }>;
  selected: T;
  onSelect: (value: T) => void;
};

export function SegmentedControl<T>({
  segments,
  selected,
  onSelect,
}: Props<T>) {
  const activeIndex = segments.findIndex(
    (segment) => segment.value === selected
  );

  return (
    <Wrapper>
      <LayoutGroup>
        {segments.map((segment, index) => {
          const distanceFromActive = Math.abs(index - activeIndex);
          const isLast = index === segments.length - 1;
          const isFirst = index === 0;
          const startSeparatorOpacity = !isFirst && distanceFromActive > 1 ? 1 : 0; // prettier-ignore
          const endSeparatorOpacity = !isLast && distanceFromActive > 1 ? 1 : 0;

          return (
            <Fragment key={segment.label}>
              <SegmentSeparator
                initial={false}
                animate={{ opacity: startSeparatorOpacity }}
                transition={{ duration: 0.8 }}
              />
              <Segment
                label={segment.label}
                isActive={segment.value === selected}
                onSelect={() => onSelect(segment.value)}
              />
              <SegmentSeparator
                initial={false}
                animate={{ opacity: endSeparatorOpacity }}
                transition={{ duration: 0.8 }}
              />
            </Fragment>
          );
        })}
      </LayoutGroup>
    </Wrapper>
  );
}

function Segment({
  label,
  isActive,
  onSelect,
}: {
  label: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <SegmentButton onPress={onSelect} interaction="opacity">
      <Text
        variant="bodySmall"
        as="span"
        style={{ opacity: isActive ? 1 : 0.9 }}
      >
        {label}
      </Text>
      {isActive && (
        <SegmentBackground layoutId="segment-indicator" layout="position" />
      )}
    </SegmentButton>
  );
}

const Wrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '$surface2',
  borderRadius: '$regular',
  padding: '$xxxsmall',
});

const SegmentButton = styled(Touchable, {
  position: 'relative',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$small',
  '& > span': {
    zIndex: 1,
  },
});

const SegmentBackground = styled(motion.div, {
  position: 'absolute',
  top: 3,
  bottom: 3,
  left: 3,
  right: 3,
  backgroundColor: '$surface2',
  borderRadius: 'calc($regular - $space$xxsmall / 2)',
});

const SegmentSeparator = styled(motion.div, {
  width: 1,
  height: 16,
  backgroundColor: '$surface1',
});
