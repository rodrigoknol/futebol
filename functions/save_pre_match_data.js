const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log('Data recieved: ', data)

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs"
  });

  client
    .query(q.Create(q.Collection("preMatchData"), { data }))
    .then(response => {
      const preMatch = response;
      console.log("first success", preMatch);

      client.query(
        q.Get(
          q.Match(
            q.Index("user_by_id"), data.homeTeam.player
          )
        )
      ).then(result => {updateTeam(result.ref)})

      function updateTeam(reference){
        const startingTeam = data.homeTeam;

        client.query(
          q.Update(
            q.Ref(reference),
            { data: { playerBase: {startingTeam: startingTeam} } },
          )
        ).then((updatedUser)=>{
          console.log('userUpdated: ', updatedUser)
          return callback(null, {
            statusCode: 200,
            body: JSON.stringify(preMatch.ref)
          });
        })
      }      
    });
};
