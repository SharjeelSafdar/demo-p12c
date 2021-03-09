const faunaDB = require("faunadb"),
  q = faunaDB.query;
require("dotenv").config();

var client = new faunaDB.Client({ secret: process.env.FAUNA_SERVER_SECRET });

async function run() {
  try {
    // const result = await client.query(
    //   q.Create(q.Collection("todos"), {
    //     data: {
    //       text: "fifth todo",
    //       done: false,
    //       owner: "user-test",
    //     },
    //   })
    // );

    // const result = await client.query(
    //   q.Update(q.Ref(q.Collection("todos"), "292597756909847041"), {
    //     data: { done: true },
    //   })
    // );

    const result = await client.query(
      q.Paginate(q.Match(q.Index("todos_by_user"), "user-test-2"))
    );

    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

run();
