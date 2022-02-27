import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import jwt_decode from "jwt-decode";

// ----------------------------------------------------------------------

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

export default function sidebarConfig() {
  const userJson = localStorage.getItem("user");
  const user = JSON.parse(userJson);

  if (!user) {
    // If the user is not logged in, they can only "Login" or "Register".
    return [
      {
        title: 'login',
        path: '/login',
        icon: getIcon(lockFill)
      },
      {
        title: 'register',
        path: '/register',
        icon: getIcon(personAddFill)
      },
    ];
  }

  const role = jwt_decode(user.authToken)[ROLE_CLAIM];

  if (role === "Administrator") {
    // Administrators can view the Courses page, User page, and Savings page.
    return [
      {
        title: 'Courses',
        path: '/dashboard/courses',
        icon: getIcon(pieChart2Fill)
      },
      {
        title: 'Savings',
        path: '/dashboard/savings',
        icon: getIcon(shoppingBagFill)
      },
      {
        title: 'Users',
        path: '/dashboard/user',
        icon: getIcon(peopleFill)
      },
    ]
  }

  // Regular users can view the Courses page and Savings page.
  return [
    {
      title: 'Courses',
      path: '/dashboard/courses',
      icon: getIcon(pieChart2Fill)
    },
    {
      title: 'Savings',
      path: '/dashboard/savings',
      icon: getIcon(shoppingBagFill)
    },
  ];
}
