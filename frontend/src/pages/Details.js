import React, { useContext } from 'react';
// components
import Page from 'src/components/Page';
import { UserSummariesTable } from 'src/components/admin';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import Page404 from 'src/pages/Page404';
// ----------------------------------------------------------------------

export default function Details() {
  const { role } = useContext(AuthenticatedUser);
  if (role === "Administrator") {
    return (
      <Page title={"User Details | Financial Achievement Club"}>
        <UserSummariesTable/>
      </Page>
    );
  }
  return <Page404/>;
}
