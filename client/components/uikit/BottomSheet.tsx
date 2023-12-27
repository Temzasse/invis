import { ReactNode } from 'react';
import Sheet from 'react-modal-sheet';

import { styled } from '~/styles/styled';

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export function BottomSheet({ children, isOpen, onClose }: Props) {
  return (
    <SheetWrapper isOpen={isOpen} onClose={onClose}>
      <Sheet.Backdrop onTap={onClose} />
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <Sheet.Scroller>{children}</Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </SheetWrapper>
  );
}

const SheetWrapper = styled(Sheet, {
  '.react-modal-sheet-container': {
    backgroundColor: '$elevated !important',
  },
  '.react-modal-sheet-scroller': {
    padding: '$regular',
    paddingBottom: 'max(env(safe-area-inset-bottom), $regular)',
  },
});
