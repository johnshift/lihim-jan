import { AppProps } from 'next/app';
import Head from 'next/head';

import { AuthModal } from '@lihim/auth/feature';
import { Appbar } from '@lihim/shared/appbar';
import { RootProvider } from '@lihim/shared/data-access';
import { MantineProvider } from '@lihim/shared/mantine';
import { Nav } from '@lihim/shared/nav';
import { ReactQueryProvider } from '@lihim/shared/react-query';
import { PageLayout } from '@lihim/shared/ui';

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
        <ReactQueryProvider>
          <RootProvider>
            <PageLayout nav={<Nav />} appbar={<Appbar />}>
              <Component {...pageProps} />
            </PageLayout>
            <AuthModal />
          </RootProvider>
        </ReactQueryProvider>
      </MantineProvider>
    </main>
  </>
);

export default App;
