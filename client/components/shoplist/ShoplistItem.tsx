import { forwardRef, memo, useState } from 'react';
import { motion } from 'framer-motion';

import { styled } from '~/styles/styled';
import { Checkbox, EditableText, IconButton } from '~/components/uikit';

type Props = {
  id: string;
  name: string;
  checked: boolean;
  onCheckChange: (id: string, checked: boolean) => void;
  onNameChange: (id: string, name: string) => void;
  onRemove: (id: string) => void;
};

// NOTE: AnimatePresence passes a ref to the component, so we need to forward it
export const ShopListItem = memo(
  forwardRef<any, Props>(function ShopListItem(
    { id, name, checked, onCheckChange, onNameChange, onRemove },
    ref
  ) {
    const [removeButtonVisible, setRemoveButtonVisible] = useState(true);

    function handleStartEdit() {
      setRemoveButtonVisible(false);
    }

    function handleEndEdit(value: string) {
      setRemoveButtonVisible(true);
      onNameChange(id, value);
    }

    return (
      <ListItem
        className={`shoplist-item-${id}`}
        ref={ref}
        layout="position"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          hidden: { opacity: 1, height: 0, overflow: 'hidden' },
          visible: { opacity: 1, height: 'auto', overflow: 'visible' },
        }}
      >
        <ListItemContent>
          <Checkbox
            checked={checked}
            onChange={(event) => {
              // Item needs to have a name before it can be checked
              if (name) {
                onCheckChange(id, event.currentTarget.checked);
              }
            }}
          />
          <EditableText
            onEditStart={handleStartEdit}
            onEditDone={handleEndEdit}
          >
            {name}
          </EditableText>
        </ListItemContent>

        {removeButtonVisible && (
          <RemoveButtonWrapper>
            <IconButton
              icon="minusOutline"
              size={20}
              color="textMuted"
              onPress={() => onRemove(id)}
            />
          </RemoveButtonWrapper>
        )}
      </ListItem>
    );
  })
);

const ListItem = styled(motion.li, {
  display: 'flex',
});

const ListItemContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$regular',
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  minHeight: '35px',
});

const RemoveButtonWrapper = styled('div', {
  // Offset a bit to align with navbar right slot icon
  marginRight: '-$xxsmall',
});
