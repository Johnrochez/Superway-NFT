import { useQuery } from 'react-query';

export default function useFetchSigner() {
  return useQuery(['signer'], () => getSignerFromLocalStorage());
}

const getSignerFromLocalStorage = async () => {
  const signer = localStorage.getItem('@signer');
  console.log('local store', signer);
  return localStorage.getItem('@signer');
};
