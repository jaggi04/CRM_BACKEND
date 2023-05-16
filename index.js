const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 4050;



const adminRoute = require("./routes/adminauth/adminauth");
const managerRoute = require("./routes/managerauth/managerauth");
const employeeRoute = require("./routes/employeeauth/employeeauth");
const adminDashboardRoute = require("./routes/adminauth/adminDashboard");
const managerDashboardRoute = require("./routes/managerauth/managerDashboard");
const employeeDashboardRoute = require("./routes/employeeauth/employeeDashboard");

dotenv.config();



mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to Database")
);


app.use(express.json(), cors());




app.use("/api/admin", adminRoute);
app.use("/api/manager", managerRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/admindashboard", adminDashboardRoute);
app.use("/api/managerdashboard", managerDashboardRoute);
app.use("/api/employeedashboard", employeeDashboardRoute);

app.get("/", (req, res) => {
  res.send(
    `<a href="https://github.com/jaggi04/CRM_BACKEND"> , CRM backend</a>`
  );
});
app.listen(PORT, () => console.log(`server up and running at  ${PORT}`));

