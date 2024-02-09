import * as React from "react";
const { useState, useRef } = React;
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Paper,
  MenuItem,
  Button,
  TablePagination,
  Modal,
  Tab,
  Tabs,
  Card,
  Typography,
  TextField,
  Box,
  Switch,
  Select,
  CardContent,
  FormControl,
  Autocomplete,
} from "@mui/material";
import axios, { AxiosRequestConfig } from "axios";
import { ThemeProvider } from "@mui/material/styles";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SideBar from "../Drawer";
import invoice from "../SlaseInvoicMangment/invoice";
import theme from "../../theme";
interface Issue {
  id: string;
  invoice_no: string;
  date_issued: string;
  due_date: string;
  payment_order_referance_no: string;
  pod: string;
  amount: string;
  customer: string;
  currency: string;
  bank_referance_no: string;
  order_number: string;
  items: any;
}
interface Invoice {
  client_id: string;
  customer: string;
  DUE: string;
  Status: string;
  invoice_no: string;
  date_issued: string;
  due_date: string;
  pos: number;
  Vessel: string;
  currency: string;
}

interface filterMesurement {
  client_name_eq: String;
  invoice_no: String;
  status: String;
}
interface Addunit {
  Invoices: string;
  po_number: string;
  invoice_number: string;
  amount: string;
  remark: string;
}
interface Addunitpo {
  po_number: string;
}
interface Addinvoice {
  po_number: string;
  invoice_number: string;
}
interface Podata {
  po_number: string;
  invoice_number: string;
  amount: string;
  remark: string;
}
const initalAddunit: Addunit[] = [
  {
    Invoices: "",
    po_number: "",
    invoice_number: "",
    amount: "",
    remark: "",
  },
];
const initalAddunitpo: Addunitpo[] = [
  {
    po_number: "10",
  },
];
const initalAddunitinvoice: Addinvoice[] = [
  {
    po_number: "10",
    invoice_number: "1",
  },
  {
    po_number: "10",
    invoice_number: "2",
  },
];
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const intialfilterMesurement: filterMesurement = {
  client_name_eq: "",
  invoice_no: "",
  status: "",
};
const initialIssuesSingle: Issue = {
  id: "",
  invoice_no: "Issue 1",
  date_issued: "",
  due_date: "",
  amount: "100",
  payment_order_referance_no: "123",
  pod: "",
  customer: "",
  currency: "",
  bank_referance_no: "",
  order_number: "",
  items: [{}],
};

const initialIssues: Issue[] = [
  {
    id: "",
    invoice_no: "Issue 1",
    date_issued: "",
    due_date: "",
    amount: "100",
    payment_order_referance_no: "123",
    pod: "123",
    currency: "",
    customer: "",
    bank_referance_no: "",
    order_number: "",
    items: [],
  },
  {
    id: "",
    invoice_no: "Issue 2",
    date_issued: "",
    due_date: "",
    amount: "150",
    payment_order_referance_no: "124",
    pod: "124",
    currency: "",
    customer: "",
    bank_referance_no: "",
    order_number: "",
    items: [
      {
        payment_type: "invoice",
        list: [],
      },
    ],
  },

  // Add more issues as needed
];
interface CustomImportMeta extends ImportMeta {
  env: {
    VITE_BASE_URL: string;
    // Add other environment variables as needed
  };
}

const initialIssuesOnselect: Issue = {
  id: "",
  invoice_no: "Issue 1",
  date_issued: "",
  due_date: "",
  amount: "100",
  payment_order_referance_no: "123",
  pod: "123",
  currency: "",
  customer: "",
  bank_referance_no: "",
  order_number: "",
  items: [
    {
      pos: "1",
      Invoices: "1",
      description: "itwm",
      unit: "1",
      quantity: "1",
      unit_price: "pc",
      currency: "euro",
      total_price: "1",
    },
  ],
};
const categorizedInvoicesByCustomer = (
  Invoices: Invoice[],
  selectedCustomer
) => {
  console.log("selectedCustomer", selectedCustomer);
  const customerInvoices = selectedCustomer
    ? invoice.filter(
        (invoice_data) => invoice_data.customer === selectedCustomer
      )
    : invoice;

  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setDate(today.getDate() - 30);
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setDate(today.getDate() - 60);
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setDate(today.getDate() - 90);

  const current = customerInvoices.filter((invoice) => {
    const dueDate = new Date(invoice.due_date);
    return dueDate > today;
  });

  const within30Days = customerInvoices.filter((invoice) => {
    const dueDate = new Date(invoice.due_date);
    return dueDate > oneMonthAgo && dueDate <= today;
  });

  const within60Days = customerInvoices.filter((invoice) => {
    const dueDate = new Date(invoice.due_date);
    return dueDate > twoMonthsAgo && dueDate <= oneMonthAgo;
  });

  const within90Days = customerInvoices.filter((invoice) => {
    const dueDate = new Date(invoice.due_date);
    return dueDate > threeMonthsAgo && dueDate <= twoMonthsAgo;
  });

  const moreThan90Days = customerInvoices.filter((invoice) => {
    const dueDate = new Date(invoice.due_date);
    return dueDate <= threeMonthsAgo;
  });

  return {
    current,
    within30Days,
    within60Days,
    within90Days,
    moreThan90Days,
  };
};
const categorizeInvoices = (invoices: Invoice[]) => {
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setDate(today.getDate() - 30);
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setDate(today.getDate() - 60);
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setDate(today.getDate() - 90);

  const current = invoices.filter((invoice) => {
    const dueDate = new Date(invoice.due_date);
    return dueDate > today;
  });
  const within30Days = invoices.filter((invoice) => {
    const dueDate = new Date(invoice.due_date);
    return dueDate > oneMonthAgo && dueDate <= today;
  });

  const within60Days = invoices.filter((invoice) => {
    const dueDate = new Date(invoice.due_date);
    return dueDate > twoMonthsAgo && dueDate <= oneMonthAgo;
  });
  const within90Days = invoices.filter((invoice) => {
    const dueDate = new Date(invoice.due_date);
    return dueDate > threeMonthsAgo && dueDate <= twoMonthsAgo;
  });

  const moreThan90Days = invoices.filter((invoice) => {
    const dueDate = new Date(invoice.due_date);
    return dueDate <= threeMonthsAgo;
  });

  return {
    current,
    within30Days,
    within60Days,
    moreThan90Days,
    within90Days,
  };
};
export default function PaymentIssues(): JSX.Element {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  initalAddunitinvoice;
  const [addunits, setAddunits] = useState<Addunit[]>(initalAddunit);
  const [addunitsInvoice, setAddunitsInvoice] =
    useState<Addinvoice[]>(initalAddunitinvoice);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>();
  const [addunitsop, setAddunitsop] = useState<Addunitpo[]>(initalAddunitpo);
  const [filter, setfilter] = useState<filterMesurement>(
    intialfilterMesurement
  );

  const categorizedInvoices = categorizeInvoices(invoice);
  const allCustomers = Array.from(
    new Set(invoice.map((invoice) => invoice.customer))
  );
  const [value, setValue] = useState(0);

  const [valueInside, setValueInside] = useState(0);
  const [SelectedItems, setSelectedItems] =
    useState<Issue>(initialIssuesSingle);
  const baseUrl: string = (import.meta as CustomImportMeta).env.VITE_BASE_URL;
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [guidePdf, setGuidePdf] = useState<any>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState<boolean>(false);
  const [isModalOpeninvoiceItem, setIsModalOpeninvoiceItem] =
    useState<boolean>(false);
  const [isModalOpenItems, setIsModalOpenItems] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [newIssue, setNewIssue] = useState<Issue>({
    id: "",
    invoice_no: "",
    date_issued: "",
    due_date: "",
    amount: "",
    payment_order_referance_no: "",
    pod: "",
    currency: "",
    customer: "",
    bank_referance_no: "",
    order_number: "",
    items: [],
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const categorizedInvoicesByCustomerData = categorizedInvoicesByCustomer(
    invoice,
    selectedCustomer
  );
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  const handleChangeInside = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setValueInside(newValue);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const filterTable = async () => {
    var data = {};

    var body = {
      q: {
        client_name_eq: filter.client_name_eq,
        invoice_no_eq: filter.invoice_no,
        status_eq: filter.status,
      },
    };
    let config: AxiosRequestConfig = {
      method: "POST",
      maxBodyLength: Infinity,
      data: body,
      url: `${baseUrl}/comee_core/customer_orders/filter?page=${
        page + 1
      }&per_page=${rowsPerPage}`,
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    await axios
      .request(config)
      .then((response) => {
        setIssues(response.data.data);
      })
      .catch((error) => {});
  };
  const handleAddTask = () => {
    setAddunits([
      ...addunits,
      {
        Invoices: "",
        po_number: "",
        invoice_number: "",
        amount: "",
        remark: "",
      },
    ]);
  };
  const handleInputChange = (index, key, value) => {
    const updatedTasks = [...addunits];
    updatedTasks[index][key] = value;

    setAddunits(updatedTasks);
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = [...addunits];
    updatedTasks.splice(index, 1);
    setAddunits(updatedTasks);
  };
  const handleFileChange = (event) => {
    // Assuming only one file is selected
    const file = event.target.files[0];

    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const dataUrl = fileReader.result;
        setGuidePdf(dataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };
  const handlefilterChange = (key, value) => {
    setfilter((prevFilterMeasurement) => ({
      ...prevFilterMeasurement,
      [key]: value,
    }));
  };
  const handleCloseModalEdit = () => {
    setIsModalOpenEdit(false);
  };
  const handleCloseModalItems = () => {
    setIsModalOpenItems(false);
  };

  const handleEdiiIssue = () => {
    handleCloseModalEdit();
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  var firstdays = 0;
  {
    categorizedInvoicesByCustomerData.within30Days.map(
      (issue, index) => (firstdays += parseInt(issue.amount))
    );
  }
  var cuurentamount = 0;
  {
    categorizedInvoicesByCustomerData.current.map(
      (issue, index) => (cuurentamount += parseInt(issue.amount))
    );
  }
  var seconddays = 0;
  {
    categorizedInvoicesByCustomerData.within60Days.map(
      (issue, index) => (seconddays += parseInt(issue.amount))
    );
  }
  var thirddays = 0;
  {
    categorizedInvoicesByCustomerData.within90Days.map(
      (issue, index) => (thirddays += parseInt(issue.amount))
    );
  }
  var fourthdays = 0;
  {
    categorizedInvoicesByCustomerData.moreThan90Days.map(
      (issue, index) => (fourthdays += parseInt(issue.amount))
    );
  }

  const handleAddIssue = () => {
    setIssues([...issues, newIssue]);
    setNewIssue({
      id: "",
      invoice_no: "",
      date_issued: "",
      due_date: "",
      amount: "",
      currency: "",
      pod: "",
      payment_order_referance_no: "",
      customer: "",
      bank_referance_no: "",
      order_number: "",
      items: [],
    });
    handleCloseModal();
  };

  return (
    <SideBar title="Invoice issues">
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
      >
        {" "}
        <Tab label="Report" />
        <Tab label="Aged report" />
        <Tab label="Collected price" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Autocomplete
          value={selectedCustomer}
          sx={{ margin: "2%" }}
          onChange={(event, newValue) => {
            setSelectedCustomer(newValue);
            console.log(newValue);
          }}
          options={["", ...allCustomers]}
          renderInput={(params) => (
            <TextField {...params} label="Select Customer" />
          )}
        />
        <div></div>
        <Grid container spacing={2} margin={"auto"}>
          <Grid item xs={12} sm={5}>
            <Card>
              <CardContent>
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  Current
                </Typography>
                <Typography component="h4">
                  Invoices: {categorizedInvoicesByCustomerData.current.length}{" "}
                </Typography>
                <Typography component="h4">Amount:{cuurentamount}</Typography>

                <Button
                  variant="outlined"
                  style={{ margin: "3%" }}
                  color="success"
                  onClick={() => {
                    setValueInside(0);
                  }}
                >
                  view
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={5}>
            {" "}
            <Card style={{ border: 2 }}>
              <CardContent>
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  Over Due
                </Typography>
                <Typography component="h4">
                  Invoices:{" "}
                  {categorizedInvoicesByCustomerData.within30Days.length +
                    categorizedInvoicesByCustomerData.within60Days.length +
                    categorizedInvoicesByCustomerData.within90Days.length +
                    categorizedInvoicesByCustomerData.moreThan90Days
                      .length}{" "}
                </Typography>
                <Typography component="h4">
                  Amount:{fourthdays + seconddays + thirddays + fourthdays}
                </Typography>

                <Button
                  variant="outlined"
                  style={{ margin: "3%" }}
                  color="success"
                  onClick={() => {
                    setValueInside(1);
                  }}
                >
                  view
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={1} margin={"auto"}>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  1-30 days
                </Typography>
                <Typography component="h4">
                  Invoices:{" "}
                  {categorizedInvoicesByCustomerData.within30Days.length}{" "}
                </Typography>
                <Typography component="h4">Amount:{firstdays}</Typography>

                <Button
                  variant="outlined"
                  style={{ margin: "3%" }}
                  color="success"
                  onClick={() => {
                    setValueInside(1);
                  }}
                >
                  view
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                   30- 60 days
                </Typography>
                <Typography component="h4">
                  Invoices:
                  {categorizedInvoicesByCustomerData.within60Days.length}
                </Typography>
                <Typography component="h4">Amount:{seconddays}</Typography>
                <Button
                  variant="outlined"
                  style={{ margin: "3%" }}
                  color="success"
                  onClick={() => {
                    setValueInside(2);
                  }}
                >
                  view
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                 60-90 days
                </Typography>
                <Typography component="h4">
                Invoices  {categorizedInvoicesByCustomerData.within90Days.length}
                </Typography>
                <Typography component="h4"> Amount:{thirddays}</Typography>
                <Button
                  variant="outlined"
                  style={{ margin: "3%" }}
                  color="success"
                  onClick={() => {
                    setValueInside(3);
                  }}
                >
                  view
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                 90+ days
                </Typography>
                <Typography component="h4">
                Invoices   {categorizedInvoicesByCustomerData.moreThan90Days.length}
                </Typography>
                <Typography component="h4"> Amount:{fourthdays}</Typography>
                <Button
                  variant="outlined"
                  style={{ margin: "3%" }}
                  color="success"
                  onClick={() => {
                    setValueInside(4);
                  }}
                >
                  view
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Tabs
          value={valueInside}
          onChange={handleChangeInside}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="current" />
          <Tab label="1-30" />
          <Tab label="31-60" />
          <Tab label="61-90" />
          <Tab label="90+" />
        </Tabs>
        <TabPanel value={valueInside} index={0}>
          {" "}
          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Customer id
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Customer
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Due date
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        POS
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Vessel
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Currency
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Invoice
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categorizedInvoicesByCustomerData.current.map(
                      (issue, index) => (
                        <TableRow key={index}>
                          <TableCell>{issue.client_id}</TableCell>
                          <TableCell>{issue.customer}</TableCell>
                          <TableCell>{issue.due_date}</TableCell>
                          <TableCell>{issue.pos}</TableCell>
                          <TableCell>{issue.Vessel}</TableCell>
                          <TableCell>{issue.currency}</TableCell>
                          <TableCell>{issue.amount}</TableCell>
                          <TableCell>{issue.invoice_no}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel value={valueInside} index={1}>
          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Customer id
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Customer
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Due date
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        POS
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Vessel
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Currency
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Invoice
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categorizedInvoicesByCustomerData.within30Days.map(
                      (issue, index) => (
                        <TableRow key={index}>
                          <TableCell>{issue.client_id}</TableCell>
                          <TableCell>{issue.customer}</TableCell>
                          <TableCell>{issue.due_date}</TableCell>
                          <TableCell>{issue.pos}</TableCell>
                          <TableCell>{issue.Vessel}</TableCell>
                          <TableCell>{issue.currency}</TableCell>
                          <TableCell>{issue.amount}</TableCell>
                          <TableCell>{issue.invoice_no}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel value={valueInside} index={2}>
          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Customer id
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Customer
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Due date
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        POS
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Vessel
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Currency
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Invoice
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categorizedInvoicesByCustomerData.within60Days.map(
                      (issue, index) => (
                        <TableRow key={index}>
                          <TableCell>{issue.client_id}</TableCell>
                          <TableCell>{issue.customer}</TableCell>
                          <TableCell>{issue.due_date}</TableCell>
                          <TableCell>{issue.pos}</TableCell>
                          <TableCell>{issue.Vessel}</TableCell>
                          <TableCell>{issue.currency}</TableCell>
                          <TableCell>{issue.amount}</TableCell>
                          <TableCell>{issue.invoice_no}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel value={valueInside} index={3}>
          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Customer id
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Customer
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Due date
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        POS
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Vessel
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Currency
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Invoice
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categorizedInvoicesByCustomerData.within90Days.map(
                      (issue, index) => (
                        <TableRow key={index}>
                          <TableCell>{issue.client_id}</TableCell>
                          <TableCell>{issue.customer}</TableCell>
                          <TableCell>{issue.due_date}</TableCell>
                          <TableCell>{issue.pos}</TableCell>
                          <TableCell>{issue.Vessel}</TableCell>
                          <TableCell>{issue.currency}</TableCell>
                          <TableCell>{issue.amount}</TableCell>
                          <TableCell>{issue.invoice_no}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel value={valueInside} index={4}>
          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Customer id
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Customer
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Due date
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        POS
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Vessel
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Currency
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        align="left"
                        style={{
                          width: "15%",
                          height: "5vh",
                          color: "#096ac9",
                          fontSize: 16,
                        }}
                      >
                        Invoice
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categorizedInvoices.moreThan90Days.map((issue, index) => (
                      <TableRow key={index}>
                        <TableCell>{issue.client_id}</TableCell>
                        <TableCell>{issue.customer}</TableCell>
                        <TableCell>{issue.due_date}</TableCell>
                        <TableCell>{issue.pos}</TableCell>
                        <TableCell>{issue.Vessel}</TableCell>
                        <TableCell>{issue.currency}</TableCell>
                        <TableCell>{issue.amount}</TableCell>
                        <TableCell>{issue.invoice_no}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Autocomplete
          value={selectedCustomer}
          onChange={(event, newValue) => {
            setSelectedCustomer(newValue);
            console.log(newValue);
          }}
          options={["", ...allCustomers]}
          renderInput={(params) => (
            <TextField {...params} label="Select Customer" />
          )}
        />
        <Grid container spacing={1}>
          <Grid item xs={12} sm={5}>
            {" "}
            <Card>
              <CardContent>
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  Total number of Invoices
                </Typography>
                <Typography component="h4">
                  {categorizedInvoicesByCustomerData.current.length +
                    categorizedInvoicesByCustomerData.within30Days.length +
                    categorizedInvoicesByCustomerData.within60Days.length +
                    categorizedInvoicesByCustomerData.within90Days.length +
                    categorizedInvoicesByCustomerData.moreThan90Days
                      .length}{" "}
                </Typography>
                <Typography component="h4">
                  Amount:
                  {cuurentamount +
                    firstdays +
                    seconddays +
                    thirddays +
                    fourthdays}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  Current
                </Typography>
                <Typography component="h4">
                  Invoices: {categorizedInvoicesByCustomerData.current.length}{" "}
                </Typography>
                <Typography component="h4">Amount:{cuurentamount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            {" "}
            <Card>
              <CardContent>
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  Over Due
                </Typography>
                <Typography component="h4">
                  Invoices:{" "}
                  {categorizedInvoicesByCustomerData.within30Days.length +
                    categorizedInvoicesByCustomerData.within60Days.length +
                    categorizedInvoicesByCustomerData.within90Days.length +
                    categorizedInvoicesByCustomerData.moreThan90Days
                      .length}{" "}
                </Typography>
                <Typography component="h4">
                  Amount:{fourthdays + seconddays + thirddays + fourthdays}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      Customer id
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      Customer
                    </TableCell>

                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      Balance Due
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      Current
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      1-30
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      31-60
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      61-90
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      90+
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categorizedInvoicesByCustomerData.within30Days &&
                    selectedCustomer !== null && (
                      <TableRow>
                        <TableCell>
                          {/* {
                            categorizedInvoicesByCustomerData.within30Days[0]
                              .client_id
                          } */}
                        </TableCell>
                        <TableCell>
                          {/* {
                            categorizedInvoicesByCustomerData.within30Days[0]
                              .customer
                          } */}
                        </TableCell>
                        <TableCell>
                          {firstdays + seconddays + thirddays + fourthdays}
                        </TableCell>
                        <TableCell>{cuurentamount}</TableCell>
                        <TableCell>{firstdays}</TableCell>
                        <TableCell>{seconddays}</TableCell>
                        <TableCell>{thirddays}</TableCell>
                        <TableCell>{fourthdays}</TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div style={{margin:"2%"}}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <Autocomplete
                value={selectedCustomer}
                sx={{ width: "100%" }}
                onChange={(event, newValue) => {
                  setSelectedCustomer(newValue);
                  console.log(newValue);
                }}
                options={["", ...allCustomers]}
                renderInput={(params) => (
                  <TextField {...params} label="Select Customer" />
                )}
              />
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12} sm={2}>
                <DatePicker
                  label=" Start "
                  value={startDate}
                  onChange={handleStartDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{ "& input": { fontSize: "0.75rem" } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <DatePicker
                  label=" End "
                  value={endDate}
                  onChange={handleEndDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{ "& input": { fontSize: "0.75rem" } }}
                    />
                  )}
                />
              </Grid>
            </LocalizationProvider>
          </Grid>
        </div>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={5}>
            {" "}
            <Card>
              <CardContent>
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  Total number of Invoices
                </Typography>
                <Typography component="h4">
                  {categorizedInvoicesByCustomerData.current.length +
                    categorizedInvoicesByCustomerData.within30Days.length +
                    categorizedInvoicesByCustomerData.within60Days.length +
                    categorizedInvoicesByCustomerData.within90Days.length +
                    categorizedInvoicesByCustomerData.moreThan90Days
                      .length}{" "}
                </Typography>
                <Typography component="h4">
                  Amount:
                  {cuurentamount +
                    firstdays +
                    seconddays +
                    thirddays +
                    fourthdays}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  Current
                </Typography>
                <Typography component="h4">
                  Invoices: {categorizedInvoicesByCustomerData.current.length}{" "}
                </Typography>
                <Typography component="h4">Amount:{cuurentamount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            {" "}
            <Card>
              <CardContent>
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  Over Due
                </Typography>
                <Typography component="h4">
                  Invoices:{" "}
                  {categorizedInvoicesByCustomerData.within30Days.length +
                    categorizedInvoicesByCustomerData.within60Days.length +
                    categorizedInvoicesByCustomerData.within90Days.length +
                    categorizedInvoicesByCustomerData.moreThan90Days
                      .length}{" "}
                </Typography>
                <Typography component="h4">
                  Amount:{fourthdays + seconddays + thirddays + fourthdays}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      Customer id
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      Customer
                    </TableCell>

                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      Balance Due
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      Current
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      1-30
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      31-60
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      61-90
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "15%",
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      90+
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categorizedInvoicesByCustomerData.within30Days &&
                    selectedCustomer !== null && (
                      <TableRow>
                        <TableCell>
                          {
                            categorizedInvoicesByCustomerData.within30Days[0]
                              .client_id
                          }
                        </TableCell>
                        <TableCell>
                          {
                            categorizedInvoicesByCustomerData.within30Days[0]
                              .customer
                          }
                        </TableCell>
                        <TableCell>
                          {firstdays + seconddays + thirddays + fourthdays}
                        </TableCell>
                        <TableCell>{cuurentamount}</TableCell>
                        <TableCell>{firstdays}</TableCell>
                        <TableCell>{seconddays}</TableCell>
                        <TableCell>{thirddays}</TableCell>
                        <TableCell>{fourthdays}</TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>
    </SideBar>
  );
}
