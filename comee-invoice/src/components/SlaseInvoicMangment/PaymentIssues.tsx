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
  Card,
  Tabs,
  Tab,
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
import theme from "../../theme";
import invoice from "./invoice";
import issueInvoiceData from "./issueInvoiceData";
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

interface filterMesurement {
  client_name_eq: String;
  invoice_no: String;
  status: String;
}
interface Addunit {
  invoice: string;
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
    invoice: "",
    po_number: "0",
    invoice_number: "0",
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
  amount: "22",
  payment_order_referance_no: "123",
  pod: "123",
  currency: "EUR",
  customer: "",
  bank_referance_no: "",
  order_number: "",
  items: [
    {
      pos: "1",
      invoice: "1",
      item_number: "2022-104712",
      description: "itwm",
      unit: "1",
      quantity: "1",
      unit_price: "pc",
      currency: "euro",
      total_price: "1",
    },
    {
      pos: "1",
      invoice: "1",
      item_number: "2022-104712",
      description: "itwm",
      unit: "1",
      quantity: "1",
      unit_price: "pc",
      currency: "euro",
      total_price: "10",
    },
    {
      pos: "1",
      invoice: "1",
      item_number: "2022-104712",
      description: "itwm",
      unit: "1",
      quantity: "1",
      unit_price: "pc",
      currency: "euro",
      total_price: "20",
    },
  ],
};
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
export default function PaymentIssues(): JSX.Element {
  const [issues, setIssues] = useState<Issue[]>([]);
  initalAddunitinvoice;
  const [issuesCollection, setIssuesCollection] = useState<Issue[]>([]);
  initalAddunitinvoice;
  const [addunits, setAddunits] = useState<Addunit[]>([...initalAddunit]);
  const [addunitsInvoice, setAddunitsInvoice] =
    useState<Addinvoice[]>(initalAddunitinvoice);
  const [addunitsop, setAddunitsop] = useState<Addunitpo[]>(initalAddunitpo);
  const [filter, setfilter] = useState<filterMesurement>(
    intialfilterMesurement
  );

  const [SelectedItems, setSelectedItems] =
    useState<Issue>(initialIssuesSingle);
  const [SelectedItemsView, setSelectedItemsView] =
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
  const [isModalOpenItemsCollection, setIsModalOpenItemsCollection] =
    useState<boolean>(false);
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
    bank_referance_no: "pending",
    order_number: "",
    items: [],
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  var runingTotal = 0;
  addunits.map((task, index) => (runingTotal += parseInt(task.amount)));
  const allCustomers = Array.from(
    new Set(issueInvoiceData.map((invoice) => invoice.customer))
  );
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedPos, setSelectedPos] = useState<number | null>(null);
  const [selectedInvoiceNo, setSelectedInvoiceNo] = useState<string | null>(
    null
  );

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const [value, setValue] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
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
        // setIssues(response.data.data);
      })
      .catch((error) => {});
  };
  const handleAddTask = () => {
    setAddunits([
      ...addunits,
      {
        invoice: "",
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
  const [selectedValueAuto, setSelectedValueAuto] = useState("");
  const handleAutocompleteChangeAuto = (event, newValue) => {
    setSelectedValueAuto(newValue);
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
  const handleCloseModalItemsCollection = () => {
    setIsModalOpenItemsCollection(false);
  };
  const [indexdata, setindexdata] = useState<number>(0);
  const handleEdiiIssue = () => {
    const update_item = { ...SelectedItems, addunit: addunits };
    console.log(update_item);
    setIssues((prevInputValues) => {
      const newInputValues = [...prevInputValues];
      newInputValues[indexdata] = update_item;

      return newInputValues;
    });

    handleCloseModalEdit();
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddIssue = () => {
    // setIssues([...issues, newIssue]);
    setIssues((prevItems) => [...prevItems, newIssue]);
    setTimeout(() => {
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
    }, 20);

    handleCloseModal();
  };

  return (
    <SideBar title="Payment">
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Incoming Payment " />
        <Tab label="Collection" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <div>
          <Button
            onClick={handleOpenModal}
            variant="outlined"
            style={{ margin: "20px" }}
          >
            Add Payment
          </Button>
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
                    label=""
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
                    label=""
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
                        Date
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
                        Bank referance no
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
                        Payment referance no
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
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {issues.map((issue, index) => (
                      <TableRow key={index}>
                        <TableCell>{issue.customer}</TableCell>
                        <TableCell>{issue.amount}</TableCell>
                        <TableCell>{issue.date_issued}</TableCell>
                        <TableCell>{issue.bank_referance_no}</TableCell>
                        <TableCell>{issue.currency}</TableCell>
                        <TableCell>
                          {issue.payment_order_referance_no}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              setSelectedItems(issue), setIsModalOpenEdit(true);
                              setindexdata(index);
                            }}
                          >
                            <EditOutlinedIcon />
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              // const itemsForCustomer = issueInvoiceData.flatMap(

                              //   (purchase) => {
                              //     console.log('purchase',purchase);
                              //     if (purchase.customer === issue.customer) {
                              //       return purchase;
                              //     }
                              //     return [];
                              //   }
                              // );
                              // console.log('itemsForCustomer',itemsForCustomer);
                              setSelectedItems(issue);

                              setIsModalOpenItems(true);
                              if (issue.customer === "APOLLO EXPORT OCEANIA") {
                                setAddunitsop([
                                  {
                                    po_number: "2",
                                  },
                                ]),
                                  setAddunitsInvoice([
                                    {
                                      po_number: "2",
                                      invoice_number: "2022-104712",
                                    },
                                  ]);
                                console.log(addunitsInvoice);
                              } else {
                                setAddunitsop([
                                  {
                                    po_number: "1",
                                  },
                                ]),
                                  console.log(addunitsInvoice),
                                  setAddunitsInvoice([
                                    {
                                      po_number: "1",
                                      invoice_number: "2023-10494",
                                    },
                                  ]);
                              }
                            }}
                          >
                            <AddBoxOutlinedIcon />
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
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div>
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
                    label=""
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
                    label=""
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
                        Date
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
                        Bank referance no
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
                        Payment referance no
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
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {issuesCollection.map((issue, index) => (
                      <TableRow key={index}>
                       { console.log(issue)}
                        <TableCell>{issue.customer}</TableCell>
                        <TableCell>{issue.amount}</TableCell>
                        <TableCell>{issue.date_issued}</TableCell>
                        <TableCell>{issue.bank_referance_no}</TableCell>
                        <TableCell>{issue.currency}</TableCell>
                        <TableCell>
                          {issue.payment_order_referance_no}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              setSelectedItems(issue);
                              setIsModalOpenItemsCollection(true);
                            }}
                          >
                            <AddBoxOutlinedIcon />
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
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </TabPanel>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            width: 800,
            bgcolor: "background.paper",
            border: "2px solid #000",
            p: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6" component="div" color="primary">
            Add New Payment
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {" "}
              <Autocomplete

                sx={{ width: 370, marginTop: "4%" }}
                onChange={(event, newValue) => {
                  setSelectedCustomer(newValue),
                    setNewIssue({ ...newIssue, customer: newValue });
                }}
                options={["", ...allCustomers]}
                renderInput={(params) => (
                  <TextField {...params} label="Select Customer" />
                )}
              />
              <TextField
                label="Date "
                type="date"
                fullWidth
                margin="normal"
                value={newIssue.date_issued}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, date_issued: e.target.value })
                }
              />
              <TextField
                label="amount"
                type="number"
                fullWidth
                margin="normal"
                value={newIssue.amount}
                onChange={(e) =>
                  setNewIssue({
                    ...newIssue,
                    amount: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Bank referance no"
                type="text"
                fullWidth
                margin="normal"
                value={newIssue.bank_referance_no}
                onChange={(e) =>
                  setNewIssue({
                    ...newIssue,
                    bank_referance_no: e.target.value,
                  })
                }
              />
              <TextField
                label="Currency"
                type="text"
                fullWidth
                margin="normal"
                value={newIssue.currency}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, currency: e.target.value })
                }
              />
              <TextField
                label="Payment referance no"
                type="text"
                fullWidth
                margin="normal"
                value={newIssue.payment_order_referance_no}
                onChange={(e) =>
                  setNewIssue({
                    ...newIssue,
                    payment_order_referance_no: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>

          <Button
            onClick={handleAddIssue}
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Save
          </Button>
        </Box>
      </Modal>
      <Modal open={isModalOpenItems} onClose={handleCloseModalItems}>
        <Box
          sx={{
            position: "absolute",
            width: "90%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            p: 2,
            top: "10%",
            left: "5%",
          }}
        >
          <div>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mb={2}
                  sx={{
                    backgroundColor: "#a3bdc4",
                    width: "100%",
                  }}
                >
                  <Typography color={"#05184C"} align="left" fontWeight="bold">
                    Customer:{selectedCustomer}
                  </Typography>
                </Box>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={5}>
                    <Typography
                      color={"#05184C"}
                      align="left"
                      fontWeight="bold"
                    >
                      Amount:{SelectedItems.amount}
                    </Typography>
                    <Typography
                      color={"#05184C"}
                      align="left"
                      fontWeight="bold"
                    >
                      Date:{SelectedItems.date_issued}
                    </Typography>
                    <Typography
                      color={"#05184C"}
                      align="left"
                      fontWeight="bold"
                    >
                      Bank referance no:{SelectedItems.bank_referance_no}
                    </Typography>

                    <Typography
                      color={"#05184C"}
                      align="left"
                      fontWeight="bold"
                    >
                      Currency:{SelectedItems.currency}
                    </Typography>
                    <Typography
                      color={"#05184C"}
                      align="left"
                      fontWeight="bold"
                    >
                      {" "}
                      Payment referance no:
                      {SelectedItems.payment_order_referance_no}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={8}>
              <div style={{ marginTop: "10%" }}>
                {addunits.map((task, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Autocomplete
                      style={{ width: "60%" }}
                      options={addunitsop}
                      getOptionLabel={(data) => data.po_number}
                      value={addunits[index]}
                      getOptionSelected={(option, value) => option.po_number === value.po_number}
                      onInputChange={(a, newInputValue, v) => {
                        console.log(addunits[index]);
                        handleInputChange(index, "po_number", newInputValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="PO number"
                          variant="outlined"
                        />
                      )}
                    />
                    <Autocomplete
                      style={{ width: "60%" }}
                      options={addunitsInvoice}
                      getOptionLabel={(data) => data.invoice_number}
                      value={addunits[index]}
                      getOptionSelected={(option, value) => option.invoice_number === value.invoice_number}
                      onInputChange={(a, newInputValue, v) =>
                        handleInputChange(
                          index,
                          "invoice_number",
                          newInputValue
                        )
                      }
                      onChange={() =>
                        setSelectedItemsView(initialIssuesOnselect)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="invoice number"
                          variant="outlined"
                        />
                      )}
                    />

                    <TextField
                      label="Amount"
                      style={{ width: "60%" }}
                      type="number"
                      value={task.amount}
                      onChange={(e) =>
                        handleInputChange(index, "amount", e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      label="Remark"
                      type="text"
                      style={{ width: "60%" }}
                      value={task.remark}
                      onChange={(e) =>
                        handleInputChange(index, "remark", e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                ))}
                <Button
                  style={{ margin: "1%" }}
                  onClick={handleAddTask}
                  variant="contained"
                  sx={{ mr: 1 }}
                >
                  Add Payment details
                </Button>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
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
                              height: "5vh",
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
                              height: "5vh",
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
                              height: "5vh",
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
                              height: "5vh",
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
                              height: "5vh",
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
                              width: "auto",
                              height: "5vh",
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
                              height: "5vh",
                              color: "#096ac9",
                              fontSize: 16,
                            }}
                          >
                            Total Price
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {SelectedItemsView.items.map((issue, index) => (
                          <TableRow key={index}>
                            <TableCell>{issue.pos}</TableCell>
                            <TableCell>{issue.item_number}</TableCell>
                            <TableCell>{issue.description}</TableCell>
                            <TableCell>{issue.unit}</TableCell>
                            <TableCell>{issue.quantity}</TableCell>
                            <TableCell>{issue.unit_price}</TableCell>
                            <TableCell>{SelectedItems.currency}</TableCell>
                            <TableCell>{issue.total_price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TableCell>Total:{SelectedItems.amount} </TableCell>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Button
            style={{ margin: "1%" }}
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
            onClick={handleCloseModalItems}
          >
            save
          </Button>
          <Button
            style={{ margin: "1%" }}
            variant="contained"
            color="success"
            sx={{ mr: 1 }}
            onClick={() => {
              setIssuesCollection((prevObjects) => [
                ...prevObjects,
                SelectedItems,
              ]);
              setIsModalOpenItems(false)
              setIssues((prevItems) =>
                prevItems.filter((_, i) => i !== indexdata)
              );
            }}
          >
            complete
          </Button>
        </Box>
      </Modal>
      <Modal
        open={isModalOpenItemsCollection}
        onClose={handleCloseModalItemsCollection}
      >
        <Box
          sx={{
            position: "absolute",
            width: "60%",
            bgcolor: "background.paper",

            p: 2,
            top: "10%",
            left: "10%",
          }}
        >
          <div style={{ marginTop: "5%" }}>
            <div>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    mb={2}
                    sx={{
                      backgroundColor: "#a3bdc4",
                      width: "100%",
                    }}
                  >
                    <Typography
                      color={"#05184C"}
                      align="left"
                      fontWeight="bold"
                    >
                      Customer:{selectedCustomer}
                    </Typography>
                  </Box>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={5}>
                      <Typography
                        color={"#05184C"}
                        align="left"
                        fontWeight="bold"
                      >
                        Amount:{SelectedItems.amount}
                      </Typography>
                      <Typography
                        color={"#05184C"}
                        align="left"
                        fontWeight="bold"
                      >
                        Date:{SelectedItems.date_issued}
                      </Typography>
                      <Typography
                        color={"#05184C"}
                        align="left"
                        fontWeight="bold"
                      >
                        Bank referance no:{SelectedItems.bank_referance_no}
                      </Typography>

                      <Typography
                        color={"#05184C"}
                        align="left"
                        fontWeight="bold"
                      >
                        Currency:{SelectedItems.currency}
                      </Typography>
                      <Typography
                        color={"#05184C"}
                        align="left"
                        fontWeight="bold"
                      >
                        {" "}
                        Payment referance no:
                        {SelectedItems.payment_order_referance_no}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </div>

            {addunits.map((task, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                mb={2}
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                }}
              >
                <TextField
                  label="PO"
                  style={{ width: "60%" }}
                  type="text"
                  value={addunitsInvoice[0].po_number}
                />
                <TextField
                  label="invoice_no_eq"
                  style={{ width: "60%" }}
                  type="text"
                  value={addunitsInvoice[0].invoice_number}
                />

                <TextField
                  label="Amount"
                  style={{ width: "60%" }}
                  type="number"
                  value={task.amount}
                />
                <TextField
                  label="Remark"
                  type="text"
                  style={{ width: "60%" }}
                  value={task.remark}
                />
              </Box>
            ))}
            <Typography color={"#05184C"} align="left" fontWeight="bold">
              Runing Total:{runingTotal}
            </Typography>
          </div>
        </Box>
      </Modal>
      <Modal open={isModalOpenEdit} onClose={handleCloseModalEdit}>
        <Box
          sx={{
            position: "absolute",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            p: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {" "}
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
          >
            <Autocomplete
              value={selectedCustomer}
              sx={{ width: 360, margin: "1%" }}
              onChange={(event, newValue) => {
                setSelectedCustomer(newValue),
                  setSelectedItems({ ...SelectedItems, customer: newValue });
              }}
              options={["", ...allCustomers]}
              renderInput={(params) => (
                <TextField {...params} label="Select Customer" />
              )}
            />

            <TextField
              label="Amount"
              type="text"
              fullWidth
              margin="normal"
              value={SelectedItems.amount}
              onChange={(e) =>
                setSelectedItems({ ...SelectedItems, amount: e.target.value })
              }
            />
            <TextField
              label="Date"
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

            <TextField
              label="Bank referance no"
              type="text"
              fullWidth
              margin="normal"
              value={SelectedItems.bank_referance_no}
              onChange={(e) =>
                setSelectedItems({
                  ...SelectedItems,
                  bank_referance_no: e.target.value,
                })
              }
            />
            <TextField
              label="Currency"
              type="text"
              fullWidth
              margin="normal"
              value={SelectedItems.currency}
              onChange={(e) =>
                setSelectedItems({
                  ...SelectedItems,
                  currency: e.target.value,
                })
              }
            />
            <TextField
              label="Payment referance no"
              type="text"
              fullWidth
              margin="normal"
              value={SelectedItems.payment_order_referance_no}
              onChange={(e) =>
                setSelectedItems({
                  ...SelectedItems,
                  payment_order_referance_no: e.target.value,
                })
              }
            />

            <Button
              onClick={handleEdiiIssue}
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
    </SideBar>
  );
}
