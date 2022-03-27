import React, { useContext } from 'react';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import { UserCoursesTable, CoursesTable } from '../components/_dashboard/courses';

// ----------------------------------------------------------------------

export default function Courses() {
  const { role } = useContext(AuthenticatedUser);
  if (role === "Administrator") {
    return <CoursesTable/>;
  }
  return <UserCoursesTable/>;
}
