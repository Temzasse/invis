import type { NextPage } from 'next';
import Head from 'next/head';

import { styled } from '~styles/styled';
import { Icon, Text, Button, Stack } from '~components/uikit';

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Home</title>
      </Head>

      <Main>
        <Stack>
          <Icon name="checkFilled" color="primary" />
          <Icon name="gridFilled" color="statusFull" />
          <Icon name="settingsFilled" color="statusPartial" />
          <Icon name="clipboardOutline" color="statusMissing" />
          <Text variant="title1">Title 1</Text>
          <Text variant="title2">Title 2</Text>
          <Text variant="bodyBold">Body bold</Text>
          <Text variant="body">Body</Text>
          <Text variant="bodySmall">Body small</Text>
          <Text variant="bodySmallBold">Body small bold</Text>
          <Text variant="overline">Overline</Text>
          <Button onPress={() => console.log('Pressed')}>Press me</Button>
          <Button variant="outlined" onPress={() => console.log('Pressed')}>
            Press me
          </Button>
        </Stack>
      </Main>
    </Layout>
  );
};

const Layout = styled('div', {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const Main = styled('main', {
  padding: 40,
});

export default Home;
