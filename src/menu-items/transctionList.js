// assets
import { IconUser, IconArrowsTransferUp } from "@tabler/icons";

// constant
const icons = { IconUser, IconArrowsTransferUp };

// ==============================|| Employee MENU ITEMS ||============================== //

const transaction = {
  id: "transaction",
  title: "transaction",
  type: "group",
  children: [
    {
      id: "transaction",
      title: "Transaction",
      type: "item",
      url: "/transaction",
      icon: icons.IconArrowsTransferUp,
      breadcrumbs: false,
    },
  ],
};

export default transaction;
