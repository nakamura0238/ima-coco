import {NextPage} from 'next';
import React from 'react';

const Error404: NextPage = () => {
  return (
    <p>エラーページ</p>
  );
};

export default Error404;

export const getServerSideProps = () => {
  return {
    redirect: {
      permanent: false,
      destination: '/room',
    },
  };
};

