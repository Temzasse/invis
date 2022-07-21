import type { ReactNode } from 'react';
import { forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { useButton } from '@react-aria/button';
import { motion, useAnimation } from 'framer-motion';
import { FocusRing } from '@react-aria/focus';

export type TouchableProps = {
  children: ReactNode;
  onPress: () => void;
};

export const Touchable = forwardRef<any, TouchableProps>(
  ({ onPress, children, ...rest }, ref) => {
    const localRef = useRef(null);
    const mergedRef = mergeRefs([localRef, ref]) as any;
    const controls = useAnimation();
    const { buttonProps } = useButton(
      {
        onPressStart: () => {
          controls.stop();
          controls.set({ background: '#757376' });
        },
        onPressEnd: () => {
          controls.start({
            background: '#353336',
            transition: { duration: 0.4 },
          });
        },
        onPress: () => {
          onPress();
          controls.start({
            background: [null, '#353336'],
            transition: { duration: 0.4 },
          });
        },
      },
      mergedRef
    );

    return (
      <FocusRing focusRingClass="focus-visible">
        <motion.button
          {...(buttonProps as any)}
          {...rest}
          animate={controls}
          style={{ touchAction: 'none', userSelect: 'none', outline: 'none' }}
        >
          {children}
        </motion.button>
      </FocusRing>
    );
  }
);

Touchable.displayName = 'Touchable';
