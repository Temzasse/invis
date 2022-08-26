import { forwardRef, useRef, ReactNode } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { useButton } from '@react-aria/button';
import { FocusRing } from '@react-aria/focus';
import { motion, useAnimation } from 'framer-motion';

export type TouchableProps = {
  children: ReactNode;
  interaction?: 'opacity' | 'highlight';
  asLink?: boolean;
  onPress?: () => void;
};

const transistionDuration = 0.4;

export const Touchable = forwardRef<any, TouchableProps>(
  (
    { onPress, children, interaction = 'opacity', asLink = false, ...rest },
    ref
  ) => {
    const localRef = useRef(null);
    const mergedRef = mergeRefs([localRef, ref]) as any;
    const controls = useAnimation();

    const animatedStyles = {
      start:
        interaction === 'opacity'
          ? { opacity: 0.85 }
          : { backgroundColor: 'rgba(150, 150, 150, 0.15)' },
      end:
        interaction === 'opacity'
          ? { opacity: 1 }
          : { backgroundColor: 'rgba(150, 150, 150, 0)' },
    };

    const { buttonProps } = useButton(
      {
        onPressStart: () => {
          controls.stop();
          controls.set({
            ...animatedStyles.start,
            transition: { duration: transistionDuration },
          });
        },
        onPressEnd: () => {
          controls.start({
            ...animatedStyles.end,
            transition: { duration: transistionDuration },
          });
        },
        onPress,
        elementType: asLink ? 'a' : 'button',
      },
      mergedRef
    );

    const Element = asLink ? motion.a : motion.button;

    return (
      <FocusRing focusRingClass="focus-visible">
        <Element
          {...(buttonProps as any)}
          {...rest}
          animate={controls}
          style={{ touchAction: 'none', userSelect: 'none', outline: 'none' }}
        >
          {children}
        </Element>
      </FocusRing>
    );
  }
);

Touchable.displayName = 'Touchable';
