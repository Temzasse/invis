import { Touchable } from '~components/uikit';
import { styled } from '~styles/styled';
import { ItemStatusIndicator, ItemStatus } from './ItemStatus';

export default function ItemStatusButton({
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
