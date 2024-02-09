import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
export const Menus = [
  {
    title: "Sales Invoice ",
    icon: <FolderSharedOutlinedIcon />,
    type: "main_menu",
    lists: [
      {
        text: "Invoice",
        icon: <ListAltOutlinedIcon />,
        path: "/SalesInvoiceIssues",
      },
      {
        text: "Payment ",
        icon: <PaymentOutlinedIcon />,
        path: "/SalesPaymentIssues",
      },
    ],
  },
  {
    title: "Purchase Invoice ",
    icon: <DriveFolderUploadOutlinedIcon />,
    type: "main_menu",
    lists: [
      {
        text: "Invoice",
        icon: <DriveFolderUploadOutlinedIcon />,
        path: "/PurchaseInvoiceIssues",
      },
      {
        text: "Payment",
        icon: <PaymentOutlinedIcon />,
        path: "/PurchasePaymentIssues",
      },
    ],
  },
  {
    title: "Summery",
    icon: <DashboardCustomizeOutlinedIcon />,
    type: "main_menu",
    lists: [
      {
        text: "Summery",
        icon: <DashboardCustomizeOutlinedIcon />,
        path: "/Summery",
      },
    ],
  },
];
