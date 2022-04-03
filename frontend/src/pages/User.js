import { useParams } from 'react-router-dom';
// components
import Page from '../components/Page';
//
import { UserCoursesTable, UserSavingsTable } from 'src/components/admin';
// ----------------------------------------------------------------------

export default function User() {
  let { id: userID } = useParams();
  return (
    <Page title="User | Financial Achievement Club">
      <UserCoursesTable userID={userID} />
      <br/>
      <br/>
      <UserSavingsTable userID={userID} />
    </Page>
  );
}
