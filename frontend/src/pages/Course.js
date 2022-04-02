import { CourseDetails, UserCourse } from '../components/_dashboard/courses';
//
import { useContext} from 'react';
import { AuthenticatedUser } from 'src/providers/UserProvider';

// ----------------------------------------------------------------------

export default function Course() {
  const { role } = useContext(AuthenticatedUser);
  if (role === "Administrator") {
    return <CourseDetails/>;
  }
  return <UserCourse/>;
}
