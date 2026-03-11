const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const data = require("./data-service");
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');

var storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage:storage });

const app = express();
dotenv.config();

// set HTTP_PORT
const HTTP_PORT = process.env.PORT || 8080;

// set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

// about route
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/employees/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addEmployee.html"));
});

app.get("/images/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", (req, res) => {

    fs.readdir("./public/images/uploaded", (err, files) => {
        if (err) {
            res.status(500).json({ message: "Unable to read images directory" });
        } else {
            res.json({ images: files });
        }
    });

});

app.post("/employees/add", (req, res) => {
  data.addEmployee(req.body)
    .then(() => {
      res.redirect("/employees");
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

// employees route
app.get("/employees", (req, res) => {
   if (req.query.status) {

    data.getEmployeesByStatus(req.query.status)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });

  } else if (req.query.department) {

    data.getEmployeesByDepartment(req.query.department)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });

  } else if (req.query.manager) {

    data.getEmployeesByManager(req.query.manager)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });

  } else {

    data.getAllEmployees()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });

  }
});

app.get("/employee/:num", (req, res) => {

  data.getEmployeeByNum(req.params.num)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });

});

// managers route
app.get("/managers", (req, res) => {
  data
    .getManagers()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

// departments route
app.get("/departments", (req, res) => {
  data
    .getDepartments()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

// 404 error handler for undefined routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// setup server
data
  .initialize()
  .then(function () {
    app.listen(HTTP_PORT, function () {
      console.log(`App listening on port: ${HTTP_PORT}`);
    });
  })
  .catch(function (err) {
    console.log(`Unable to start server: ${err}`);
  });
