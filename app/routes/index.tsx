import { styled } from '~/styles/stitches.config';

export default function Index() {
  return (
    <Main>
      <h1>Hello World</h1>
    </Main>
  );
}

const Main = styled('main', {
  padding: 32,
});
