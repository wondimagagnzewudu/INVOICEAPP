import * as React from "react";
const { useState, useRef } = React;
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Auth from "./layouts/Auth";
import SalesInvoiceIssues from "./components/SlaseInvoicMangment/InvoiceIssues";
import SalesPaymentIssues from "./components/SlaseInvoicMangment/PaymentIssues";
import PurchaseInvoiceIssues from "./components/PurchaseInvoiceManagement/InvoiceIssues";
import PurchasePaymentIssues from "./components/PurchaseInvoiceManagement/PaymentIssues";
import Summery from "./components/Summery/Summery";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/SalesInvoiceIssues" element={<SalesInvoiceIssues />} />
          <Route path="/PurchaseInvoiceIssues" element={<PurchaseInvoiceIssues />} />
          <Route path="/PurchasePaymentIssues" element={<PurchasePaymentIssues />} />
          <Route path="/SalesPaymentIssues" element={<SalesPaymentIssues />} />
          <Route path="/Summery" element={<Summery />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
