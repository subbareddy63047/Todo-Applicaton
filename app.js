const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");
const sqlite3 = require("sqlite3");
let db = null;

const initializeAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB error:${error.message}`);
    process.exit(1);
  }
};

initializeAndServer();

//API1

app.get("/todos/", async (request, response) => {
  let { status, priority, search_q } = request.query;
  if (status === "TO%20DO") {
    status = "TO DO";
  }
  if (status === "IN%20PROGRESS") {
    status = "IN PROGRESS";
  }
  if (status === "TO DO") {
    const query = `
select * from todo
where status="${status}";`;
    const results = await db.all(query);
    response.send(results);
  } else if (status === "IN PROGRESS" && priority === "HIGH") {
    const query2 = `
select * from todo
where priority="HIGH" AND status="IN PROGRESS";`;

    const results = await db.all(query2);
    response.send(results);
  } else if (priority === "HIGH") {
    const query1 = `
select * from todo
where priority="${priority}";`;

    const results = await db.all(query1);
    response.send(results);
  } else {
    const query4 = `
    select * from todo
    where todo LIKE  "%${search_q}%";`;
    const results = await db.all(query4);
    response.send(results);
  }
});

//API2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `
    select * from todo
    where id=${todoId};`;
  const results = await db.get(query);
  response.send(results);
});

//API3

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const query10 = `
    insert into todo
    (id,todo,priority,status)
    values
        (${id},"${todo}","${priority}","${status}");`;
  const results = await db.run(query10);
  response.send("Todo Successfully Added");
});

//API4

app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { status, priority, todo } = request.body;
  if (status !== undefined && priority === undefined && todo === undefined) {
    const update = `
        update todo
        set
        status="${status}"
        where id=${todoId};`;
    const results = await db.run(update);
    response.send("Status Updated");
  }
  if (status === undefined && priority !== undefined && todo === undefined) {
    const update1 = `
        update todo
        set
        priority="${priority}"
        where id=${todoId};`;
    const results = await db.run(update1);
    response.send("Priority Updated");
  }

  if (status === undefined && priority === undefined && todo !== undefined) {
    const update2 = `
        update todo
        set
        todo="${todo}"
        where id=${todoId};`;
    const results = await db.run(update2);
    response.send("Todo Updated");
  }
});

//API5

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const del1 = `
    delete from todo
    where id=${todoId};`;
  const results = await db.run(del1);
  response.send("Todo Deleted");
});

module.exports = app;
