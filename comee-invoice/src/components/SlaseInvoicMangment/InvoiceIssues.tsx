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
  Button,
  TablePagination,
  Modal,
  Card,
  Autocomplete,
  Tabs,
  Tab,
  Typography,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Box,
  CardContent,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ReactToPrint from "react-to-print";
import axios, { AxiosRequestConfig } from "axios";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import { ThemeProvider } from "@mui/material/styles";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import SideBar from "../Drawer";
import invoice from "./invoice";
import issueInvoiceData from "./issueInvoiceData";
import theme from "../../theme";
interface Issue {
  id: string;
  invoice_no: string;
  date_issued: string;
  due_date: string;
  client_id: string;
  pod: string;
  total_price: string;
  customer: string;
  payment_term: string;
  payment_status: string;
  currency: string;
  vessels: string;
  amount: string;
  order_number: string;
  pod_reference_no: string;
  status: string;
  items: any;
  addunit: any;
}
interface filterMesurement {
  client_name_eq: String;
  invoice_no: String;
  status: String;
}
interface Addunit {
  amount: string;
  description: string;
}
const initalAddunit: Addunit[] = [
  {
    description: "",
    amount: "",
  },
];
const intialfilterMesurement: filterMesurement = {
  client_name_eq: "",
  invoice_no: "",
  status: "",
};
const initialIssuesSingleItem: Issue = {
  id: "",
  invoice_no: "Issue 1",
  date_issued: "2022-01-01",
  due_date: "2022-01-01",
  total_price: "100",
  client_id: "123",
  pod: "123",
  customer: "",
  amount: "",
  currency: "",
  vessels: "",
  payment_term: "",
  payment_status: "",
  order_number: "",
  status: "",
  pod_reference_no: "",
  addunit: [],
  items: [
    {
      pos: "",
      invoice: "",
      description: "",
      unit: "",
      quantity: "",
      unit_price: "",
      currency: "",
      total_price: "",
    },
  ],
};
const initialIssuesSingle: Issue[] = [
  {
    id: "",
    invoice_no: "",
    date_issued: "",
    due_date: "",
    total_price: "",
    client_id: "123",
    pod: "123",
    customer: "",
    amount: "",
    currency: "",
    vessels: "",
    payment_term: "",
    payment_status: "",
    order_number: "",
    status: "",
    pod_reference_no: "",
    addunit: [],
    items: [
      {
        pos: "",
        invoice: "",
        description: "",
        unit: "",
        quantity: "",
        unit_price: "",
        currency: "",
        total_price: "",
      },
    ],
  },
];
interface CustomImportMeta extends ImportMeta {
  env: {
    VITE_BASE_URL: string;
    // Add other environment variables as needed
  };
}
const initialIssues: Issue[] = [
  {
    id: "",
    invoice_no: "Issue 1",
    date_issued: "2022-01-01",
    due_date: "2022-01-01",
    total_price: "100",
    client_id: "123",
    pod: "123",
    payment_term: "",
    payment_status: "",
    order_number: "",
    customer: "",
    amount: "",
    currency: "",
    addunit: [],
    vessels: "",
    pod_reference_no: "",
    status: "",
    items: [
      {
        pos: "1",
        invoice: "1",
        description: "itwm",
        unit: "1",
        quantity: "1",
        unit_price: "pc",
        currency: "euro",
        total_price: "1",
      },
    ],
  },
  {
    id: "",
    invoice_no: "Issue 2",
    date_issued: "2022-02-15",
    due_date: "2022-02-15",
    total_price: "150",
    client_id: "124",
    pod: "124",
    customer: "",
    amount: "",
    currency: "",
    vessels: "",
    payment_term: "",
    payment_status: "",
    order_number: "",
    pod_reference_no: "",
    status: "",
    addunit: [],
    items: [
      {
        invoice: "",
        description: "",
        unit: "",
        quantity: "",
        unit_price: "",
      },
    ],
  },
  // Add more issues as needed
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

export default function InvoiceIssues(): JSX.Element {
  const [issues, setIssues] = useState<Issue[]>(invoice);
  const [approvedIssues, setApprovedIssues] = useState<Issue[]>([]);
  const [mainIssues, setMainIssues] = useState<Issue[]>(issueInvoiceData);
  const [closedIssues, setClosedIssues] = useState<Issue[]>([]);
  const [tobeapproved, setTobeapproved] = useState<Issue>({});
  const [SelectedItems, setSelectedItems] = useState<Issue>(
    initialIssuesSingleItem
  );
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedPos, setSelectedPos] = useState<number | null>(null);
  const [selectedInvoiceNo, setSelectedInvoiceNo] = useState<string | null>(
    null
  );

  const [indexdata, setindexdata] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [AddunitItem, setAddunitItem] = useState<Addunit[]>(initalAddunit);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [guidePdf, setGuidePdf] = useState<any>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenPrint, setisModalOpenPrint] = useState<boolean>(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState<boolean>(false);
  const [isModalOpenApprove, setisModalOpenApprove] = useState<boolean>(false);
  const [isModalOpenItemsOnly, setisModalOpenItemsOnly] =
    useState<boolean>(false);
  const [isModalOpenItems, setIsModalOpenItems] = useState<boolean>(false);
  const baseUrl: string = (import.meta as CustomImportMeta).env.VITE_BASE_URL;
  const [value, setValue] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const [filter, setfilter] = useState<filterMesurement>(
    intialfilterMesurement
  );

  const [newIssue, setNewIssue] = useState<Issue>({
    id: "",
    invoice_no: "",
    date_issued: "",
    due_date: "",
    total_price: "",
    client_id: "",
    pod: "",
    customer: "",
    amount: "",
    currency: "",
    vessels: "",
    payment_term: "",
    payment_status: "",
    order_number: "",
    pod_reference_no: "",
    status: "",
    addunit: [],
    items: [],
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  var startIndex = page * rowsPerPage;
  var endIndex = startIndex + rowsPerPage;
  const displayedData = issues.slice(startIndex, endIndex);
  const filterTable = async () => {
    const filteredInvoices = issues.filter((invoice) => {
      const filterByCustomer =
        !selectedCustomer || invoice.customer === selectedCustomer;
      const filterByPos = selectedPos === null || invoice.pos === selectedPos;
      const filterByInvoiceNo =
        !selectedInvoiceNo || invoice.invoice_no === selectedInvoiceNo;

      return filterByCustomer && filterByPos && filterByInvoiceNo;
    });
    // var data = {};

    // var body = {
    //   q: {
    //     client_name_eq: filter.client_name_eq,
    //     invoice_no_eq: filter.invoice_no,
    //     status_eq: filter.status,
    //   },
    // };
    // let config: AxiosRequestConfig = {
    //   method: "POST",
    //   maxBodyLength: Infinity,
    //   data: body,
    //   url: `${baseUrl}/comee_core/customer_orders/filter?page=${
    //     page + 1
    //   }&per_page=${rowsPerPage}`,
    //   headers: {
    //     Accept: "text/plain",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // };
    // await axios
    //   .request(config)
    //   .then((response) => {
    //     setIssues(response.data.data);
    //   })
    //   .catch((error) => {});

    setIssues(filteredInvoices);
  };
  const filterTableApproved = async () => {
    const filteredInvoices = approvedIssues.filter((invoice) => {
      const filterByCustomer =
        !selectedCustomer || invoice.customer === selectedCustomer;
      const filterByPos = selectedPos === null || invoice.pos === selectedPos;
      const filterByInvoiceNo =
        !selectedInvoiceNo || invoice.invoice_no === selectedInvoiceNo;

      return filterByCustomer && filterByPos && filterByInvoiceNo;
    });

    setApprovedIssues(filteredInvoices);
  };
  const handleAddTask = () => {
    setAddunitItem([
      ...AddunitItem,
      {
        description: "",
        amount: "",
      },
    ]);
  };
  const handleRemoveTask = (index) => {
    const updatedTasks = [...AddunitItem];
    updatedTasks.splice(index, 1);
    setAddunitItem(updatedTasks);
  };
  const handleInputChange = (index, key, value) => {
    const updatedTasks = [...AddunitItem];
    updatedTasks[index][key] = value;

    setAddunitItem(updatedTasks);
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
  const allCustomers = Array.from(
    new Set(invoice.map((invoice) => invoice.customer))
  );
  const handlefilterChange = (key, value) => {
    setfilter((prevFilterMeasurement) => ({
      ...prevFilterMeasurement,
      [key]: value,
    }));
  };
  const handleCloseModalEdit = () => {
    setIsModalOpenEdit(false);
  };
  const handleCloseModalAppprove = () => {
    setisModalOpenApprove(false);
  };
  const handleCloseModalItems = () => {
    setIsModalOpenItems(false);
  };
  const handleCloseModalItemsOnly = () => {
    setisModalOpenItemsOnly(false);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleEditIssue = () => {
    const update_item = { ...SelectedItems, addunit: AddunitItem };
    console.log(update_item);
    setIssues((prevInputValues) => {
      const newInputValues = [...prevInputValues];
      newInputValues[indexdata] = update_item;

      return newInputValues;
    });

    handleCloseModalEdit();
  };

  const PrintToPDF = ({}) => {
    const componentRef = useRef();
    var all_total = 0;
    SelectedItems.items.map(
      (issue, index) => (all_total += issue.unit_price * issue.quantity)
    );
    if (SelectedItems.addunit && SelectedItems.addunit.length > 0) {
      SelectedItems.addunit.map(
        (issueunit, index) => (all_total += parseFloat(issueunit.amount))
      );
    }
    return (
      <div>
        <ReactToPrint
          trigger={() => <Button color="primary">Print to PDF</Button>}
          content={() => componentRef.current}
        />
        <Button
          onClick={() => setisModalOpenPrint(false)}
          color="primary"
          variant="contained"
        >
          Close
        </Button>
        <Paper
          ref={componentRef}
          style={{ width: "80vh", padding: "5vh", boxShadow: "none" }}
        >
          <Paper
            sx={{ boxShadow: "none" }}
            style={{
              height: "5vh",
            }}
          >
            <Typography
              variant="h4"
              align="left"
              color={"#05184C"}
              sx={{ backgroundColor: "#a3bdc4" }}
              fontWeight="bold"
            >
              MAVEKO
            </Typography>
          </Paper>
          <Paper style={{ width: "100%", height: "18vh" }}>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={5.5}>
                <Paper style={{ padding: "1px" }}>
                  <Typography style={{ fontSize: 14 }} align="left">
                    RCCL / CCI
                  </Typography>
                </Paper>
                <Paper style={{ padding: "1px" }}>
                  <Typography align="left" style={{ fontSize: 14 }}>
                    ACCOUNTS PAYABLE DEPT.
                  </Typography>
                </Paper>
                <Paper style={{ padding: "1px" }}>
                  <Typography align="left" style={{ fontSize: 14 }}>
                    P. O. BOX 025545
                  </Typography>
                </Paper>
                <Paper style={{ padding: "1px" }}>
                  <Typography align="left" style={{ fontSize: 14 }}>
                    MIAMI, FL 5545 33102
                  </Typography>
                </Paper>
                <Paper style={{ padding: "1px" }}>
                  <Typography align="left" style={{ fontSize: 14 }}>
                    USA
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
              <Grid item xs={12} sm={5.5}>
                <Paper style={{ border: "1px solid #000" }}>
                  <Paper
                    sx={{ boxShadow: "none" }}
                    style={{
                      backgroundColor: "#a3bdc4",
                    }}
                  >
                    <Typography variant="h9" align="left" color={"#05184C"}>
                      INVOICE :
                    </Typography>
                  </Paper>
                  <Paper style={{ padding: "1px" }}>
                    <Typography align="left" style={{ fontSize: 14 }}>
                      No. {SelectedItems.invoice_no}
                    </Typography>
                  </Paper>
                  <Paper style={{ padding: "1px" }}>
                    <Typography align="left" style={{ fontSize: 14 }}>
                      Date :{SelectedItems.date_issued}
                    </Typography>
                  </Paper>
                  <Paper style={{ padding: "1px" }}>
                    <Typography align="left" style={{ fontSize: 14 }}>
                      Customer:{SelectedItems.customer}
                    </Typography>
                  </Paper>
                  <Paper style={{ padding: "1px" }}>
                    <Typography align="left" style={{ fontSize: 14 }}>
                      Assistance:
                    </Typography>
                  </Paper>
                  <Paper style={{ padding: "1px" }}>
                    <Typography align="left" style={{ fontSize: 14 }}>
                      EMail
                    </Typography>
                  </Paper>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
          <Paper style={{ width: "100%", height: "15vh" }}>
            <Typography align="left" style={{ fontSize: 14 }}>
              PO-No.
            </Typography>
            <Typography align="left" style={{ fontSize: 14 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <> Name of Ship:{SelectedItems.vessels} </>
                </div>

                <div>- SHIP STORES IN TRANSIT -</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                ></div>
              </div>
            </Typography>
            <Typography align="left" style={{ fontSize: 14 }}>
              Delivery date{" "}
            </Typography>
            <Typography align="left" style={{ fontSize: 14 }}>
              Delivery address
            </Typography>
            <Typography align="left" style={{ fontSize: 14 }}>
              Voyage No.
            </Typography>
            <Typography align="left" style={{ fontSize: 14 }}>
              Weight/Package
            </Typography>
          </Paper>
          <Paper style={{ width: "100%", height: "50vh" }} variant="elevation">
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
                            width: "auto",
                            height: "3vh",
                            fontSize: 13,
                          }}
                        >
                          pos
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",

                            fontSize: 13,
                          }}
                        >
                          Item number
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",

                            fontSize: 13,
                          }}
                        >
                          Description
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",

                            fontSize: 13,
                          }}
                        >
                          Unit
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",

                            fontSize: 13,
                          }}
                        >
                          Quantity
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",

                            fontSize: 13,
                          }}
                        >
                          Unit price
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",

                            fontSize: 13,
                          }}
                        >
                          {SelectedItems.currency}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {SelectedItems.items.map((issue, index) => (
                        <TableRow key={index}>
                          <TableCell
                            style={{
                              width: "auto",
                              height: "3vh",

                              fontSize: 13,
                            }}
                          >
                            {issue.pos}
                          </TableCell>
                          <TableCell
                            style={{
                              width: "auto",
                              height: "3vh",

                              fontSize: 13,
                            }}
                          >
                            {issue.item_number}
                          </TableCell>
                          <TableCell
                            style={{
                              width: "auto",
                              height: "3vh",

                              fontSize: 13,
                            }}
                          >
                            {issue.description}
                          </TableCell>
                          <TableCell
                            style={{
                              width: "auto",
                              height: "3vh",

                              fontSize: 13,
                            }}
                          >
                            {issue.unit}
                          </TableCell>
                          <TableCell
                            style={{
                              width: "auto",
                              height: "3vh",

                              fontSize: 13,
                            }}
                          >
                            {issue.quantity}
                          </TableCell>
                          <TableCell
                            style={{
                              width: "auto",
                              height: "3vh",

                              fontSize: 13,
                            }}
                          >
                            {issue.unit_price}
                          </TableCell>
                          <TableCell
                            style={{
                              width: "auto",
                              height: "3vh",

                              fontSize: 13,
                            }}
                          >
                            {issue.unit_price * issue.quantity}
                          </TableCell>
                          {}
                        </TableRow>
                      ))}
                      {SelectedItems.addunit &&
                      SelectedItems.addunit.length > 0 ? (
                        <>
                          {SelectedItems.addunit.map((issueunit, index) => (
                            <TableRow key={index}>
                              <TableCell></TableCell>
                              <TableCell>{issueunit.description}</TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell>{issueunit.amount}</TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : (
                        <></>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <> </>
                  </div>

                  <div>
                    <TableCell
                      padding="checkbox"
                      align="left"
                      style={{
                        width: "auto",
                        height: "3vh",
                        color: "#096ac9",
                        fontSize: 13,
                      }}
                    >
                      Total {SelectedItems.currency}: {"   "} {all_total}
                    </TableCell>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <TableCell
              padding="checkbox"
              align="left"
              style={{
                width: "auto",
                height: "3vh",
                color: "#096ac9",
                fontSize: 13,
              }}
            >
              {" "}
              Payment Term:{SelectedItems.payment_term}
            </TableCell>
          </Paper>
        </Paper>
      </div>
    );
  };
  const handleAddIssue = () => {
    setIssues([...issues, newIssue]);
    setNewIssue({
      id: "",
      invoice_no: "",
      date_issued: "",
      due_date: "",
      total_price: "",
      pod: "",
      client_id: "",
      payment_term: "",
      payment_status: "",
      order_number: "",
      customer: "",
      amount: "",
      currency: "",
      vessels: "",
      pod_reference_no: "",
      items: [],
      addunit: [],
      status: "",
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
        <Tab label="Draft" />
        <Tab label="Approved" />
        <Tab label="Open invoices" />
        <Tab label="CloseD invoices" />
      </Tabs>

      <TabPanel value={value} index={0}>
        {isModalOpenPrint ? (
          <>
            <PrintToPDF />
          </>
        ) : (
          <>
            <Card>
              <CardContent>
                <Paper>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Autocomplete
                      value={selectedCustomer}
                      sx={{ width: 200, margin: "1%" }}
                      onChange={(event, newValue) =>
                        setSelectedCustomer(newValue)
                      }
                      options={["", ...allCustomers]}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Customer" />
                      )}
                    />
                    <TextField
                      label="Enter PO"
                      fullWidth
                      sx={{ width: 200, marginLeft: "2%" }}
                      margin="normal"
                      variant="outlined"
                      value={selectedPos || ""}
                      onChange={(e) =>
                        setSelectedPos(e.target.value)
                      }
                    />

                    <Button
                      sx={{ width: 200, margin: "1%" }}
                      size="large"
                      variant="contained"
                      color="primary"
                      onClick={filterTable}
                    >
                      filter
                    </Button>
                    {/* Additional input elements as needed */}
                  </div>
                </Paper>
              </CardContent>
            </Card>
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
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Issue invoice_no
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Cutomer
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Cutomer id
                        </TableCell>

                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Date Issued
                        </TableCell>

                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          PO
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Vessels
                        </TableCell>

                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
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
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Invoice Amount
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayedData.map((issue, index) => (
                        <TableRow key={index}>
                          <TableCell>{issue.invoice_no}</TableCell>
                          <TableCell>{issue.customer}</TableCell>
                          <TableCell>{issue.client_id}</TableCell>

                          <TableCell>{issue.date_issued}</TableCell>

                          <TableCell>{issue.pod_reference_no}</TableCell>

                          <TableCell>{issue.vessels}</TableCell>
                          <TableCell>{issue.currency}</TableCell>
                          <TableCell>{issue.amount}</TableCell>
                          <TableCell
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => {
                                setSelectedItems(issue),
                                  setisModalOpenPrint(true);
                              }}
                            >
                              {" "}
                              <PictureAsPdfOutlinedIcon />
                            </Button>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => {
                                setIsModalOpenEdit(true),
                                  setSelectedItems(issue),
                                  setindexdata(index);
                              }}
                            >
                              {" "}
                              <EditOutlinedIcon />
                            </Button>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => {
                                setTobeapproved(issue);
                                setisModalOpenApprove(true);
                                setindexdata(index);
                              }}
                            >
                              <ArrowUpwardOutlinedIcon />
                            </Button>
                            {/* <Button variant="outlined" color="error">
                          {" "}
                          <ArchiveOutlinedIcon />
                        </Button> */}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={issues.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <>
          {isModalOpenPrint ? (
            <>
              <PrintToPDF />
            </>
          ) : (
            <>
              <Card>
                <CardContent>
                  <Paper>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <Autocomplete
                        value={selectedCustomer}
                        sx={{ width: 200, margin: "1%" }}
                        onChange={(event, newValue) =>
                          setSelectedCustomer(newValue)
                        }
                        options={["", ...allCustomers]}
                        renderInput={(params) => (
                          <TextField {...params} label="Select Customer" />
                        )}
                      />
                      <TextField
                        label="Enter PO"
                        fullWidth
                        sx={{ width: 200, marginLeft: "2%" }}
                        margin="normal"
                        variant="outlined"
                        value={selectedPos || ""}
                        onChange={(e) =>
                          setSelectedPos(Number(e.target.value) || null)
                        }
                      />
                      <TextField
                        label="Enter  Invoice No"
                        fullWidth
                        sx={{ width: 200, marginLeft: "2%" }}
                        margin="normal"
                        variant="outlined"
                        value={selectedInvoiceNo || ""}
                        onChange={(e) =>
                          setSelectedInvoiceNo(e.target.value || null)
                        }
                      />
                      <Button
                        sx={{ width: 200, margin: "2%" }}
                        size="large"
                        variant="contained"
                        color="primary"
                        onClick={filterTableApproved}
                      >
                        filter
                      </Button>
                      {/* Additional input elements as needed */}
                    </div>
                  </Paper>
                </CardContent>
              </Card>
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
                              width: "auto",
                              height: "3vh",
                              color: "#096ac9",
                              fontSize: 16,
                            }}
                          >
                            Issue invoice_no
                          </TableCell>
                          <TableCell
                            padding="checkbox"
                            align="left"
                            style={{
                              width: "auto",
                              height: "3vh",
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
                              width: "auto",
                              height: "3vh",
                              color: "#096ac9",
                              fontSize: 16,
                            }}
                          >
                            Cutomer id
                          </TableCell>

                          <TableCell
                            padding="checkbox"
                            align="left"
                            style={{
                              width: "auto",
                              height: "3vh",
                              color: "#096ac9",
                              fontSize: 16,
                            }}
                          >
                            Date Issued
                          </TableCell>
                          <TableCell
                            padding="checkbox"
                            align="left"
                            style={{
                              width: "auto",
                              height: "3vh",
                              color: "#096ac9",
                              fontSize: 16,
                            }}
                          >
                            Due Date
                          </TableCell>
                          <TableCell
                            padding="checkbox"
                            align="left"
                            style={{
                              width: "auto",
                              height: "3vh",
                              color: "#096ac9",
                              fontSize: 16,
                            }}
                          >
                            PO
                          </TableCell>
                          <TableCell
                            padding="checkbox"
                            align="left"
                            style={{
                              width: "auto",
                              height: "3vh",
                              color: "#096ac9",
                              fontSize: 16,
                            }}
                          >
                            Vessels
                          </TableCell>
                          <TableCell
                            padding="checkbox"
                            align="left"
                            style={{
                              width: "auto",
                              height: "3vh",
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
                              width: "auto",
                              height: "3vh",
                              color: "#096ac9",
                              fontSize: 16,
                            }}
                          >
                            Payment status
                          </TableCell>
                          <TableCell
                            padding="checkbox"
                            align="left"
                            style={{
                              width: "auto",
                              height: "3vh",
                              color: "#096ac9",
                              fontSize: 16,
                            }}
                          >
                            Invoice Amount
                          </TableCell>

                          <TableCell
                            padding="checkbox"
                            align="left"
                            style={{
                              width: "auto",
                              height: "3vh",
                              color: "#096ac9",
                              fontSize: 16,
                            }}
                          >
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {approvedIssues.map((issue, index) => (
                          <TableRow key={index}>
                            <TableCell>{issue.invoice_no}</TableCell>
                            <TableCell>{issue.client_id}</TableCell>
                            <TableCell>{issue.customer}</TableCell>
                            <TableCell>{issue.date_issued}</TableCell>
                            <TableCell>{issue.due_date}</TableCell>

                            <TableCell>{issue.pos}</TableCell>
                            <TableCell>{issue.vessels}</TableCell>
                            <TableCell>{issue.currency}</TableCell>
                            <TableCell>{issue.payment_status}</TableCell>
                            <TableCell>{issue.amount}</TableCell>

                            <TableCell
                              sx={{ display: "flex", flexDirection: "row" }}
                            >
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                  setSelectedItems(issue),
                                    setisModalOpenPrint(true);
                                }}
                              >
                                {" "}
                                <PictureAsPdfOutlinedIcon />
                              </Button>
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                  setSelectedItems(issue);
                                }}
                              >
                                {" "}
                                <EmailOutlinedIcon />
                              </Button>

                              <Button variant="outlined" color="error">
                                {" "}
                                <ArchiveOutlinedIcon />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={issues.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </>
      </TabPanel>
      <TabPanel value={value} index={2}>
        {isModalOpenPrint ? (
          <>
            <PrintToPDF />
          </>
        ) : (
          <>
            <Card>
              <CardContent>
                <Paper>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Autocomplete
                      value={selectedCustomer}
                      sx={{ width: 200, margin: "1%" }}
                      onChange={(event, newValue) =>
                        setSelectedCustomer(newValue)
                      }
                      options={["", ...allCustomers]}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Customer" />
                      )}
                    />
                    <TextField
                      label="Enter PO"
                      fullWidth
                      sx={{ width: 200, marginLeft: "2%" }}
                      margin="normal"
                      variant="outlined"
                      value={selectedPos || ""}
                      onChange={(e) =>
                        setSelectedPos(Number(e.target.value) || null)
                      }
                    />
                    <TextField
                      label="Enter  Invoice No"
                      fullWidth
                      sx={{ width: 200, marginLeft: "2%" }}
                      margin="normal"
                      variant="outlined"
                      value={selectedInvoiceNo || ""}
                      onChange={(e) =>
                        setSelectedInvoiceNo(e.target.value || null)
                      }
                    />

                    <Button
                      sx={{ width: 200, margin: "1%" }}
                      size="large"
                      variant="contained"
                      color="primary"
                      onClick={filterTable}
                    >
                      filter
                    </Button>
                    {/* Additional input elements as needed */}
                  </div>
                </Paper>
              </CardContent>
            </Card>
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
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Issue invoice_no
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Cutomer id
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
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
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Date Issued
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Due Date
                        </TableCell>

                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          PO
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Vessels
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
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
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Invoice Amount
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Amount Recived
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Remaining Balance
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Remark
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mainIssues.map((issue, index) => (
                        <TableRow key={index}>
                          <TableCell>{issue.invoice_no}</TableCell>
                          <TableCell>{issue.client_id}</TableCell>
                          <TableCell>{issue.customer}</TableCell>
                          <TableCell>{issue.date_issued}</TableCell>
                          <TableCell>{issue.due_date}</TableCell>

                          <TableCell>{issue.pos}</TableCell>
                          <TableCell>{issue.vessels}</TableCell>
                          <TableCell>{issue.currency}</TableCell>
                          <TableCell>{issue.payment_status}</TableCell>
                          <TableCell>{issue.amount}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>

                          <TableCell>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => {
                                setSelectedItems(issue),
                                  setisModalOpenPrint(true);
                              }}
                            >
                              {" "}
                              <PictureAsPdfOutlinedIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={issues.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}{" "}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {isModalOpenPrint ? (
          <>
            <PrintToPDF />
          </>
        ) : (
          <>
            <Card>
              <CardContent>
                <Paper>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Autocomplete
                      value={selectedCustomer}
                      sx={{ width: 200, margin: "1%" }}
                      onChange={(event, newValue) =>
                        setSelectedCustomer(newValue)
                      }
                      options={["", ...allCustomers]}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Customer" />
                      )}
                    />
                    <TextField
                      label="Enter PO"
                      fullWidth
                      sx={{ width: 200, marginLeft: "2%" }}
                      margin="normal"
                      variant="outlined"
                      value={selectedPos || ""}
                      onChange={(e) =>
                        setSelectedPos(Number(e.target.value) || null)
                      }
                    />
                    <TextField
                      label="Enter  Invoice No"
                      fullWidth
                      sx={{ width: 200, marginLeft: "2%" }}
                      margin="normal"
                      variant="outlined"
                      value={selectedInvoiceNo || ""}
                      onChange={(e) =>
                        setSelectedInvoiceNo(e.target.value || null)
                      }
                    />

                    <Button
                      sx={{ width: 200, margin: "1%" }}
                      size="large"
                      variant="contained"
                      color="primary"
                      onClick={filterTable}
                    >
                      filter
                    </Button>
                    {/* Additional input elements as needed */}
                  </div>
                </Paper>
              </CardContent>
            </Card>
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
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Issue invoice_no
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Cutomer id
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Payment term
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Date Issued
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Due Date
                        </TableCell>

                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          PO
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Vessels
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
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
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Invoice Amount
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Amount Recived
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Remaining Balance
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Remark
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {closedIssues.map((issue, index) => (
                        <TableRow key={index}>
                          <TableCell>{issue.invoice_no}</TableCell>
                          <TableCell>{issue.client_id}</TableCell>
                          <TableCell>{issue.customer}</TableCell>
                          <TableCell>{issue.date_issued}</TableCell>
                          <TableCell>{issue.due_date}</TableCell>

                          <TableCell>{issue.pos}</TableCell>
                          <TableCell>{issue.vessels}</TableCell>
                          <TableCell>{issue.currency}</TableCell>
                          <TableCell>{issue.payment_status}</TableCell>
                          <TableCell>{issue.amount}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>

                          <TableCell>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => {
                                setSelectedItems(issue),
                                  setisModalOpenPrint(true);
                              }}
                            >
                              {" "}
                              <PictureAsPdfOutlinedIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={issues.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </TabPanel>
      <div>
        <Modal open={isModalOpenItems} onClose={handleCloseModalItems}>
          <Box
            sx={{
              overflow: "scroll",
              position: "absolute",
              width: 1200,
              bgcolor: "background.paper",

              p: 2,
              marginTop: "30%",
              marginLeft: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div style={{ width: 1500, overflow: "scroll" }}>
              <Paper style={{ border: "1px solid #000" }}>
                <Paper
                  sx={{ boxShadow: "none" }}
                  style={{
                    height: "3vh",
                    backgroundColor: "#a3bdc4",
                  }}
                >
                  <Typography
                    variant="h5"
                    align="left"
                    color={"#05184C"}
                    fontWeight="bold"
                  >
                    INVOICE : {SelectedItems.invoice_no}
                  </Typography>
                </Paper>
                <Paper style={{ padding: "5px" }}>
                  <Typography align="left" fontWeight="bold">
                    No. {SelectedItems.client_id}
                  </Typography>
                </Paper>
                <Paper style={{ padding: "5px" }}>
                  <Typography align="left" fontWeight="bold">
                    Date :{SelectedItems.date_issued}
                  </Typography>
                </Paper>
                <Paper style={{ padding: "5px" }}>
                  <Typography align="left" fontWeight="bold">
                    Customer:{SelectedItems.customer}
                  </Typography>
                </Paper>
                <Paper style={{ padding: "5px" }}>
                  <Typography align="left" fontWeight="bold">
                    Assistance:
                  </Typography>
                </Paper>
                <Paper style={{ padding: "5px" }}>
                  <Typography align="left" fontWeight="bold">
                    EMail
                  </Typography>
                </Paper>
              </Paper>
              <Paper style={{ width: "100%" }} variant="elevation">
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
                                width: "auto",
                                height: "3vh",
                                color: "#096ac9",
                                fontSize: 16,
                              }}
                            >
                              Pos
                            </TableCell>
                            <TableCell
                              padding="checkbox"
                              align="left"
                              style={{
                                width: "auto",
                                height: "3vh",
                                color: "#096ac9",
                                fontSize: 16,
                              }}
                            >
                              Description
                            </TableCell>
                            <TableCell
                              padding="checkbox"
                              align="left"
                              style={{
                                width: "auto",
                                height: "3vh",
                                color: "#096ac9",
                                fontSize: 16,
                              }}
                            >
                              Unit
                            </TableCell>
                            <TableCell
                              padding="checkbox"
                              align="left"
                              style={{
                                width: "auto",
                                height: "3vh",
                                color: "#096ac9",
                                fontSize: 16,
                              }}
                            >
                              Quantity
                            </TableCell>
                            <TableCell
                              padding="checkbox"
                              align="left"
                              style={{
                                width: "auto",
                                height: "3vh",
                                color: "#096ac9",
                                fontSize: 16,
                              }}
                            >
                              Unit price
                            </TableCell>
                            <TableCell
                              padding="checkbox"
                              align="left"
                              style={{
                                width: "auto",
                                height: "3vh",
                                color: "#096ac9",
                                fontSize: 16,
                              }}
                            >
                              Total Price
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {SelectedItems.items.map((issue, index) => (
                            <TableRow key={index}>
                              <TableCell>{issue.invoice}</TableCell>
                              <TableCell>{issue.description}</TableCell>
                              <TableCell>{issue.unit}</TableCell>
                              <TableCell>{issue.quantity}</TableCell>
                              <TableCell>{issue.unit_price}</TableCell>
                              <TableCell>{issue.total_price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Paper>
              <div style={{ marginTop: "10%", width: "50%" }}>
                {AddunitItem.map((task, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <TextField
                      label="Description"
                      type="text"
                      value={task.description}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      label="amount"
                      type="number"
                      value={task.amount}
                    />
                  </Box>
                ))}
              </div>
              <TextField
                label="Date issued"
                type="date"
                fullWidth
                margin="normal"
                value={SelectedItems.date_issued}
              />
              <TextField
                label="Payment term"
                type="text"
                fullWidth
                margin="normal"
                value={SelectedItems.payment_term}
              />
            </div>
          </Box>
        </Modal>
        <Modal open={isModalOpenItemsOnly} onClose={handleCloseModalItemsOnly}>
          <Box
            sx={{
              position: "absolute",
              width: 1200,
              bgcolor: "background.paper",
              border: "2px solid #000",
              p: 2,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
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
                            width: "auto",
                            height: "3vh",
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
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          item number
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          description
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Quantity
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Unit
                        </TableCell>

                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
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
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Unit price
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          style={{
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Total Price
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {SelectedItems.items.map((issue, index) => (
                        <TableRow key={index}>
                          <TableCell>{issue.invoice}</TableCell>
                          <TableCell>{issue.Description}</TableCell>
                          <TableCell>{issue.unit}</TableCell>
                          <TableCell>{issue.quantity}</TableCell>
                          <TableCell>{issue.unit_price}</TableCell>
                          <TableCell>{issue.total_price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        </Modal>
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              width: 400,
              bgcolor: "background.paper",

              p: 2,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          ></Box>
        </Modal>
        <Modal
          open={isModalOpenEdit}
          style={{ overflowY: "scroll" }}
          onClose={handleCloseModalEdit}
        >
          <Box
            sx={{
              overflow: "scroll",
              position: "absolute",
              width: "60%",
              bgcolor: "background.paper",

              p: 2,
              marginTop: "5%",
              marginLeft: "20%",
            }}
          >
            <div style={{ width: "100%", overflow: "scroll",overflowY:"auto",gridTemplateColumns:"120px", display:'block' }}>
              <Paper style={{ border: "1px solid #000" }}>
                <Paper
                  sx={{ boxShadow: "none" }}
                  style={{
                    height: "3vh",
                    backgroundColor: "#a3bdc4",
                  }}
                >
                  <Typography
                    variant="h5"
                    align="left"
                    color={"#05184C"}
                    fontWeight="bold"
                  >
                    INVOICE : {SelectedItems.invoice_no}
                  </Typography>
                </Paper>
                <Paper style={{ padding: "2px" }}>
                  <Typography align="left" fontWeight="bold">
                    No. {SelectedItems.client_id}
                  </Typography>
                </Paper>
                <Paper style={{ padding: "2px" }}>
                  <Typography align="left" fontWeight="bold">
                    Date :{SelectedItems.date_issued}
                  </Typography>
                </Paper>
                <Paper style={{ padding: "2px" }}>
                  <Typography align="left" fontWeight="bold">
                    Customer:{SelectedItems.customer}
                  </Typography>
                </Paper>
                <Paper style={{ padding: "2px" }}>
                  <Typography align="left" fontWeight="bold">
                    Assistance:
                  </Typography>
                </Paper>
                <Paper style={{ padding: "2px" }}>
                  <Typography align="left" fontWeight="bold">
                    EMail
                  </Typography>
                </Paper>
              </Paper>
              <Paper
                style={{ marginLeft: "1%", width: "90%" }}
                variant="elevation"
              >
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
                                width: "auto",
                                height: "3vh",
                                color: "#096ac9",
                                fontSize: 16,
                              }}
                            >
                              Pos
                            </TableCell>
                            <TableCell
                              padding="checkbox"
                              align="left"
                              style={{
                                width: "auto",
                                height: "3vh",
                                color: "#096ac9",
                                fontSize: 16,
                              }}
                            >
                              Description
                            </TableCell>
                            <TableCell
                              padding="checkbox"
                              align="left"
                              style={{
                                width: "auto",
                                height: "3vh",
                                color: "#096ac9",
                                fontSize: 16,
                              }}
                            >
                              Unit
                            </TableCell>
                            <TableCell
                              padding="checkbox"
                              align="left"
                              style={{
                                width: "auto",
                                height: "3vh",
                                color: "#096ac9",
                                fontSize: 16,
                              }}
                            >
                              Quantity
                            </TableCell>
                            <TableCell
                              padding="checkbox"
                              align="left"
                              style={{
                                width: "auto",
                                height: "3vh",
                                color: "#096ac9",
                                fontSize: 16,
                              }}
                            >
                              Unit price
                            </TableCell>
                            <TableCell
                              padding="checkbox"
                              align="left"
                              style={{
                                width: "auto",
                                height: "3vh",
                                color: "#096ac9",
                                fontSize: 16,
                              }}
                            >
                              Total Price
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {SelectedItems.items.map((issue, index) => (
                            <TableRow key={index}>
                              <TableCell>{issue.invoice}</TableCell>
                              <TableCell>{issue.description}</TableCell>
                              <TableCell>{issue.unit}</TableCell>
                              <TableCell>{issue.quantity}</TableCell>
                              <TableCell>{issue.unit_price}</TableCell>
                              <TableCell>{issue.total_price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Paper>
              <div style={{ margin: "1%", width: "70%" }}>
                {AddunitItem.map((task, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <TextField
                      label="Description"
                      type="text"
                      value={task.description}
                      onChange={(e) =>
                        handleInputChange(index, "description", e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      label="amount"
                      type="number"
                      value={task.amount}
                      onChange={(e) =>
                        handleInputChange(index, "amount", e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />

                    <Button
                      variant="contained"
                      onClick={() => handleRemoveTask(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <Button
                  style={{ margin: "1%" }}
                  onClick={handleAddTask}
                  variant="contained"
                  sx={{ mr: 1 }}
                >
                  Add Unit
                </Button>
              </div>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  {" "}
                  <TextField
                    label="Payment term"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={SelectedItems.payment_term}
                    onChange={(e) =>
                      setSelectedItems({
                        ...SelectedItems,
                        payment_term: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={2}></Grid>
                <Grid item xs={12} sm={4}>
                  {" "}
                  <TextField
                    label="Date issued"
                    type="date"
                    fullWidth
                    margin="normal"
                    value={SelectedItems.date_issued}
                    onChange={(e) =>
                      setSelectedItems({
                        ...SelectedItems,
                        date_issued: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>

              <Button
                onClick={handleEditIssue}
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
              >
                Update
              </Button>
            </div>
          </Box>
        </Modal>
        <Modal open={isModalOpenApprove} onClose={handleCloseModalAppprove}>
          <Box
            sx={{
              position: "absolute",
              width: 700,
              bgcolor: "background.paper",
              overflowY: "scroll",
              p: 2,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {" "}
            <Card>
              <CardContent>
                <Paper style={{ padding: "5px" }}>
                  <Typography align="left" fontWeight="bold">
                    Do you want to approve this invoice
                  </Typography>
                </Paper>
                <Button
                  variant="contained"
                  color="success"
                  style={{ margin: "3%" }}
                  onClick={() => {
                    setApprovedIssues((approvedIssues) => [
                      ...approvedIssues,
                      tobeapproved,
                    ]),
                      setIssues((prevItems) =>
                        prevItems.filter((_, i) => i !== indexdata)
                      ),
                      setisModalOpenApprove(false);
                  }}
                >
                  Yes
                </Button>{" "}
                <Button
                  variant="contained"
                  color="error"
                  style={{ margin: "3%" }}
                  onClick={() => {
                    setisModalOpenApprove(false);
                  }}
                >
                  No
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Modal>
      </div>
    </SideBar>
  );
}
