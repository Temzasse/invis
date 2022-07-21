import Button from '~/components/uikit/Button';
import { styled } from '~/styles/stitches.config';

export default function Index() {
  return (
    <Main>
      <Button onPress={() => console.log('Pressed')}>Hello world</Button>
    </Main>
  );
}

const Main = styled('main', {
  padding: 32,
});
