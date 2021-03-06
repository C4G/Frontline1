import React, { useContext } from 'react';
// components
import Page from 'src/components/Page';
import UserSavingsTable from 'src/components/UserSavingsTable';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import Page404 from 'src/pages/Page404';
// ----------------------------------------------------------------------

export default function Savings() {
  const { role } = useContext(AuthenticatedUser);
  if (role === "User") {
    return (
      <Page title={"Savings | Financial Achievement Club"}>
        <UserSavingsTable/>
      </Page>
    );
  }
  return <Page404 />;
}
