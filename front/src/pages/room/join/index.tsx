const Join = () => {};

export default Join;

export const getServerSideProps = () => {
  return {
    redirect: {
      permanent: false,
      destination: '/login',
    },
  };
};
