// assets
import { IconUser } from '@tabler/icons';

// constant
const icons = { IconUser };

// ==============================|| Employee MENU ITEMS ||============================== //

const staff  = {
  id: 'staff',
  title: 'staff',
  type: 'group',
  children: [
    {
      id: 'staff',
      title: 'Staff',
      type: 'item',
      url: '/staff',
      icon: icons.IconUser,
      breadcrumbs: false
    }
  ]
};

export default staff;
