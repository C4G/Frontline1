// components
import { UserCourses, CoursesTable } from '../components/_dashboard/courses';
// 
import jwt_decode from "jwt-decode";

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

// ----------------------------------------------------------------------

export default function Courses() {
  const userJson = localStorage.getItem("user");
  const user = JSON.parse(userJson);
  const role = jwt_decode(user.authToken)[ROLE_CLAIM];
  if (role === "Administrator") {
    return <CoursesTable/>;
  }
  return <UserCourses/>;
}
