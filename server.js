let express = require("express");
let app = express();
let reloadMagic = require("./reload-magic.js");
reloadMagic(app);
let multer = require("multer");
let upload = multer();
let cookieParser = require("cookie-parser");
app.use(cookieParser());
let fetch = require("node-fetch");
let cors = require("cors");
app.use(cors());

let mongoClient = require("mongodb").MongoClient;
let dbo = undefined;
(async () => {
  console.log("INSIDE CONNECT TO MONGO");
  let url =
    "mongodb+srv://bob:yQ6sVFYQo5y0b6Gq@cluster-lf5ba.mongodb.net/test?retryWrites=true&w=majority";
  let dbName = "habitica-goals-database";

  await mongoClient.connect(
    url,
    {
      useNewURLParser: true
    },
    (err, db) => {
      dbo = db.db(dbName);
    }
  );
})();

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

let getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;
let getTagIdByName = event => tagName => {
  let tagInfo = event["data"].filter(tag => {
    if (tagName === tag["name"]) {
      return tag["id"];
    }
  });
  return tagInfo[0].id;
};

app.post("/DeleteAllMessages", upload.none(), (req, res) => {
  let isFrom = req.body.isFrom;
  console.log("INSIDE DELETE ALL MESSAGES from", isFrom);
  dbo.collection("messages").deleteMany({
    isFrom: isFrom
  });
  dbo
    .collection("messages")
    .find({})
    .toArray((err, result) => {
      if (err) {
        console.log("ERROR IN DELETEALLMESSSAGES");
        res.json({
          success: false
        });
      }
      console.log("MESSAGES NOW LEFT", result);
    });
  res.json({
    success: true
  });
});

app.post("/Login", upload.none(), (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let cookie = parseInt(res.cookie.sid);
  console.log("Cookie", cookie);
  dbo
    .collection("users")
    .find({
      username: username,
      password: password
    })
    .toArray((err, result) => {
      if (err) {
        console.log("ERROR IN LOGIN", err);
        res.json({
          success: false
        });
        return;
      }
      console.log("USER DB RESULT IN LOGIN", result);
      if (result[0] === undefined) {
        res.json({
          success: false
        });
        return;
      }
      // Test if user's browswer has a cookie but it doesn't have to match if the username & pass is right
      if (cookie === undefined && result[0] === undefined) {
        res.json({
          success: false
        });
        return;
      }
      res.json({
        success: true,
        user: result[0]
      });
    });
});

app.post("/Signup", upload.none(), async (req, res) => {
  let id = req.body.id;
  let token = req.body.token;
  let username = req.body.username;
  let password = req.body.password;
  let name = req.body.name;
  let cookie = getRandomNumber(1000, 9000);
  res.cookie("sid", cookie);
  console.log("NEW COOKIE", cookie);
  let usernameTaken;
  await dbo
    .collection("users")
    .find({
      username: username
    })
    .toArray((err, result) => {
      if (err) {
        console.log("ERROR IN SIGNUP", err);
        res.json({
          success: false
        });
        return;
      }
      usernameTaken = result.some(account => account.username === username);
      console.log("Username exists?", usernameTaken);
    });
  if (usernameTaken) {
    console.log("USERNAME IS TAKEN");
    res.json({
      success: false
    });
    return;
  } else {
    await dbo.collection("users").insertOne({
      name: name,
      username: username,
      password: password,
      sessionId: parseInt(cookie),
      id: id,
      token: token
    });
    await dbo
      .collection("users")
      .find({
        username: username
      })
      .toArray((err, result) => {
        if (err) {
          console.log("ERROR IN SIGNUP", err);
          res.json({
            success: false
          });
          return;
        }
        console.log("New user", result);
      });
    res.json({
      success: true
    });
  }
});

app.post("/PostProgress", upload.none(), async (req, res) => {
  console.log("IN POSTPROGRESS");

  let progress = JSON.parse(req.body.progress);
  console.log("Progress", typeof progress, progress, "User", progress.user);

  await dbo
    .collection("progress")
    .find({
      user: progress.user
    })
    .toArray((err, result) => {
      if (err) {
        console.log("ERROR IN SIGNUP", err);
        res.json({
          success: false
        });
        return;
      }
      if (result[0] !== undefined) {
        dbo.collection("progress").remove({
          user: progress.user
        });
      }
    });

  await dbo.collection("progress").insertOne({
    user: progress.user,
    habits: progress.habits,
    dailies: progress.dailies
  });
  res.json({
    success: true
  });
});

app.post("/GetProgress", upload.none(), (req, res) => {
  console.log("IN GET PROGRESS");
  let user = req.body.user;
  console.log("GETTING", user, "PROGRESS");
  dbo
    .collection("progress")
    .find({
      user: user
    })
    .toArray((err, result) => {
      if (err) {
        console.log("ERROR IN GETPROGRESS", err);
        return;
      }
      console.log("Got progress", result);
      let progress = result;
      res.json({
        success: true,
        progress: progress
      });
      return;
    });
});

app.post("/TasksFromGoal", upload.none(), (req, res) => {
  let tag = req.body.tag;
  let tagData = JSON.parse(req.body.tagData);
  let id = getTagIdByName(tagData)(tag);
  if (tag !== undefined) {
    res.json({
      success: true,
      goal: tag,
      tagData: tagData,
      tagId: id
    });
    return;
  }
  res.json({
    success: false
  });
});

app.post("/GetMessages", upload.none(), (req, res) => {
  console.log("INSIDE MESSAGES");
  let isFor = req.body.isFor;
  dbo
    .collection("messages")
    .find({
      isFor: isFor
    })
    .toArray((err, result) => {
      if (err) {
        console.log("ERROR IN MESSSAGES");
        res.json({
          success: false
        });
        return;
      }
      // if (result[0] === undefined) {
      //   console.log(result);
      //   res.json({
      //     success: false,
      //     messages: []
      //   });
      //   return;
      // }
      console.log("MESSAGES", result);
      res.json({
        success: true,
        messages: result
      });
    });
});

app.post("/PostMessage", upload.none(), (req, res) => {
  console.log(
    "INSIDE POST MESSAGE",
    req.body.isFor,
    req.body.type,
    req.body.time,
    req.body.isFrom,
    req.body.content,
    req.body.dayPosted
  );
  dbo.collection("messages").insertOne({
    type: req.body.type,
    isFor: req.body.isFor,
    time: req.body.time,
    isFrom: req.body.isFrom,
    content: req.body.content,
    dayPosted: req.body.dayPosted
  });
  res.json({
    success: true
  });
});

app.post("/DeleteMessage", upload.none(), (req, res) => {
  console.log(
    "INSIDE DELETE MESSAGE",
    req.body.time,
    req.body.isFor,
    req.body.isFrom
  );
  let timestamp = req.body.time;
  let isFor = req.body.isFor;
  let isFrom = req.body.isFrom;
  dbo.collection("messages").remove({
    time: timestamp,
    isFor: isFor,
    isFrom: isFrom
  });
  res.json({
    success: true
  });
});

app.post("/PostGif", upload.none(), async (req, res) => {
  let gifReq = req.body.gif;
  if (gifReq !== undefined) {
    let gifRes = await fetch(
      "http://api.giphy.com/v1/gifs/search?q=" +
        gifReq +
        "&api_key=cIEiTtGYxdzo8xhrHCDqHiM9pwPFEgFs&limit=8"
    );
    let gifResText = await gifRes.text();
    let gifResBody = JSON.parse(gifResText);
    console.log("giphy response", gifResBody);
    res.json({
      success: true,
      gifData: gifResBody
    });
    return;
  }
  res.json({
    success: false,
    message: "Gif query is undefined"
  });
});

app.get("/ClearDatabase", upload.none(), (req, res) => {
  dbo.collection("users").drop();
});

app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
