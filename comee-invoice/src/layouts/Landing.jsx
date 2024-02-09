import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

export default function Landing() {
  return (
    <div
      className="landing"
      style={{
        width: "100%",
        height: "100vh",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        display: "flex",
        gap: 20,
      }}
    >
      <Typography level="h1">WELCOME TO MAVEKO COMEE</Typography>
      <div
        className="landing"
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          gap: 20,
        }}
      >
        <Card sx={{ width: 400, height: 50 }}>
          <Button
            onClick={() => {
              localStorage.setItem("app", "order_management");
              window.location.href = "/co_listing";
            }}
            sx={{ width: "100%", height: "100vh" }}
          >
            ORDER MANAGEMENT APP
          </Button>
        </Card>
        <Card sx={{ width: 400, height: 50 }}>
          <Button
            onClick={() => {
              localStorage.setItem("app", "product_management");
              window.location.href = "/products";
            }}
            sx={{ width: "100%", height: "100vh" }}
          >
            PRICE AND PRODUCT MANAGEMENT APP
          </Button>
        </Card>
      </div>
    </div>
  );
}
