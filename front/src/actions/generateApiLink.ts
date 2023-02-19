export const generateApiLink = (path: string) => {
  const baseUrl = 'http://localhost/api';
  const resUrl = baseUrl + path;
  return resUrl;
};

export const generateServerApiLink = (path: string) => {
  const baseUrl = 'http://ima-coco_nginx:80/api';
  const resUrl = baseUrl + path;
  return resUrl;
};
