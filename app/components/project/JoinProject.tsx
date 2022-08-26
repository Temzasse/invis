import Link from 'next/link';
import { styled } from '~styles/styled';
import { Button } from '~components/uikit';

export default function JoinProject() {
  return (
    <Wrapper>
      <Link href="/join?name=Hattusaari&pin=123456" passHref>
        <Button asLink variant="outlined">
          Join Hattusaari project
        </Button>
      </Link>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  safeAreaInsets: 'padding',
});
