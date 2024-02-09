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
  Checkbox,
  Button,
  TablePagination,
  Modal,
  Tabs,
  Tab,
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
import SideBar from "../Drawer";
import ReactToPrint from "react-to-print";
import purchaseData from "./purchaseData";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import purchaseDataRecived from "./purchaseDataRecived";
import theme from "../../theme";
interface Issue {
  id: string;
  invoice_no: string;
  date_issued: string;
  due_date: string;
  payment_order_referance_no: string;
  pod: string;
  amount: string;
  suppliers: string;
  currency: string;
  bank_referance_no: string;
  order_number: string;
  items: any;
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
interface PurchasePay {
  purchase_order_number: string;
  selected: string;
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
  runingtolapay: string;
}
interface filterMesurement {
  supplier_name_eq: String;
  invoice_no: String;
  status: String;
}
interface paymentOrderData {
  supplier: string;
  amount: string;
  items: any;
  payment_date: string;
  currency: string;
  payrment_referance_no: string;
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
const initalPaymentOrder: paymentOrderData[] = [
  {
    supplier: "",
    amount: "",
    items: [],
    payment_date: "",
    currency: "",
    payrment_referance_no: "",
  },
];
const initalAddunit: Addunit[] = [
  {
    invoice: "",
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
  amount: "100",
  payment_order_referance_no: "123",
  pod: "",
  suppliers: "",
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
    suppliers: "",
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
    suppliers: "",
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
  const [issues, setIssues] = useState<paymentOrderData[]>([]);
  const [issuesPaid, setIssuesPaid] = useState<paymentOrderData[]>([]);
  const [purchase, setPurchase] = useState<Purchase[]>(purchaseData);
  const [purchaseRecived, setPurchaseRecived] =
    useState<PurchasePay[]>(purchaseDataRecived);
  const [addunits, setAddunits] = useState<Addunit[]>(initalAddunit);
  const [addunitsInvoice, setAddunitsInvoice] =
    useState<Addinvoice[]>(initalAddunitinvoice);
  const [addunitsop, setAddunitsop] = useState<Addunitpo[]>(initalAddunitpo);
  const [filter, setfilter] = useState<filterMesurement>(
    intialfilterMesurement
  );

  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [SelectedItems, setSelectedItems] =
    useState<Issue>(initialIssuesSingle);
  const baseUrl: string = (import.meta as CustomImportMeta).env.VITE_BASE_URL;
  var [runingtolapay, setRuningtolapay] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [dataindex, setDataindex] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [guidePdf, setGuidePdf] = useState<any>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOpenitems, setIsOpenitems] = useState<boolean>(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState<boolean>(false);
  const [isModalOpenItems, setIsModalOpenItems] = useState<boolean>(false);
  const [isModalOpenItemsPaid, setIsModalOpenItemsPaid] =
    useState<boolean>(false);
  const [isModalOpenItemsEdit, setIsModalOpenItemsEdit] =
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
    suppliers: "",
    bank_referance_no: "",
    order_number: "",
    items: [],
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const PrintToPDF = ({}) => {
    const componentRef = useRef();
    var all_total = 0;

    return (
      <div>
        <ReactToPrint
          trigger={() => (
            <Button sx={{ margin: "2%" }} variant="outlined" color="primary">
              Print to PDF
            </Button>
          )}
          content={() => componentRef.current}
        />
        <Button
          onClick={() => {
            setIsModalOpenItemsPaid(false);
          }}
          variant="outlined"
          sx={{ margin: "2%" }}
          color="error"
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
              height: "18vh",
              backgroundColor: "#a3bdc4",
            }}
          >
            <Typography
              variant="h4"
              align="left"
              color={"#05184C"}
              fontWeight="bold"
            >
              MAVEKO
            </Typography>

            <div>
              <Typography
                variant="h7"
                align="left"
                color={"#05184C"}
                sx={{}}
                fontWeight="bold"
              >
                Supllier name: {SelectedItems.supplier}
              </Typography>
            </div>
            <div>
              <Typography
                variant="h7"
                align="left"
                color={"#05184C"}
                sx={{}}
                fontWeight="bold"
              >
                Currency :{SelectedItems.currency}
              </Typography>
            </div>
            <div>
              <Typography
                variant="h7"
                align="left"
                color={"#05184C"}
                sx={{}}
                fontWeight="bold"
              >
                Payement Refe no:{SelectedItems.payment_order_referance_no}
              </Typography>
            </div>
            <div>
              <Typography
                variant="h7"
                align="left"
                color={"#05184C"}
                sx={{}}
                fontWeight="bold"
              >
                Amount: {SelectedItems.amount}
              </Typography>
            </div>
          </Paper>
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
                        Purchase order number
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
                        Date of PO
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
                        Amount
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
                        Invoice Date
                      </TableCell>{" "}
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
                        Invoice number
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {SelectedItems.items.map((dataissues, index) => (
                      <>
                        {dataissues.selected ? (
                          <TableRow key={index}>
                            <TableCell>
                              {dataissues.purchase_order_number}
                            </TableCell>
                            <TableCell>{dataissues.date_ofPO}</TableCell>
                            <TableCell>{dataissues.amount}</TableCell>
                            <TableCell>{dataissues.invoice_date}</TableCell>
                            <TableCell>{dataissues.invoice_number}</TableCell>
                          </TableRow>
                        ) : (
                          <></>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              Running total : {SelectedItems.amount}
            </CardContent>
          </Card>
        </Paper>
      </div>
    );
  };
  const [value, setValue] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const allsupplier = Array.from(
    new Set(purchase.map((invoice) => invoice.supplier))
  );
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
      url: `${baseUrl}/comee_core/suppliers_orders/filter?page=${
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

  const handleEditIssue = () => {
    setIssuesPaid([...issuesPaid, SelectedItems]);
    setIssues((prevItems) => prevItems.filter((_, i) => i !== dataindex));
    handleCloseModalEdit();
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddIssue = () => {
    var addIssues = {
      supplier: selectedSupplier,
      amount: runingtolapay,
      items: purchaseRecived,
      payment_date: "",
      currency: "",
      payrment_referance_no: "",
    };
    setIssues([...issues, addIssues]);
    handleCloseModal();
  };
  const handleAddIssueEdit = () => {
    var addIssues = {
      supplier: SelectedItems.supplier,
      amount: runingtolapay,
      items: purchaseRecived,
      payment_date: SelectedItems.payment_date,
      currency: SelectedItems.currency,
      payrment_referance_no: SelectedItems.payrment_referance_no,
    };
    console.log("addIssues", dataindex);
    const updatedData = [...issues];
    updatedData[dataindex] = addIssues;
    setIssues(updatedData);
    setIsModalOpenItemsEdit(false);
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
        <Tab label="Paid" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <div>
          <Button
            onClick={handleOpenModal}
            variant="outlined"
            style={{ margin: "20px" }}
          >
            Add Payment Order
          </Button>
          <Card>
            <CardContent>
              <Paper>
                <div>
                  <TextField
                    label="Suppliers name"
                    fullWidth
                    sx={{ width: 200, marginLeft: "2%" }}
                    margin="normal"
                    variant="outlined"
                    value={filter.supplier_name_eq || ""}
                    onChange={(e) =>
                      handlefilterChange("supplier_name_eq", e.target.value)
                    }
                  />
                  <TextField
                    label="Invoice no"
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
                          width: "auto",
                          height: "3vh",
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
                          height: "3vh",
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
                          height: "3vh",
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
                    {issues.map((viewissue, index) => (
                      <TableRow key={index}>
                        {/* {console.log(viewissue)} */}
                        <TableCell>{viewissue.supplier}</TableCell>
                        <TableCell>{viewissue.amount}</TableCell>
                        <TableCell>{viewissue.date_issued}</TableCell>

                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              setSelectedItems(viewissue), setDataindex(index);
                              setIsModalOpenEdit(true);
                            }}
                          >
                            <CheckOutlinedIcon />
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              setPurchaseRecived(viewissue.items),
                                setDataindex(index);
                              setSelectedItems(viewissue);
                              setIsModalOpenItemsEdit(true);
                            }}
                          >
                            <EditOutlinedIcon />
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              setSelectedItems(viewissue);
                              setIsModalOpenItems(true);
                            }}
                          >
                            <AddBoxOutlinedIcon />
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
        {" "}
        <Card>
          <CardContent>
            <Paper>
              <div>
                <TextField
                  label="Suppliers name"
                  fullWidth
                  sx={{ width: 200, marginLeft: "2%" }}
                  margin="normal"
                  variant="outlined"
                  value={filter.supplier_name_eq || ""}
                  onChange={(e) =>
                    handlefilterChange("supplier_name_eq", e.target.value)
                  }
                />
                <TextField
                  label="Invoice no"
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
                        width: "auto",
                        height: "3vh",
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
                        height: "3vh",
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
                        height: "3vh",
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
                  {issuesPaid.map((viewissue, index) => (
                    <TableRow key={index}>
                      {/* {console.log(viewissue)} */}
                      <TableCell>{viewissue.supplier}</TableCell>
                      <TableCell>{viewissue.amount}</TableCell>
                      <TableCell>{viewissue.date_issued}</TableCell>

                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            setSelectedItems(viewissue);
                            setIsModalOpenItemsPaid(true);
                          }}
                        >
                          <AddBoxOutlinedIcon />
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
            <TextField
              label="Suppliers"
              type="text"
              fullWidth
              margin="normal"
              value={SelectedItems.supplier}
            />
            <TextField
              label="Amount"
              type="text"
              fullWidth
              margin="normal"
              value={SelectedItems.amount}
            />
            <TextField
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
              label=" Payment referance no"
              type="text"
              fullWidth
              margin="normal"
              value={SelectedItems.payrment_referance_no}
              onChange={(e) =>
                setSelectedItems({
                  ...SelectedItems,
                  payrment_referance_no: e.target.value,
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

            <Button
              onClick={handleEditIssue}
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
            >
              Generate Payment Remetance
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            width: "80%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            p: 2,
            top: "10%",
            left: "10%",
          }}
        >
          <Typography variant="h6" component="div" color="primary">
            Add New Payment
          </Typography>

          <Autocomplete
            sx={{ width: 360, margin: "1%" }}
            onChange={(event, newValue) => {
              setSelectedSupplier(newValue);
              setIsOpenitems(true);
              console.log(allsupplier);
            }}
            options={["", ...allsupplier]}
            renderInput={(params) => (
              <TextField {...params} label="Select Supplier" />
            )}
          />
          {isOpenitems ? (
            <>
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
                              width: "auto",
                              height: "3vh",
                              color: "#096ac9",
                              fontSize: 16,
                            }}
                          >
                            Select
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
                            Purchase order number
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
                            Date of PO
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
                            Amount
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
                            Dude Date
                          </TableCell>{" "}
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
                            Invoice Date
                          </TableCell>{" "}
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
                            Invoice number
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {purchaseRecived.map((dataissues, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Checkbox
                                checked={dataissues.selected}
                                onChange={(e) => {
                                  console.log("dataissues", dataissues);
                                  if (dataissues.selected) {
                                    setRuningtolapay(
                                      (runingtolapay -= parseFloat(
                                        dataissues.amount
                                      ))
                                    );
                                  } else {
                                    setRuningtolapay(
                                      (runingtolapay += parseFloat(
                                        dataissues.amount
                                      ))
                                    );
                                  }
                                  const updatedData = [...purchaseRecived];
                                  updatedData[index] = {
                                    ...updatedData[index],
                                    selected: !dataissues.selected,
                                  };
                                  setPurchaseRecived(updatedData);
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={dataissues.purchase_order_number}
                              ></TextField>
                            </TableCell>

                            <TableCell>
                              {" "}
                              <TextField
                                value={dataissues.date_ofPO}
                              ></TextField>{" "}
                            </TableCell>

                            <TableCell>
                              {" "}
                              <TextField
                                onChange={(e) => {
                                  if (dataissues.selected) {
                                    const updatedData = [...purchaseRecived];
                                    updatedData[index] = {
                                      ...updatedData[index],
                                      amount: e.target.value,
                                    };
                                    if (parseFloat(dataissues.amount)) {
                                      setRuningtolapay(
                                        (runingtolapay -= parseFloat(
                                          dataissues.amount
                                        ))
                                      );
                                    }
                                    if (parseFloat(e.target.value)) {
                                      setRuningtolapay(
                                        (runingtolapay += parseFloat(
                                          e.target.value
                                        ))
                                      );
                                    }

                                    setPurchaseRecived(updatedData);
                                  }
                                }}
                                value={dataissues.amount}
                              ></TextField>{" "}
                            </TableCell>

                            <TableCell>
                              {" "}
                              <TextField
                                value={dataissues.due_date}
                              ></TextField>{" "}
                            </TableCell>
                            <TableCell>
                              {" "}
                              <TextField
                                value={dataissues.invoice_date}
                              ></TextField>{" "}
                            </TableCell>
                            <TableCell>
                              {" "}
                              <TextField
                                value={dataissues.invoice_number}
                              ></TextField>{" "}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  Running total : {runingtolapay}
                </CardContent>
              </Card>
              <Button
                onClick={handleAddIssue}
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
              >
                Save Payment Order
              </Button>
            </>
          ) : (
            <> </>
          )}
        </Box>
      </Modal>
      <Modal open={isModalOpenItems} onClose={handleCloseModalItems}>
        <Box
          sx={{
            position: "absolute",
            width: 1200,
            bgcolor: "background.paper",
            border: "2px solid #000",
            p: 2,
            top: "10%",
            left: "10%",
          }}
        >
          <>
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
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Select
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
                          Purchase order number
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
                          Date of PO
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
                          Amount
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
                          Dude Date
                        </TableCell>{" "}
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
                          Invoice Date
                        </TableCell>{" "}
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
                          Invoice number
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {SelectedItems.items.map((dataissues, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Checkbox checked={dataissues.selected} />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={dataissues.purchase_order_number}
                            ></TextField>
                          </TableCell>

                          <TableCell>
                            {" "}
                            <TextField
                              value={dataissues.date_ofPO}
                            ></TextField>{" "}
                          </TableCell>

                          <TableCell>
                            {" "}
                            <TextField
                              value={dataissues.amount}
                            ></TextField>{" "}
                          </TableCell>

                          <TableCell>
                            {" "}
                            <TextField
                              value={dataissues.due_date}
                            ></TextField>{" "}
                          </TableCell>
                          <TableCell>
                            {" "}
                            <TextField
                              value={dataissues.invoice_date}
                            ></TextField>{" "}
                          </TableCell>
                          <TableCell>
                            {" "}
                            <TextField
                              value={dataissues.invoice_number}
                            ></TextField>{" "}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                Running total : {SelectedItems.amount}
              </CardContent>
            </Card>
          </>
        </Box>
      </Modal>
      <Modal
        open={isModalOpenItemsPaid}
        onClose={() => {
          setIsModalOpenItemsPaid(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "60%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            p: 2,
            top: "10%",
            left: "20%",
          }}
        >
          <PrintToPDF />
          {/* <>
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
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Select
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
                          Purchase order number
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
                          Date of PO
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
                          Amount
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
                          Dude Date
                        </TableCell>{" "}
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
                          Invoice Date
                        </TableCell>{" "}
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
                          Invoice number
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {SelectedItems.items.map((dataissues, index) => (
                        <>
                          {dataissues.selected ? (
                            <TableRow key={index}>
                              <TableCell>
                                <Checkbox checked={dataissues.selected} />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={dataissues.purchase_order_number}
                                ></TextField>
                              </TableCell>

                              <TableCell>
                                {" "}
                                <TextField
                                  value={dataissues.date_ofPO}
                                ></TextField>{" "}
                              </TableCell>

                              <TableCell>
                                {" "}
                                <TextField
                                  value={dataissues.amount}
                                ></TextField>{" "}
                              </TableCell>

                              <TableCell>
                                {" "}
                                <TextField
                                  value={dataissues.due_date}
                                ></TextField>{" "}
                              </TableCell>
                              <TableCell>
                                {" "}
                                <TextField
                                  value={dataissues.invoice_date}
                                ></TextField>{" "}
                              </TableCell>
                              <TableCell>
                                {" "}
                                <TextField
                                  value={dataissues.invoice_number}
                                ></TextField>{" "}
                              </TableCell>
                            </TableRow>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                Running total : {SelectedItems.amount}
              </CardContent>
            </Card>
          </> */}
        </Box>
      </Modal>
      <Modal
        open={isModalOpenItemsEdit}
        onClose={() => {
          setIsModalOpenItemsEdit(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "80%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            p: 2,
            top: "10%",
            left: "10%",
          }}
        >
          <Typography variant="h6" component="div" color="primary">
            Update Payment
          </Typography>

          <>
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
                            width: "auto",
                            height: "3vh",
                            color: "#096ac9",
                            fontSize: 16,
                          }}
                        >
                          Select
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
                          Purchase order number
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
                          Date of PO
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
                          Amount
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
                          Dude Date
                        </TableCell>{" "}
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
                          Invoice Date
                        </TableCell>{" "}
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
                          Invoice number
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {purchaseRecived.map((dataissues, index) => (
                        <TableRow key={index}>
                          {console.log("updatepayment", dataissues)}
                          <TableCell>
                            <Checkbox
                              checked={dataissues.selected}
                              onChange={(e) => {
                                if (dataissues.selected) {
                                  setRuningtolapay(
                                    (runingtolapay -= parseFloat(
                                      dataissues.amount
                                    ))
                                  );
                                } else {
                                  setRuningtolapay(
                                    (runingtolapay += parseFloat(
                                      dataissues.amount
                                    ))
                                  );
                                }
                                const updatedData = [...purchaseRecived];
                                updatedData[index] = {
                                  ...updatedData[index],
                                  selected: !dataissues.selected,
                                };
                                setPurchaseRecived(updatedData);
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={dataissues.purchase_order_number}
                            ></TextField>
                          </TableCell>

                          <TableCell>
                            {" "}
                            <TextField
                              value={dataissues.date_ofPO}
                            ></TextField>{" "}
                          </TableCell>

                          <TableCell>
                            {" "}
                            <TextField
                              onChange={(e) => {
                                if (dataissues.selected) {
                                  const updatedData = [...purchaseRecived];
                                  updatedData[index] = {
                                    ...updatedData[index],
                                    amount: e.target.value,
                                  };
                                  if (parseFloat(dataissues.amount)) {
                                    setRuningtolapay(
                                      (runingtolapay -= parseFloat(
                                        dataissues.amount
                                      ))
                                    );
                                  }
                                  if (parseFloat(e.target.value)) {
                                    setRuningtolapay(
                                      (runingtolapay += parseFloat(
                                        e.target.value
                                      ))
                                    );
                                  }

                                  setPurchaseRecived(updatedData);
                                }
                              }}
                              value={dataissues.amount}
                            ></TextField>{" "}
                          </TableCell>

                          <TableCell>
                            {" "}
                            <TextField
                              value={dataissues.due_date}
                            ></TextField>{" "}
                          </TableCell>
                          <TableCell>
                            {" "}
                            <TextField
                              value={dataissues.invoice_date}
                            ></TextField>{" "}
                          </TableCell>
                          <TableCell>
                            {" "}
                            <TextField
                              value={dataissues.invoice_number}
                            ></TextField>{" "}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                Running total : {runingtolapay}
              </CardContent>
            </Card>
            <Button
              onClick={handleAddIssueEdit}
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
            >
              Update Payment Order
            </Button>
          </>
        </Box>
      </Modal>
    </SideBar>
  );
}
