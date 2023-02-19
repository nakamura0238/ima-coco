const display = () => {};

export default display;

export const getServerSideProps = () => {
  return {
    redirect: {
      permanent: true,
      destination: '/room',
    },
  };
};
