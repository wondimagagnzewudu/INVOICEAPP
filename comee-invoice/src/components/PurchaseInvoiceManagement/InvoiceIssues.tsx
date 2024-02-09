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
  Autocomplete,
  Card,
  Switch,
  Tab,
  Tabs,
  Typography,
  TextField,
  Box,
  Select,
  CardContent,
  FormControl,
  Divider,
} from "@mui/material";
import axios, { AxiosRequestConfig } from "axios";
import { ThemeProvider } from "@mui/material/styles";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlined from "@mui/icons-material/ArrowDownwardOutlined";
import SideBar from "../Drawer";
import purchaseData from "./purchaseData";
import purchaseDataRecived from "./purchaseDataRecived";
import theme from "../../theme";
interface Issue {
  id: string;
  invoice_no: string;
  date_issued: string;
  due_date: string;
  sales_order: string;
  pod: string;
  total_price: string;
  payment_term: string;
  payment_status: string;
  order_number: string;
  maviko_order_number: string;
  items: any;
  file: "";
}
interface Purchase {
  purchase_order_number: string;
  supplier: string;
  supplierID: string;
  date_ofPO: string;
  amount: string;
  id: string;
  items: any;
  file: any;
  history: any;
  notes: string;
  due_date: string;
  invoice_date: string;
  invoice_number: string;
}
interface Addunit {
  id: string;
  pos: string;
  invoice: string;
  description: string;
  unit: string;
  quantity: string;
  unit_price: string;
  currency: string;
  total_price: string;
}
interface CustomImportMeta extends ImportMeta {
  env: {
    VITE_BASE_URL: string;
    // Add other environment variables as needed
  };
}
const intilalPurchase = {
  purchase_order_number: "",
  supplier: "",
  supplierID: "",
  date_ofPO: "",
  amount: "",
  id: "",
  file: "",
  notes: "",
  due_date: "",
  invoice_date: "",
  invoice_number: "",
  items: [],
  history: [],
};
interface filterMesurement {
  supplier_name_eq: String;
  invoice_no: String;
  status: String;
}
const initalAddunit: Addunit[] = [
  {
    id: "",
    pos: "",
    invoice: "",
    description: "",
    unit: "",
    quantity: "",
    unit_price: "",
    currency: "",
    total_price: "",
  },
];

const intialfilterMesurement: filterMesurement = {
  supplier_name_eq: "",
  invoice_no: "",
  status: "",
};
const initialIssuesSingle: Issue = {
  id: "",
  invoice_no: "Issue 1",
  date_issued: "",
  due_date: "",
  total_price: "100",
  sales_order: "123",
  pod: "",
  payment_term: "",
  payment_status: "",
  order_number: "",
  maviko_order_number: "",
  items: [
    {
      id: "",
      invoice: "",
      shipment_instruction_item: "",
      unit: "",
      quantity: "",
      unit_id: "",
      unit_price: "",
      total_price: "",
    },
  ],
  file: "",
};
const initialIssues: Issue[] = [
  {
    id: "",
    invoice_no: "Issue 1",
    date_issued: "",
    due_date: "",
    total_price: "100",
    sales_order: "123",
    pod: "123",
    payment_term: "",
    payment_status: "",
    order_number: "",
    maviko_order_number: "",
    items: [
      {
        id: "",
        invoice: "",
        shipment_instruction_item: "",
        unit: "",
        quantity: "",
        unit_price: "",
        unit_id: "",
        total_price: "",
      },
    ],
    file: "",
  },
  {
    id: "",
    invoice_no: "Issue 2",
    date_issued: "",
    due_date: "",
    total_price: "150",
    sales_order: "124",
    pod: "124",
    payment_term: "",
    payment_status: "",
    order_number: "",
    maviko_order_number: "",
    items: [
      {
        id: "",
        invoice: "",
        shipment_instruction_item: "",
        unit: "",
        quantity: "",
        unit_price: "",
        unit_id: "",
        total_price: "",
      },
    ],
    file: "",
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
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [purchase, setPurchase] = useState<Purchase[]>(purchaseData);
  const [purchaseRecived, setPurchaseRecived] =
    useState<Purchase[]>(purchaseDataRecived);
  const [purchaseApproved, setPurchaseApproved] = useState<Purchase[]>([]);
  const [purchasePaid, setPurchasePaid] = useState<Purchase[]>([]);
  const [filter, setfilter] = useState<filterMesurement>(
    intialfilterMesurement
  );
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [switchData, setSwitchData] = useState<bigint>(false);
  const [reseonDisaprove, setReseonDisaprove] = useState<any>("");
  const [indexdata, setindexdata] = useState<number>(0);
  const [AddunitItem, setAddunitItem] = useState<Addunit[]>(initalAddunit);
  const [SelectedItems, setSelectedItems] = useState<Purchase>(intilalPurchase);
  const baseUrl: string = (import.meta as CustomImportMeta).env.VITE_BASE_URL;
  const [total, setTotal] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [guidePdf, setGuidePdf] = useState<any>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState<boolean>(false);
  const [isModalOpenItems, setIsModalOpenItems] = useState<boolean>(false);
  const [isModalOpenApprove, setIsModalOpenApprove] = useState<boolean>(false);
  const [isModalOpenDispprove, setIsModalOpenDispprove] =
    useState<boolean>(false);
  const [newIssue, setNewIssue] = useState<Issue>({
    id: "",
    invoice_no: "",
    date_issued: "",
    due_date: "",
    total_price: "",
    sales_order: "",
    pod: "",
    payment_term: "",
    payment_status: "",
    order_number: "",
    maviko_order_number: "",
    items: [
      {
        id: "",
        invoice: "",
        shipment_instruction_item: "",
        unit: "",
        quantity: "",
        unit_price: "",
        unit_id: "",
        total_price: "",
      },
    ],
    file: "",
  });
  const [value, setValue] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
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
  const filterTable = async () => {
    var data = {};

    var body = {
      q: {
        supplier_name_eq: filter.supplier_name_eq,
        invoice_no_eq: filter.invoice_no,
        status_eq: filter.status,
      },
    };
    let config: AxiosRequestConfig = {
      method: "POST",
      maxBodyLength: Infinity,
      data: body,
      url: `${baseUrl}/comee_core/supplier_orders/filter?page=${
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
  const handleAddNewItem = (dataIndex) => {
    const newItem = {
      pos: `${purchase[indexdata].items.length + 1}`,
      item_number: "",
      description: "",
      unit: "",
      quantity: "",
      unit_price: 0,
      currency: "",
      total_price: "",
    };
    const updatedItems = [...purchase[indexdata].items, newItem];
    const updatedData = [...purchase];
    updatedData[indexdata] = { ...updatedData[indexdata], items: updatedItems };
    setPurchase(updatedData);
  };
  const handleMainDataChange = (index, field, value) => {
    const updatedData = [...purchase];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setPurchase(updatedData);
  };
  const allsupplier = Array.from(
    new Set(purchase.map((invoice) => invoice.supplier))
  );
  const handleItemChange = (itemIndex, field, value) => {
    const updatedItems = [...purchase[indexdata].items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], [field]: value };
    const updatedData = [...purchase];
    updatedData[indexdata] = { ...updatedData[indexdata], items: updatedItems };
    setPurchase(updatedData);
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
  const handleFileChangeissues = (event) => {
    // Assuming only one file is selected
    const file = event.target.files[0];

    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const dataUrl = fileReader.result;
        setNewIssue({
          ...newIssue,
          file: event.target.files[0],
        });
      };
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
  const handleAddTask = () => {
    setAddunitItem([
      ...AddunitItem,
      {
        id: "",
        pos: "",
        invoice: "",
        description: "",
        unit: "",
        quantity: "",
        unit_price: "",
        currency: "",
        total_price: "",
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

  const handleEdiiIssue = () => {
    handleCloseModalEdit();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCloseModalApprove = () => {
    setIsModalOpenApprove(false);
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
      sales_order: "",
      payment_term: "",
      payment_status: "",
      order_number: "",
      maviko_order_number: "",
      items: [],
      file: "",
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
        <Tab label="Draft Suppplier invoices" />
        <Tab label="Recived Suppplier invoices" />
        <Tab label="Approved Suppplie invoices" />
        <Tab label="Paid Suppplie invoices" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <div>
          <Button
            onClick={handleOpenModal}
            variant="outlined"
            style={{ margin: "20px" }}
          >
            Add Issue
          </Button>
          <Card>
            <CardContent>
              <Paper>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <Autocomplete
                    value={selectedSupplier}
                    sx={{ width: 200, margin: "1%" }}
                    onChange={(event, newValue) =>
                      setSelectedSupplier(newValue)
                    }
                    options={["", ...allsupplier]}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Supplier" />
                    )}
                  />
                  <TextField
                    label="Purchase order number"
                    fullWidth
                    sx={{ width: 200, marginLeft: "2%" }}
                    margin="normal"
                    variant="outlined"
                    value={filter.invoice_no || ""}
                    onChange={(e) =>
                      handlefilterChange("invoice_no", e.target.value)
                    }
                  />
                  <FormControl
                    size="medium"
                    margin="normal"
                    sx={{ width: 200, marginLeft: "2%" }}
                  >
                    <Select
                      onChange={(event, newValue) =>
                        handlefilterChange("status", newValue)
                      }
                    >
                      <MenuItem value={"4"}>canceled</MenuItem>
                      <MenuItem value={"1"}>submitted</MenuItem>
                      <MenuItem value={"3"}>accepted</MenuItem>
                      <MenuItem value={"0"}>draft</MenuItem>
                      <MenuItem value={"2"}>awaiting confirmation</MenuItem>
                    </Select>
                  </FormControl>

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
          <Grid container spacing={0}>
            <Grid item xs={12} sm={8}>
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
                            Purchase order number
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
                            Supplier
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
                            Supplier ID
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
                            Date of PO
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
                            Amount
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
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {purchase.map((issue, index) => (
                          <TableRow key={index}>
                            <TableCell>{issue.purchase_order_number}</TableCell>
                            <TableCell>{issue.supplier}</TableCell>
                            <TableCell>{issue.supplierID}</TableCell>
                            <TableCell>{issue.date_ofPO}</TableCell>
                            <TableCell>{issue.amount}</TableCell>

                            <TableCell>
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                  setSelectedItems(issue),
                                    setIsModalOpenItems(true);
                                  setindexdata(index);
                                }}
                              >
                                <EventNoteOutlinedIcon />
                              </Button>
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                  setSelectedItems(issue),
                                    setIsModalOpenEdit(true);
                                  setindexdata(index);
                                }}
                              >
                                {" "}
                                <EditOutlinedIcon />
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
            </Grid>
            <Grid item xs={12} sm={4}>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  sx={{ margin: "2%" }}
                  fullWidth
                  component="span"
                  variant="outlined"
                  color="primary"
                >
                  Upload invoice File{" "}
                </Button>
              </label>
              {guidePdf && (
                <iframe
                  title="PDF Viewer"
                  src={guidePdf}
                  width="100%"
                  height="600px"
                  style={{ border: "none" }}
                ></iframe>
              )}
            </Grid>
          </Grid>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Card>
          <CardContent>
            <Paper>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Autocomplete
                  value={selectedSupplier}
                  sx={{ width: 200, margin: "1%" }}
                  onChange={(event, newValue) => setSelectedSupplier(newValue)}
                  options={["", ...allsupplier]}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Supplier" />
                  )}
                />
                <TextField
                  label="Purchase order number"
                  fullWidth
                  sx={{ width: 200, marginLeft: "2%" }}
                  margin="normal"
                  variant="outlined"
                  value={filter.invoice_no || ""}
                  onChange={(e) =>
                    handlefilterChange("invoice_no", e.target.value)
                  }
                />
                <FormControl
                  size="medium"
                  margin="normal"
                  sx={{ width: 200, marginLeft: "2%" }}
                >
                  <Select
                    onChange={(event, newValue) =>
                      handlefilterChange("status", newValue)
                    }
                  >
                    <MenuItem value={"4"}>canceled</MenuItem>
                    <MenuItem value={"1"}>submitted</MenuItem>
                    <MenuItem value={"3"}>accepted</MenuItem>
                    <MenuItem value={"0"}>draft</MenuItem>
                    <MenuItem value={"2"}>awaiting confirmation</MenuItem>
                  </Select>
                </FormControl>

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
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      Purchase order number
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
                      Supplier
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
                      Supplier ID
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
                      Date of PO
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
                      Amount
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
                      Note
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
                      Dude Date
                    </TableCell>{" "}
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
                      Invoice Date
                    </TableCell>{" "}
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
                      Invoice number
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
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {purchaseRecived.map((issue, index) => (
                    <TableRow key={index}>
                      <TableCell>{issue.purchase_order_number}</TableCell>
                      <TableCell>{issue.supplier}</TableCell>
                      <TableCell>{issue.supplierID}</TableCell>
                      <TableCell>{issue.date_ofPO}</TableCell>
                      
                      <TableCell>{issue.amount}</TableCell>
                      <TableCell>{issue.notes}</TableCell>
                      <TableCell>{issue.due_date}</TableCell>
                      <TableCell>{issue.invoice_date}</TableCell>
                      <TableCell>{issue.invoice_number}</TableCell>

                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            console.log(issue);
                            setSelectedItems(issue), setIsModalOpenItems(true);
                            setindexdata(index);
                            console.log(SelectedItems);
                          }}
                        >
                          <EventNoteOutlinedIcon />
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            console.log(isModalOpenApprove);
                            setSelectedItems(issue),
                              setIsModalOpenApprove(true);
                            setindexdata(index);
                          }}
                        >
                          {" "}
                          <ArrowUpwardOutlinedIcon />
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            console.log(isModalOpenApprove);
                            setSelectedItems(issue),
                              setIsModalOpenDispprove(true);
                            setindexdata(index);
                          }}
                        >
                          {" "}
                          <ArrowDownwardOutlined />
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
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Card>
          <CardContent>
            <Paper>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Autocomplete
                  value={selectedSupplier}
                  sx={{ width: 200, margin: "1%" }}
                  onChange={(event, newValue) => setSelectedSupplier(newValue)}
                  options={["", ...allsupplier]}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Supplier" />
                  )}
                />
                <TextField
                  label="Purchase order number"
                  fullWidth
                  sx={{ width: 200, marginLeft: "2%" }}
                  margin="normal"
                  variant="outlined"
                  value={filter.invoice_no || ""}
                  onChange={(e) =>
                    handlefilterChange("invoice_no", e.target.value)
                  }
                />
                <FormControl
                  size="medium"
                  margin="normal"
                  sx={{ width: 200, marginLeft: "2%" }}
                >
                  <Select
                    onChange={(event, newValue) =>
                      handlefilterChange("status", newValue)
                    }
                  >
                    <MenuItem value={"4"}>canceled</MenuItem>
                    <MenuItem value={"1"}>submitted</MenuItem>
                    <MenuItem value={"3"}>accepted</MenuItem>
                    <MenuItem value={"0"}>draft</MenuItem>
                    <MenuItem value={"2"}>awaiting confirmation</MenuItem>
                  </Select>
                </FormControl>

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
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      Purchase order number
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
                      Supplier
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
                      Supplier ID
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
                      Date of PO
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
                      Status
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
                      Amount
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
                      Amount Recived
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
                      Note
                    </TableCell>{" "}
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
                      Dude Date
                    </TableCell>{" "}
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
                      Invoice Date
                    </TableCell>{" "}
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
                      Invoice number
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
                      Remaining balance
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
                      Remark
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
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {purchaseApproved.map((issue, index) => (
                    <TableRow key={index}>
                      <TableCell>{issue.purchase_order_number}</TableCell>
                      <TableCell>{issue.supplier}</TableCell>
                      <TableCell>{issue.supplierID}</TableCell>
                      <TableCell>{issue.date_ofPO}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{issue.amount}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{issue.notes}</TableCell>
                      <TableCell>{issue.due_date}</TableCell>
                      <TableCell>{issue.invoice_date}</TableCell>
                      <TableCell>{issue.invoice_number}</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                     
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            setSelectedItems(issue), setIsModalOpenItems(true);
                            setindexdata(index);
                          }}
                        >
                          <EventNoteOutlinedIcon />
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
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Card>
          <CardContent>
            <Paper>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Autocomplete
                  value={selectedSupplier}
                  sx={{ width: 200, margin: "1%" }}
                  onChange={(event, newValue) => setSelectedSupplier(newValue)}
                  options={["", ...allsupplier]}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Supplier" />
                  )}
                />
                <TextField
                  label="Purchase order number"
                  fullWidth
                  sx={{ width: 200, marginLeft: "2%" }}
                  margin="normal"
                  variant="outlined"
                  value={filter.invoice_no || ""}
                  onChange={(e) =>
                    handlefilterChange("invoice_no", e.target.value)
                  }
                />
                <FormControl
                  size="medium"
                  margin="normal"
                  sx={{ width: 200, marginLeft: "2%" }}
                >
                  <Select
                    onChange={(event, newValue) =>
                      handlefilterChange("status", newValue)
                    }
                  >
                    <MenuItem value={"4"}>canceled</MenuItem>
                    <MenuItem value={"1"}>submitted</MenuItem>
                    <MenuItem value={"3"}>accepted</MenuItem>
                    <MenuItem value={"0"}>draft</MenuItem>
                    <MenuItem value={"2"}>awaiting confirmation</MenuItem>
                  </Select>
                </FormControl>

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
                        height: "5vh",
                        color: "#096ac9",
                        fontSize: 16,
                      }}
                    >
                      Purchase order number
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
                      Supplier
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
                      Supplier ID
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
                      Date of PO
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
                      Status
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
                      Amount
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
                      Amount Paid
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
                      Remaining balance
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
                      Remark
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
                      Note
                    </TableCell>{" "}
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
                      Dude Date
                    </TableCell>{" "}
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
                      Invoice Date
                    </TableCell>{" "}
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
                      Invoice number
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
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {purchasePaid.map((issue, index) => (
                    <TableRow key={index}>
                      <TableCell>{issue.purchase_order_number}</TableCell>
                      <TableCell>{issue.supplier}</TableCell>
                      <TableCell>{issue.supplierID}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{issue.date_ofPO}</TableCell>
                      <TableCell>{issue.amount}</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>{issue.notes}</TableCell>
                      <TableCell>{issue.due_date}</TableCell>
                      <TableCell>{issue.invoice_date}</TableCell>
                      <TableCell>{issue.invoice_number}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            setSelectedItems(issue), setIsModalOpenItems(true);
                            setindexdata(index);
                          }}
                        >
                          <EventNoteOutlinedIcon />
                        </Button>
                        <Button variant="outlined" color="primary">
                          {" "}
                          <ArrowUpwardOutlinedIcon />
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
      </TabPanel>
      <Modal open={isModalOpenItems} onClose={handleCloseModalItems}>
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
                        pos
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
                        Item number
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
                    {SelectedItems.items.map((issue, index) => (
                      <TableRow key={index}>
                        <TableCell>{issue.pos}</TableCell>
                        <TableCell>{issue.item_number}</TableCell>
                        <TableCell>{issue.description}</TableCell>
                        <TableCell>{issue.unit}</TableCell>
                        <TableCell>{issue.quantity}</TableCell>
                        <TableCell>{issue.unit_price}</TableCell>
                        <TableCell>
                          {parseFloat(issue.unit_price) *
                            parseFloat(issue.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Modal>
      <Modal
        style={{ overflow: "scroll" }}
        open={isModalOpenEdit}
        onClose={handleCloseModalEdit}
      >
        <Box
          sx={{
            position: "absolute",
            width: 1400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            p: 2,
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {purchase.map((data, indexdata) => (
            <Box
              sx={{
                position: "absolute",
                width: 1400,
                bgcolor: "background.paper",

                p: 2,
                top: "60%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <TextField
                label="Purchase order number"
                type="text"
                fullWidth
                margin="normal"
                value={data.purchase_order_number}
              />
              <TextField
                label="Supplier"
                type="text"
                fullWidth
                margin="normal"
                value={data.supplier}
              />
              <TextField
                label="Supplier ID"
                type="text"
                fullWidth
                margin="normal"
                value={data.supplierID}
              />
              <TextField
                label="Date of PO"
                type="text"
                fullWidth
                margin="normal"
                value={data.date_ofPO}
              />
              <TextField
                label="Date of PO"
                type="text"
                fullWidth
                margin="normal"
                value={data.amount}
              />
              <TextField
                label="Invoice number"
                type="text"
                fullWidth
                margin="normal"
                value={data.invoice_number}
                onChange={(e) =>
                  handleMainDataChange(
                    indexdata,
                    "invoice_number",
                    e.target.value
                  )
                }
              />
              <TextField
                label="Due date"
                type="date"
                fullWidth
                margin="normal"
                value={data.due_date}
                onChange={(e) =>
                  handleMainDataChange(indexdata, "due_date", e.target.value)
                }
              />
              <TextField
                label="Notes"
                type="day"
                fullWidth
                margin="normal"
                value={data.notes}
                onChange={(e) =>
                  handleMainDataChange(indexdata, "notes", e.target.value)
                }
              />{" "}
              <div className="head" style={{ display: "flex", gap: 15 }}>
                <Switch
                  checked={switchData}
                  sx={{ mb: 2 }}
                  onChange={() => {
                    setSwitchData(!switchData);
                  }}
                >
                  {" "}
                </Switch>{" "}
                View History
              </div>
              <div style={{ marginTop: "3%", marginBottom: "3%" }}>
                {switchData ? (
                  <>
                    {data.history.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <TextField label="Item Number" value={item.pos} />

                        <TextField
                          label="Item Number"
                          value={item.item_number}
                        />

                        <TextField
                          label="Description"
                          value={item.item_number}
                        />

                        <TextField label="Unit" value={item.unit} />

                        <TextField label="Quantity" value={item.quantity} />
                        <TextField label="Unit price" value={item.unit_price} />
                        <TextField
                          label="Total price"
                          value={
                            parseFloat(item.unit_price) *
                            parseFloat(item.quantity)
                          }
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </div>
              {data.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <TextField
                    label="Item Number"
                    value={item.pos}
                    onChange={(e) =>
                      handleItemChange(itemIndex, "pos", e.target.value)
                    }
                  />

                  <TextField
                    label="Item Number"
                    value={item.item_number}
                    onChange={(e) =>
                      handleItemChange(itemIndex, "item_number", e.target.value)
                    }
                  />

                  <TextField
                    label="Description"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(itemIndex, "description", e.target.value)
                    }
                  />

                  <TextField
                    label="Unit"
                    value={item.unit}
                    onChange={(e) =>
                      handleItemChange(itemIndex, "unit", e.target.value)
                    }
                  />

                  <TextField
                    label="Quantity"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(itemIndex, "quantity", e.target.value)
                    }
                  />
                  <TextField
                    label="Unit price"
                    value={item.unit_price}
                    onChange={(e) =>
                      handleItemChange(itemIndex, "unit_price", e.target.value)
                    }
                  />
                  <TextField
                    label="Total price"
                    value={
                      parseFloat(item.unit_price) * parseFloat(item.quantity)
                    }
                  />
                </div>
              ))}
              <div>
                <Button
                  variant="outlined"
                  onClick={() => handleAddNewItem(indexdata)}
                >
                  Add New Item
                </Button>
              </div>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "10px" }}
                onClick={() => {
                  // setPurchaseRecived((prevObjects) => [...prevObjects, data]);
                  // setPurchase((prevItems) =>
                  //   prevItems.filter((_, i) => i !== indexdata)
                  // );
                }}
              >
                Create supplier invoice
              </Button>
            </Box>
          ))}
        </Box>
      </Modal>
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
            Add New Issue
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {" "}
              <TextField
                label="Issue invoice_no"
                fullWidth
                margin="normal"
                value={newIssue.invoice_no}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, invoice_no: e.target.value })
                }
              />
              <TextField
                label="Date issued"
                type="date"
                fullWidth
                margin="normal"
                value={newIssue.date_issued}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, date_issued: e.target.value })
                }
              />
              <TextField
                label="Issue invoice_no"
                fullWidth
                margin="normal"
                value={newIssue.invoice_no}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, invoice_no: e.target.value })
                }
              />
              <TextField
                label="Payment term"
                type="text"
                fullWidth
                margin="normal"
                value={newIssue.payment_term}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, payment_term: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="payment status"
                type="text"
                fullWidth
                margin="normal"
                value={newIssue.payment_status}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, payment_term: e.target.value })
                }
              />
              <TextField
                label="Invoice no"
                type="text"
                fullWidth
                margin="normal"
                value={newIssue.order_number}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, order_number: e.target.value })
                }
              />
              <TextField
                label="maviko_order_number"
                type="text"
                fullWidth
                margin="normal"
                value={newIssue.maviko_order_number}
                onChange={(e) =>
                  setNewIssue({
                    ...newIssue,
                    maviko_order_number: e.target.value,
                  })
                }
              />
              <TextField
                label="Due date"
                type="date"
                fullWidth
                margin="normal"
                value={newIssue.due_date}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, due_date: e.target.value })
                }
              />
              <TextField
                label="total_price"
                type="text"
                fullWidth
                margin="normal"
                value={newIssue.total_price}
                onChange={(e) =>
                  setNewIssue({
                    ...newIssue,
                    total_price: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChangeissues}
            style={{ display: "none" }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button
              sx={{ margin: "2%" }}
              fullWidth
              component="span"
              variant="outlined"
              color="primary"
            >
              Upload invoice File{" "}
            </Button>
          </label>
          <div style={{ marginTop: "10%" }}>
            {AddunitItem.map((task, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <TextField
                  label="Pos"
                  type="text"
                  value={task.pos}
                  onChange={(e) =>
                    handleInputChange(index, "pos", e.target.value)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Invoice"
                  type="text"
                  value={task.invoice}
                  onChange={(e) =>
                    handleInputChange(index, "invoice", e.target.value)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
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
                  label="unit"
                  type="text"
                  value={task.unit}
                  onChange={(e) =>
                    handleInputChange(index, "unit", e.target.value)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Quantity"
                  type="text"
                  value={task.quantity}
                  onChange={(e) =>
                    handleInputChange(index, "quantity", e.target.value)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Unit price"
                  type="text"
                  value={task.unit_price}
                  onChange={(e) =>
                    handleInputChange(index, "unit_price", e.target.value)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Currency"
                  type="text"
                  value={task.currency}
                  onChange={(e) =>
                    handleInputChange(index, "currency", e.target.value)
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
              style={{ margin: "5%" }}
              onClick={handleAddTask}
              variant="contained"
              sx={{ mr: 1 }}
            >
              Add items
            </Button>
          </div>
          <Button
            onClick={handleAddIssue}
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Add Issue
          </Button>
        </Box>
      </Modal>
      <Modal open={isModalOpenApprove} onClose={handleCloseModalApprove}>
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
          <Typography variant="h6" component="div" style={{ margin: "2%" }}>
            Do you want to Approve this Invoice
          </Typography>
          <Divider></Divider>
          <Button
            variant="outlined"
            color="primary"
            style={{ margin: "2%" }}
            onClick={() => {
              setPurchaseApproved((prevObjects) => [
                ...prevObjects,
                SelectedItems,
              ]);

              setPurchaseRecived((prevItems) =>
                prevItems.filter((_, i) => i !== indexdata)
              );
              setIsModalOpenApprove(false);
            }}
          >
            Approve
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={handleCloseModalApprove}
          >
            Close
          </Button>
        </Box>
      </Modal>
      <Modal
        open={isModalOpenDispprove}
        onClose={() => {
          setIsModalOpenDispprove(false);
        }}
      >
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
          <Typography variant="h6" component="div" style={{ margin: "2%" }}>
            Do you want to Reject this Invoice
          </Typography>
          <Divider></Divider>
          <TextField
            label="Resson for rejection"
            fullWidth
            sx={{ width: 500, marginLeft: "2%" }}
            margin="normal"
            variant="outlined"
            value={reseonDisaprove}
            onChange={(e) => setReseonDisaprove(e.target.value)}
          />
          <div></div>
          <Button
            variant="outlined"
            color="error"
            style={{ margin: "2%" }}
            onClick={() => {
              setPurchase((prevObjects) => [...prevObjects, SelectedItems]);

              setPurchaseRecived((prevItems) =>
                prevItems.filter((_, i) => i !== indexdata)
              );
              setIsModalOpenDispprove(false);
            }}
          >
            Yes
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              setIsModalOpenDispprove(false);
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </SideBar>
  );
}
