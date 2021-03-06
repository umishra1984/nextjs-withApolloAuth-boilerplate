import { createServer } from "http";
import * as next from "next";
import { routes } from "./routes";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4200;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = routes.getRequestHandler(app);

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    //  if (err) {throw err;}
    console.log(`> Ready on http://localhost:${port}`);
  });
});
