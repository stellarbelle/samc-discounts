import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";

import { MongoClient, ServerApiVersion } from "mongodb";

interface Person {
  name: string;
  surname: string;
  age: number;
}
//jqTRWTJCdjxPvImH
const uri =
  "mongodb+srv://stellarheath:jqTRWTJCdjxPvImH@cluster0.uebpbh8.mongodb.net/?retryWrites=true&w=majority";

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const person: Person = event.body ? JSON.parse(event.body) : "{}";
  return {
    statusCode: 400,
    body: JSON.stringify({ Person: person }),
  };
};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
