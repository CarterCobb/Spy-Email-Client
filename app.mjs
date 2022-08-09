import express from "express";

import * as NSR from "node-server-router";
import Session from "./session.mjs";

const app = express();
app.use(express.json({ limit: "50mb" }));
NSR.RouteFactory.applyRoutesTo(app, { api_version: "/v1" });
Session.configureOn(app);
app.listen(6969, () =>
  console.log(`[pid:${process.pid}] Listening on port: 6969.`)
);
