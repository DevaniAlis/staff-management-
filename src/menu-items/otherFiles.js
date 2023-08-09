// assets
import { IconKey } from "@tabler/icons";
import {
  IconUser,
  IconSettings2,
  IconCoinRupee,
  IconDoorExit,
} from "@tabler/icons";

// constant
const icons = {
  IconKey,
  IconUser,
  IconSettings2,
  IconCoinRupee,
  IconDoorExit,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const otherFiles = {
  id: "Otherpages",
  title: "Other Pages",
  caption: "Salary , Leave Request",
  type: "group",
  children: [
    {
      id: "authentication",
      title: "Others",
      type: "collapse",
      icon: icons.IconSettings2,

      children: [
        {
          id: "salary",
          title: "Salary",
          type: "item",
          url: "/salary",
          icon: icons.IconCoinRupee,
          breadcrumbs: false,
        },
        {
          id: "leaves",
          title: "Leaves",
          type: "item",
          url: "/leaves",
          icon: icons.IconDoorExit,
          breadcrumbs: false,
        },
      ],
    },
  ],
};

export default otherFiles;
