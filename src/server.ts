import express, { Express } from "express";
import { configDotenv } from "dotenv";
import routes from "./routes";

const app: Express = express();

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
