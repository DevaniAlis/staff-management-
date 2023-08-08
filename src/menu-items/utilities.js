// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Other Page',
  type: 'group',
  children: [
    {
      id: 'icons',
      title: 'Icons',
      type: 'collapse',
      icon: icons.IconWindmill,
      children: [
        {
          id: 'tabler-icons',
          title: 'Tabler Icons',
          type: 'item',
          url: '/icons/tabler-icons',
          breadcrumbs: false
        },
        {
          id: 'material-icons',
          title: 'Material Icons',
          type: 'item',
          external: true,
          target: '_blank',
          url: 'https://mui.com/material-ui/material-icons/',
          breadcrumbs: false
        }
      ]
    },
    // {
    //   id: 'Other',
    //   title: 'Other',
    //   type: 'collapse',
    //   icon: icons.IconWindmill,
    //   children: [
    //     {
    //       id: 'salary',
    //       title: 'Salary',
    //       type: 'item',
    //       url: '/other/salary',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'leaves',
    //       title: 'Leaves',
    //       type: 'item',
    //       url: '/other/leaves',
    //       breadcrumbs: false
    //     }
    //   ]
    // }
  ]
};

export default utilities;
