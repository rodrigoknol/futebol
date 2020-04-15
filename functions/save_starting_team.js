const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  let data = JSON.parse(event.body);
  console.log('Data recieved: ', data)

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs"
  });

  client.query(
    q.Get(
      q.Match(
        q.Index("user_by_id"), data.player
      )
    )
  ).then(result => {updateTeam(result.ref)})

  function updateTeam(reference){
    client.query(
      q.Update(
        q.Ref(reference),
        { data: { playerBase: {startingTeam: data} } },
      )
    ).then((updatedUser)=>{
      console.log('userUpdated: ', updatedUser)
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({result: 'success'})
      });
    })
  }
}