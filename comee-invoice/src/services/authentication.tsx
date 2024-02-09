export function authenticate(
  email: string,
  password: string,
  message: (msg: string) => void,
  severity: (type: string) => void,
  pop: (value: boolean) => void
) {
  const baseUrl: string = import.meta.env.VITE_BASE_URL;
  fetch(`${baseUrl}/comee_core/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth: {
        email: email,
        password: password,
      },
    }),
  })
    .then((response) => response.json())
    .then((data: { error?: string; user?: { user_type: string; id: string; name: string }; token?: string }) => {
      if (data.error) {
        message(data.error);
        severity("error");
        pop(true);
      } else {
        if (data.user?.user_type === "supplier") {
          message("Unauthorized access to sales system");
          severity("error");
          pop(true);
        } else {
          localStorage.setItem("token", data.token || '');
          localStorage.setItem("user_id", data.user?.id || '');
          localStorage.setItem("user_type", data.user?.user_type || '');
          localStorage.setItem("username", data.user?.name || '');
          window.location.href = "/SalesInvoiceIssues";
        }
      }
    })
    .catch((error) => {
      message("Unable to login, please try again");
      severity("error");
      pop(true);
      console.error("Error during login:", error);
    });
}
