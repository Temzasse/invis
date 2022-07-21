import { styled } from '~/styles/stitches.config';
import { Touchable } from './Touchable';

type Props = {
  children: string;
  onPress: () => void;
};

export default function Button({ onPress, children }: Props) {
  return (
    <Wrapper onPress={onPress}>
      <span>{children}</span>
    </Wrapper>
  );
}

const Wrapper = styled(Touchable, {
  padding: 24,
  color: '#fff',
  borderRadius: 99,
});
