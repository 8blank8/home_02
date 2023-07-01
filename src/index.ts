import { app } from "./setting";
import { runDb } from "./db/db";

const port = 5000;

app.set('trust proxy', true)

const startApp = async () => {

   await runDb()

   app.listen(port, () => {
      console.log(`app listen port ${port}`)
   })
}

startApp()