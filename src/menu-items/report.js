// assets
import { IconClipboardText } from '@tabler/icons';

// constant
const icons = { IconClipboardText };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const report = {
  id: 'report',
  title: 'Report',
  type: 'group',
  children: [
    {
      id: 'report',
      title: 'Report',
      type: 'item',
      url: '/report',
      icon: icons.IconClipboardText,
      breadcrumbs: false
    }
  ]
};

export default report;
