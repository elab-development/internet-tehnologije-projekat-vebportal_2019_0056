import { useSelector } from 'react-redux';

export const usePrivilege = (privilege) => {
  const { currentUser } = useSelector((state) => state.user);

  if (currentUser) {
    if (privilege === 'admin') {
      return currentUser.isAdmin;
    } else if (privilege === 'editor') {
      return currentUser.isEditor;
    } else if (privilege === 'admineditor') {
      return currentUser.isAdmin || currentUser.isEditor;
    } else {
      return false;
    }
  } else {
    return false;
  }
};