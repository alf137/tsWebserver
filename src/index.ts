import express from "express";
import { middlewareLogResponse } from "./api/middleware/middlewareLogRes.js";
import { asyncError, errorHandler, middlewareMetricsInc } from "./api/middleware.js";
import { handlerReset } from "./admin/reset.js";
import { handlerMetrics } from "./admin/metrics.js";
import { handlerChirpsValidate } from "./api/validate_chirp.js";
import { BadRequestError } from "./api/errors/badReq.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(middlewareLogResponse)
app.use("/app",middlewareMetricsInc, express.static("./src/app"));
app.get("/admin/metrics", handlerMetrics)
app.post("/admin/reset", handlerReset)
app.post("/api/validate_chirp", asyncError(handlerChirpsValidate))
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
app.use(errorHandler)


