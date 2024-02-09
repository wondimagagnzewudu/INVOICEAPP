import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AlertMessage from "../components/Alert";
import { Input, Button, Typography, TextField } from "@mui/material";
import Divider from "@mui/material/Divider";
import { authenticate } from "../services/authentication";
import { UilEnvelope } from "@iconscout/react-unicons";
import { UilKeyholeCircle } from "@iconscout/react-unicons";

const textFieldStyle: React.CSSProperties = {
  width: "100%",
  marginBottom: 15,
};

export default function Auth(): JSX.Element {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [severity, setSeverity] = useState<string | undefined>();

  const handleLogin = () => {
    if (email && password) {
      authenticate(email, password, setMessage, setSeverity, setOpenAlert);
    }
  };

  return (
    <div
      className="authCard"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AlertMessage
        open={openAlert}
        setOpen={setOpenAlert}
        message={message}
        severity={severity}
      ></AlertMessage>
      <Card sx={{ minWidth: 600, mt: "10%" }}>
        <CardContent>
          <div
            className="title"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography level="h4">COMee Invoice</Typography>
            <Typography level="body-lg">MAVEKO</Typography>
          </div>
          <Divider sx={{ mb: 2, mt: 1 }} />
          <TextField
            style={textFieldStyle}
            type="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email || ""}
          />
          <TextField
            style={textFieldStyle}
            type="password"
            placeholder="Password"
            value={password || ""}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button
            sx={{ p: 1.5, width: "100%" }}
            color="primary"
            variant="contained"
            onClickCapture={() => {
              handleLogin();
            }}
          >
            LOGIN
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
