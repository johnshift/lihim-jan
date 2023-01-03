import { AppProps } from 'next/app';
import Head from 'next/head';

import { MantineProvider } from '@lihim/shared/mantine';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Lihim App</title>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
    </Head>
    <main>
      <MantineProvider colorScheme="dark">
        <Component {...pageProps} />
      </MantineProvider>
    </main>
  </>
);

export default App;
