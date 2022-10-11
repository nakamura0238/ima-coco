import '../styles/globals.css';
import '../styles/destyle.css';
import type {AppProps} from 'next/app';
import React from 'react';
import {RecoilRoot} from 'recoil';


// eslint-disable-next-line require-jsdoc
function MyApp({Component, pageProps}: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
