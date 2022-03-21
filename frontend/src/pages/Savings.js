// components
import Page from '../components/Page';
import SavingsTable from '../components/SavingsTable';
import UserSavingsTable from '../components/UserSavingsTable';
import jwt_decode from 'jwt-decode';

// ----------------------------------------------------------------------

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export default function Savings() {
  const userJson = localStorage.getItem("user");
  const user = JSON.parse(userJson);
  const role = jwt_decode(user.authToken)[ROLE_CLAIM];
  const title = "Savings | Financial Achievement Club";
  if (role === "Administrator") {
    return (
      <Page title={title}>
        <SavingsTable/>
      </Page>
    );
  }
  // Regular users see the UserSavingsTable.
  return (
    <Page title={title}>
      <UserSavingsTable/>
    </Page>
  );
}
