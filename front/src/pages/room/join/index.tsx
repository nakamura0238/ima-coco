const Join = () => {};

export default Join;

export const getServerSideProps = () => {
  return {
    redirect: {
      permanent: true,
      destination: '/room',
    },
  };
};
