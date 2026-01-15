function api(action, data) {
  return new Promise((resolve) => {

    // mock user
    if (action === "login") {
      if (data.username === "admin" && data.password === "1234") {
        resolve({
          success: true,
          role: "ADMIN",
          dept: "IT"
        });
      } else {
        resolve({ success: false });
      }
    }

  });
}
