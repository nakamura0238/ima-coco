import '../styles/globals.css';
import '../styles/destyle.css';
import type {AppProps} from 'next/app';
import React from 'react';
import {RecoilRoot} from 'recoil';
import {Toaster} from 'react-hot-toast';
import Head from 'next/head';


// eslint-disable-next-line require-jsdoc
function MyApp({Component, pageProps}: AppProps) {
  return (
    <RecoilRoot>
      <Head>
        <title>Ima-coco</title>
      </Head>
      <Component {...pageProps} />
      <Toaster/>
    </RecoilRoot>
  );
}

export default MyApp;
