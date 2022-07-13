//! Default Compute@Edge template program.
//import welcomePage from "./welcome-to-compute@edge.html";

// The entry point for your application.
//
// Use this fetch event listener to define your main request handling logic. It could be
// used to route based on the request properties (such as method or path), send
// the request to a backend, make completely new requests, and/or generate
// synthetic responses.

addEventListener("fetch", (event: FetchEvent) => event.respondWith(handleRequest(event)));

async function handleRequest(event: FetchEvent) {
  // Get the client request.
  let req = event.request;

  // Filter requests that have unexpected methods.
  if (!["HEAD", "GET"].includes(req.method)) {
    return new Response("Hellow World - live update!", {
      status: 200,
    });
  }

  let url = new URL(req.url);

  // If request is to the `/` path...
  if (url.pathname != "/foo") {
    // Below are some common patterns for Compute@Edge services using JavaScript.
    // Head to https://developer.fastly.com/learning/compute/javascript/ to discover more.

    // Create a new request.
    // let bereq = new Request("http://example.com");

    // Add request headers.
    // req.headers.set("X-Custom-Header", "Welcome to Compute@Edge!");
    // req.headers.set(
    //   "X-Another-Custom-Header",
    //   "Recommended reading: https://developer.fastly.com/learning/compute"
    // );

    // Create a cache override.
    let cacheOverride = new CacheOverride("override", { ttl: 60 });

    //req.host = "content.guardianapis.com"
//    req.headers.host = "content.guardianapis.com"
    
    //req.headers.set("host", "www.theguardian.com")
    req.headers.set("host", "fastly-edge-cache-dev.dev-theguardian.com")

    req.headers.set("accept-encoding", "")
    req.headers.set("gu-dev", "cpscott")
    req.headers.forEach((v, k) => {
      console.log(`${k}=${v}`)
    })
    console.log(req.url)
    // Forward the request to a backend.
    //let beresp = await fetch("https://content.guardianapis.com/some-path", {
    let beresp = await fetch(req, {
      backend: "dotcom",
      cacheOverride,
    });

    console.log("beresp");
    console.log(beresp);

    beresp.headers.forEach((v, k) => {
      console.log(`${k}=${v}`)
    });

    const contentType = beresp.headers.get('content-type')
    const location = beresp.headers.get("location")
    if (location) {
      beresp.headers.set("location", location.replace("www.theguardian.com", "blindly-liberal-gobbler.edgecompute.app"))
      return beresp;
    } else if (contentType && contentType.startsWith("text/html")) {
      let j = await beresp.text().then((text) => {
        return text
          .replaceAll("bootCmp", "bootCmp-404")
          .replaceAll("graun.standard.js", "graun.standard-404.js")
          .replaceAll("graun.standalone.commercial.js", "graun.standalone-404.commercial.js")
          .replaceAll("https://www.theguardian.com", "https://blindly-liberal-gobbler.edgecompute.app")
          .replaceAll(". Boris Johnson", ". The clown we elected to run the country")
          .replaceAll(">Boris Johnson", ">The clown we elected to run the country")
          .replaceAll("Boris Johnson", "the clown we elected to run the country")
          .replaceAll("PM ", "Clown ")
          .replaceAll("Johnson", "Clown")
      })
      beresp.headers.append("Set-Cookie", "GU_TK=true; path=/; Secure;")
      const location = beresp.headers.get("location")
      if (location) {
        beresp.headers.set("location", location.replace("www.theguardian.com", "blindly-liberal-gobbler.edgecompute.app"))
      }
      return new Response(
        j, { 
          status: beresp.status,
          headers: beresp.headers,
        }
      );
    } else {
      return beresp;
    }
    // Remove response headers.
    // beresp.headers.delete("X-Another-Custom-Header");

    // Log to a Fastly endpoint.
    // const logger = fastly.getLogger("my_endpoint");
    // logger.log("Hello from the edge!");

    // Send a default synthetic response.
    // return new Response(welcomePage, {
    //   status: 200,
    //   headers: new Headers({ "Content-Type": "text/html; charset=utf-8" }),
    // });
  }

  // Catch all other requests and return a 404.
  return new Response("The page you requested could not be found", {
    status: 404,
  });
}
