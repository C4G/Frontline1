// components
import Page from '../components/Page';
import WelcomeMessages from 'src/components/admin/WelcomeMessages';
import ClassSchedule from 'src/components/admin/ClassSchedule';
//
// ----------------------------------------------------------------------

export default function User() {
  return (
    <Page title="Manage Homepage | Financial Achievement Club">
      <WelcomeMessages />
      <br/>
      <br/>
      <br/>
      <ClassSchedule />
    </Page>
  );
}
