import { motion } from 'framer-motion';
import { Stack, Text, Touchable } from '~components/uikit';
import { styled } from '~styles/styled';
import { ItemStatusIndicator, ItemStatus } from './ItemStatus';

type Props = {
  status: ItemStatus;
  name: string;
  isEditable: boolean;
  onEdit: (status: ItemStatus) => void;
};

export default function ItemRow({ status, name, isEditable, onEdit }: Props) {
  return (
    <Wrapper direction="x" spacing="regular" align="center">
      {isEditable ? (
        <>
          <motion.div
            initial={{ x: '-50%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 0.2 }}
          >
            <EditStatusButton
              status="full"
              isActive={status === 'full'}
              onPress={() => onEdit('full')}
            />
          </motion.div>
          <motion.div
            initial={{ x: '-50%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 0.3 }}
          >
            <EditStatusButton
              status="partial"
              isActive={status === 'partial'}
              onPress={() => onEdit('partial')}
            />
          </motion.div>
          <motion.div
            initial={{ x: '-50%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 0.4 }}
          >
            <EditStatusButton
              status="missing"
              isActive={status === 'missing'}
              onPress={() => onEdit('missing')}
            />
          </motion.div>
        </>
      ) : (
        <ItemStatusIndicator status={status} />
      )}

      <Text variant="body">{name}</Text>
    </Wrapper>
  );
}

function EditStatusButton({
  isActive,
  status,
  onPress,
}: {
  isActive: boolean;
  status: ItemStatus;
  onPress: () => void;
}) {
  return (
    <StatusButton isActive={isActive} onPress={onPress}>
      <ItemStatusIndicator
        status={status}
        noGlow={!isActive}
        style={{ opacity: !isActive ? 0.3 : 1 }}
      />
    </StatusButton>
  );
}

const Wrapper = styled(Stack, {
  width: '100%',
  padding: '$regular',
});

const StatusButton = styled(Touchable, {
  width: 32,
  height: 32,
  flexCenter: 'row',
  borderRadius: '$circle',
  variants: {
    isActive: {
      true: { border: '1px solid $surface1' },
    },
  },
});
