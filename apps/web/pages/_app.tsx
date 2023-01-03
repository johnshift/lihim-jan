import { GetServerSidePropsContext } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';

import { ColorScheme } from '@mantine/core';

import { MantineProvider } from '@lihim/shared/mantine';
import { getCookie } from 'cookies-next';

const App = ({
  Component,
  pageProps,
  colorScheme,
}: AppProps & { colorScheme: ColorScheme }) => (
  <>
    <Head>
      <title>Lihim App</title>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
    </Head>
    <main>
      <MantineProvider colorScheme={colorScheme}>
        <Component {...pageProps} />
      </MantineProvider>
    </main>
  </>
);

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  // Get color scheme from cookie (defaults to dark)
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'dark',
});

export default App;
