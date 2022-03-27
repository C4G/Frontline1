import React, { useContext } from 'react';
// components
import Page from '../components/Page';
import SavingsTable from '../components/SavingsTable';
import UserSavingsTable from '../components/UserSavingsTable';
import { AuthenticatedUser } from 'src/providers/UserProvider';

// ----------------------------------------------------------------------

export default function Savings() {
  const { role } = useContext(AuthenticatedUser);
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
