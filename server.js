import http from "http";
import { promises } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const port = 3000;

const servePageHTML = async (routeName) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const route = routeName == "/" ? "index" : routeName.slice(1);
  const filePath = path.join(__dirname, route);

  try {
    const file = await promises.readFile(filePath + "/index.html", {
      encoding: "utf-8",
    });

    return {
      statusCode: 200,
      contentType: "text/html",
      data: file,
    };
  } catch (err) {
    if (err instanceof Error)
      return {
        statusCode: 500,
        contentType: "text/plain",
        data: "Internal Server Error",
      };
  }
};

const server = http.createServer(async (req, res) => {
  console.log("New request:", req.url);

  const validRoute = /^\/[a-zA-Z0-9_-]+$/;
  validRoute.lastIndex = 0;
  if (!validRoute.test(req.url) && req.url != "/") {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Invalid request");
    return;
  }

  const htmlServeRequest = await servePageHTML(req.url);
  res.writeHead(htmlServeRequest.statusCode, {
    "Content-Type": htmlServeRequest.contentType,
    "Content-Security-Policy": "default-src 'self'",
  });
  res.end(htmlServeRequest.data);
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
