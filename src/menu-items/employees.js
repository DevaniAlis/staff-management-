// assets
import { IconUser } from '@tabler/icons';

// constant
const icons = { IconUser };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const employees = {
  id: 'employeesList',
  title: 'Employees',
  type: 'group',
  children: [
    {
      id: 'employeesList',
      title: 'Employees',
      type: 'item',
      url: '/employeesList',
      icon: icons.IconUser,
      breadcrumbs: false
    }
  ]
};

export default employees;
