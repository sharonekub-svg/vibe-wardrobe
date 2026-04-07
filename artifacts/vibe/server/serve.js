/**
 * Standalone production server for Expo static builds.
 *
 * Serves the output of build.js (static-build/) with two special routes:
 * - GET / or /manifest with expo-platform header → platform manifest JSON
 * - GET / without expo-platform → landing page HTML
 * Everything else falls through to static file serving from ./static-build/.
 *
 * Zero external dependencies — uses only Node.js built-ins (http, fs, path).
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const STATIC_ROOT = path.resolve(__dirname, "..", "static-build");
const TEMPLATE_PATH = path.resolve(__dirname, "templates", "landing-page.html");
const basePath = (process.env.BASE_PATH || "/").replace(/\/+$/, "");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".map": "application/json",
};

function getAppName() {
  try {
    const appJsonPath = path.resolve(__dirname, "..", "app.json");
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf-8"));
    return appJson.expo?.name || "App Landing Page";
  } catch {
    return "App Landing Page";
  }
}

function serveManifest(platform, res) {
  const manifestPath = path.join(STATIC_ROOT, platform, "manifest.json");

  if (!fs.existsSync(manifestPath)) {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(
      JSON.stringify({ error: `Manifest not found for platform: ${platform}` }),
    );
    return;
  }

  const manifest = fs.readFileSync(manifestPath, "utf-8");
  res.writeHead(200, {
    "content-type": "application/json",
    "expo-protocol-version": "1",
    "expo-sfv-version": "0",
  });
  res.end(manifest);
}

function serveLandingPage(req, res, landingPageTemplate, appName) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = forwardedProto || "https";
  const host = req.headers["x-forwarded-host"] || req.headers["host"];
  const baseUrl = `${protocol}://${host}`;
  const expsUrl = `${host}`;

  const html = landingPageTemplate
    .replace(/BASE_URL_PLACEHOLDER/g, baseUrl)
    .replace(/EXPS_URL_PLACEHOLDER/g, expsUrl)
    .replace(/APP_NAME_PLACEHOLDER/g, appName);

  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(html);
}

function serveStaticFile(urlPath, res) {
  const safePath = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = path.join(STATIC_ROOT, safePath);

  if (!filePath.startsWith(STATIC_ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const content = fs.readFileSync(filePath);
  res.writeHead(200, { "content-type": contentType });
  res.end(content);
}

const landingPageTemplate = fs.readFileSync(TEMPLATE_PATH, "utf-8");
const appName = getAppName();

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CURATED_ITEMS = [
  { id: "div-1001", name: "Ribbed Knit Sweater", price: 24.99, formattedPrice: "$24.99", imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80", category: "Knitwear", collection: "divided", tags: ["knitwear","sweater","ribbed","tops","cosy"], buyUrl: "https://www2.hm.com/en_us/women/products/knitwear.html" },
  { id: "div-1002", name: "Floral Wrap Mini Dress", price: 34.99, formattedPrice: "$34.99", imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80", category: "Dresses", collection: "divided", tags: ["dress","floral","wrap","mini","feminine"], buyUrl: "https://www2.hm.com/en_us/women/products/dresses.html" },
  { id: "div-1003", name: "High-Rise Mom Jeans", price: 39.99, formattedPrice: "$39.99", imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80", category: "Jeans", collection: "divided", tags: ["jeans","denim","mom-jeans","high-rise","bottoms"], buyUrl: "https://www2.hm.com/en_us/women/products/jeans.html" },
  { id: "div-1004", name: "Oversized Crop Hoodie", price: 29.99, formattedPrice: "$29.99", imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80", category: "Tops", collection: "divided", tags: ["hoodie","oversized","crop","casual","tops"], buyUrl: "https://www2.hm.com/en_us/women/products/hoodies-sweatshirts.html" },
  { id: "div-1005", name: "Pleated Mini Skirt", price: 27.99, formattedPrice: "$27.99", imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80", category: "Skirts", collection: "divided", tags: ["skirt","mini","pleated","bottoms","feminine"], buyUrl: "https://www2.hm.com/en_us/women/products/skirts.html" },
  { id: "div-1006", name: "Puff Sleeve Blouse", price: 22.99, formattedPrice: "$22.99", imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?auto=format&fit=crop&w=600&q=80", category: "Blouses", collection: "divided", tags: ["blouse","puff-sleeve","white","tops","romantic"], buyUrl: "https://www2.hm.com/en_us/women/products/blouses-tunics.html" },
  { id: "div-1007", name: "Satin Slip Midi Dress", price: 44.99, formattedPrice: "$44.99", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80", category: "Dresses", collection: "divided", tags: ["dress","satin","slip","midi","elegant"], buyUrl: "https://www2.hm.com/en_us/women/products/dresses.html" },
  { id: "div-1008", name: "Wide-Leg Cargo Pants", price: 39.99, formattedPrice: "$39.99", imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80", category: "Trousers", collection: "divided", tags: ["cargo","wide-leg","trousers","bottoms","casual"], buyUrl: "https://www2.hm.com/en_us/women/products/trousers.html" },
  { id: "div-1009", name: "Ribbed Crop Top", price: 14.99, formattedPrice: "$14.99", imageUrl: "https://images.unsplash.com/photo-1562572159-4efc207f5aff?auto=format&fit=crop&w=600&q=80", category: "Tops", collection: "divided", tags: ["crop-top","ribbed","tops","basic","casual"], buyUrl: "https://www2.hm.com/en_us/women/products/tops.html" },
  { id: "div-1010", name: "Floral Midi Skirt", price: 34.99, formattedPrice: "$34.99", imageUrl: "https://images.unsplash.com/photo-1596171446957-56a8c1e88327?auto=format&fit=crop&w=600&q=80", category: "Skirts", collection: "divided", tags: ["skirt","midi","floral","bottoms","feminine","pink"], buyUrl: "https://www2.hm.com/en_us/women/products/skirts.html" },
  { id: "pb-3001", name: "Boho Floral Maxi Dress", price: 35.99, formattedPrice: "$35.99", imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80", category: "Dresses", collection: "pullbear", tags: ["dress","boho","floral","maxi","summer","feminine"], buyUrl: "https://www.pullandbear.com/en/woman/clothing/dresses-n5901" },
  { id: "pb-3002", name: "Straight-Leg Denim Jeans", price: 29.99, formattedPrice: "$29.99", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80", category: "Jeans", collection: "pullbear", tags: ["jeans","denim","straight-leg","bottoms","casual"], buyUrl: "https://www.pullandbear.com/en/woman/clothing/jeans-n5897" },
  { id: "pb-3003", name: "Oversized Graphic Sweatshirt", price: 27.99, formattedPrice: "$27.99", imageUrl: "https://images.unsplash.com/photo-1502716119720-816e28e10df5?auto=format&fit=crop&w=600&q=80", category: "Sweatshirts", collection: "pullbear", tags: ["sweatshirt","graphic","oversized","casual","tops"], buyUrl: "https://www.pullandbear.com/en/woman/clothing/sweatshirts-n5908" },
  { id: "pb-3004", name: "Knit Crochet Crop Top", price: 22.99, formattedPrice: "$22.99", imageUrl: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=600&q=80", category: "Tops", collection: "pullbear", tags: ["crop-top","crochet","knit","boho","tops","summer"], buyUrl: "https://www.pullandbear.com/en/woman/clothing/tops-n5903" },
  { id: "pb-3005", name: "Longline Trench Coat", price: 69.99, formattedPrice: "$69.99", imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80", category: "Coats", collection: "pullbear", tags: ["coat","trench","beige","outerwear","classic"], buyUrl: "https://www.pullandbear.com/en/woman/clothing/coats-n5910" },
  { id: "wmn-2001", name: "Silk-Look Shirt Dress", price: 54.99, formattedPrice: "$54.99", imageUrl: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80", category: "Dresses", collection: "ladies", tags: ["dress","shirt-dress","silk","midi","elegant"], buyUrl: "https://www2.hm.com/en_us/women/products/dresses.html" },
  { id: "wmn-2002", name: "Tailored Wide-Leg Trousers", price: 49.99, formattedPrice: "$49.99", imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80", category: "Trousers", collection: "ladies", tags: ["trousers","wide-leg","tailored","bottoms","smart"], buyUrl: "https://www2.hm.com/en_us/women/products/trousers.html" },
  { id: "wmn-2003", name: "Fitted Blazer — Black", price: 69.99, formattedPrice: "$69.99", imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80", category: "Jackets", collection: "ladies", tags: ["blazer","fitted","jacket","outerwear","smart","black"], buyUrl: "https://www2.hm.com/en_us/women/products/jackets-coats.html" },
  { id: "wmn-2004", name: "Cropped Leather Biker Jacket", price: 79.99, formattedPrice: "$79.99", imageUrl: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=600&q=80", category: "Jackets", collection: "ladies", tags: ["jacket","leather","biker","cropped","outerwear","black","edgy"], buyUrl: "https://www2.hm.com/en_us/women/products/jackets-coats.html" },
  { id: "wmn-2005", name: "Smocked Maxi Dress", price: 64.99, formattedPrice: "$64.99", imageUrl: "https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=600&q=80", category: "Dresses", collection: "ladies", tags: ["dress","maxi","smocked","summer","feminine"], buyUrl: "https://www2.hm.com/en_us/women/products/dresses.html" },
];

async function handleApiRequest(req, res, pathname, searchParams) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  if (pathname === "/api/fashion/items") {
    const apiKey = process.env.RAPIDAPI_KEY;
    const ageNum = searchParams.get("age") ? parseInt(searchParams.get("age")) : null;

    if (apiKey) {
      try {
        const categoryId = ageNum !== null && ageNum < 20 ? "2623" : "4209";
        const apiUrl = new URL("https://asos2.p.rapidapi.com/products/v2/list");
        apiUrl.searchParams.set("store", "US");
        apiUrl.searchParams.set("offset", "0");
        apiUrl.searchParams.set("categoryId", categoryId);
        apiUrl.searchParams.set("country", "US");
        apiUrl.searchParams.set("sort", "freshness");
        apiUrl.searchParams.set("limit", "48");
        apiUrl.searchParams.set("lang", "en-US");
        apiUrl.searchParams.set("currency", "USD");

        const response = await fetch(apiUrl.toString(), {
          headers: { "X-RapidAPI-Key": apiKey, "X-RapidAPI-Host": "asos2.p.rapidapi.com" },
        });

        if (response.ok) {
          const data = await response.json();
          const items = (data.products || [])
            .filter(i => i.id && i.name && i.imageUrl)
            .filter(i => !i.name.toLowerCase().includes("men"))
            .map(i => ({
              id: String(i.id),
              name: i.name,
              price: i.price?.current?.value || 0,
              formattedPrice: i.price?.current?.text || `$${i.price?.current?.value || 0}`,
              imageUrl: `https://images.asos-media.com/products/${i.imageUrl}`,
              category: "Women's",
              collection: ageNum !== null && ageNum < 20 ? "divided" : "ladies",
              tags: ["fashion", "women", "asos"],
              buyUrl: `https://www.asos.com/us/${i.url}`,
            }));

          if (items.length > 0) {
            res.writeHead(200);
            res.end(JSON.stringify({ items: shuffle(items), source: "live" }));
            return;
          }
        }
      } catch (e) {
        console.error("ASOS API error:", e.message);
      }
    }

    const pool = ageNum !== null && ageNum < 20
      ? CURATED_ITEMS.filter(i => i.collection === "divided" || i.collection === "pullbear")
      : CURATED_ITEMS;

    res.writeHead(200);
    res.end(JSON.stringify({ items: shuffle(pool), source: "curated" }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  let pathname = url.pathname;

  if (basePath && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length) || "/";
  }

  if (pathname.startsWith("/api/")) {
    return handleApiRequest(req, res, pathname, url.searchParams);
  }

  if (pathname === "/" || pathname === "/manifest") {
    const platform = req.headers["expo-platform"];
    if (platform === "ios" || platform === "android") {
      return serveManifest(platform, res);
    }

    if (pathname === "/") {
      return serveLandingPage(req, res, landingPageTemplate, appName);
    }
  }

  serveStaticFile(pathname, res);
});

const port = parseInt(process.env.PORT || "3000", 10);
server.listen(port, "0.0.0.0", () => {
  console.log(`Serving static Expo build on port ${port}`);
});
