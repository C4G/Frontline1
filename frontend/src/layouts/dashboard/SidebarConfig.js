import React, { useContext } from 'react';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import homeFill from '@iconify/icons-eva/home-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

export default function SidebarConfig() {
  const { user, role } = useContext(AuthenticatedUser);

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

  if (role === "Administrator") {
    // Administrators can view the Courses page, User page, and Savings page.
    return [
      {
        title: 'Course Management',
        path: '/dashboard/courses',
        icon: getIcon(pieChart2Fill)
      },
      {
        title: 'User Details',
        path: '/dashboard/details',
        icon: getIcon(peopleFill)
      },
      {
        title: 'User Management',
        path: '/dashboard/users',
        icon: getIcon(personAddFill)
      },
      {
        title: 'Homepage Management',
        path: '/dashboard/homepage',
        icon: getIcon(homeFill)
      }
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
