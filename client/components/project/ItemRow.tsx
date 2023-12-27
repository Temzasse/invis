import { motion } from 'framer-motion';
import { Stack, Text } from '~components/uikit';
import { styled } from '~styles/styled';
import { ItemStatus } from './ItemStatus';
import ItemStatusButton from './ItemStatusButton';

type Props = {
  id: string;
  status: ItemStatus;
  name: string;
  isEditable: boolean;
  onEditStart: () => void;
  onEditChange: (status: ItemStatus) => void;
};

export function ItemRow({
  id,
  status,
  name,
  isEditable,
  onEditStart,
  onEditChange,
}: Props) {
  return (
    <Wrapper id={id} direction="x" spacing="regular" align="center">
      {isEditable ? (
        <>
          <motion.div
            initial={{ x: '-50%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 0.2 }}
          >
            <ItemStatusButton
              status="full"
              isActive={status === 'full'}
              onPress={() => onEditChange('full')}
            />
          </motion.div>
          <motion.div
            initial={{ x: '-50%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 0.3 }}
          >
            <ItemStatusButton
              status="partial"
              isActive={status === 'partial'}
              onPress={() => onEditChange('partial')}
            />
          </motion.div>
          <motion.div
            initial={{ x: '-50%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 0.4 }}
          >
            <ItemStatusButton
              status="missing"
              isActive={status === 'missing'}
              onPress={() => onEditChange('missing')}
            />
          </motion.div>
        </>
      ) : (
        <ItemStatusButton status={status} isActive onPress={onEditStart} />
      )}

      <Text variant="body">{name}</Text>
    </Wrapper>
  );
}

const Wrapper = styled(Stack, {
  width: '100%',
  padding: '$regular',
  transition: 'background-color 0.2s ease',

  '&[data-highlighted="true"]': {
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
});
