const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log('Data recieved: ', data)

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs"
  });

  client.query(
    q.Get(
      q.Match(
        q.Index("user_by_id"), data.id
      )
    )
  ).then(result => {createTeam(result.ref)})

  function createTeam(reference){
    client.query(
      q.Update(
        q.Ref(reference),
        { data: { playerBase: {teamName: data.team} } },
      )
    ).then(() => {
      theResponse = {result: "success"}
      console.log('Data sent: ', theResponse)
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(theResponse)
      });
    })
  }
}