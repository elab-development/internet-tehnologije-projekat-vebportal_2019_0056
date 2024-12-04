import { useSelector } from 'react-redux';

export const useLoggedIn = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return false;
  } else {
    return true;
  }
};