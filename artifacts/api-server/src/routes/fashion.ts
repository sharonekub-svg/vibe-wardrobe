import { Router } from "express";

const router = Router();

// Fisher-Yates shuffle — fresh random order on every request (fixes same-clothes bug)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// H&M Divided women's collection — teen-focused (age < 20)
// Every image URL is matched exactly to the product text
const DIVIDED_ITEMS = [
  {
    id: "div-1001",
    name: "Ribbed Knit Sweater",
    price: 24.99,
    formattedPrice: "$24.99",
    imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80",
    category: "Knitwear",
    collection: "divided",
    tags: ["knitwear", "sweater", "ribbed", "tops", "cosy"],
    buyUrl: "https://www2.hm.com/en_us/women/products/knitwear.html",
  },
  {
    id: "div-1002",
    name: "Floral Wrap Mini Dress",
    price: 34.99,
    formattedPrice: "$34.99",
    imageUrl: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80",
    category: "Dresses",
    collection: "divided",
    tags: ["dress", "floral", "wrap", "mini", "feminine"],
    buyUrl: "https://www2.hm.com/en_us/women/products/dresses.html",
  },
  {
    id: "div-1003",
    name: "High-Rise Mom Jeans",
    price: 39.99,
    formattedPrice: "$39.99",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
    category: "Jeans",
    collection: "divided",
    tags: ["jeans", "denim", "mom-jeans", "high-rise", "bottoms"],
    buyUrl: "https://www2.hm.com/en_us/women/products/jeans.html",
  },
  {
    id: "div-1004",
    name: "Oversized Crop Hoodie",
    price: 29.99,
    formattedPrice: "$29.99",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    category: "Tops",
    collection: "divided",
    tags: ["hoodie", "oversized", "crop", "casual", "tops"],
    buyUrl: "https://www2.hm.com/en_us/women/products/hoodies-sweatshirts.html",
  },
  {
    id: "div-1005",
    name: "Pleated Mini Skirt",
    price: 27.99,
    formattedPrice: "$27.99",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4b4f45?w=600&q=80",
    category: "Skirts",
    collection: "divided",
    tags: ["skirt", "mini", "pleated", "bottoms", "feminine"],
    buyUrl: "https://www2.hm.com/en_us/women/products/skirts.html",
  },
  {
    id: "div-1006",
    name: "Puff Sleeve Blouse",
    price: 22.99,
    formattedPrice: "$22.99",
    imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=600&q=80",
    category: "Blouses",
    collection: "divided",
    tags: ["blouse", "puff-sleeve", "white", "tops", "romantic"],
    buyUrl: "https://www2.hm.com/en_us/women/products/blouses-tunics.html",
  },
  {
    id: "div-1007",
    name: "Satin Slip Midi Dress",
    price: 44.99,
    formattedPrice: "$44.99",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    category: "Dresses",
    collection: "divided",
    tags: ["dress", "satin", "slip", "midi", "elegant"],
    buyUrl: "https://www2.hm.com/en_us/women/products/dresses.html",
  },
  {
    id: "div-1008",
    name: "Wide-Leg Cargo Pants",
    price: 39.99,
    formattedPrice: "$39.99",
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    category: "Trousers",
    collection: "divided",
    tags: ["cargo", "wide-leg", "trousers", "bottoms", "casual"],
    buyUrl: "https://www2.hm.com/en_us/women/products/trousers.html",
  },
  {
    id: "div-1009",
    name: "Ribbed Crop Top",
    price: 14.99,
    formattedPrice: "$14.99",
    imageUrl: "https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=600&q=80",
    category: "Tops",
    collection: "divided",
    tags: ["crop-top", "ribbed", "tops", "basic", "casual"],
    buyUrl: "https://www2.hm.com/en_us/women/products/tops.html",
  },
  {
    id: "div-1010",
    name: "Floral Midi Skirt — Pink",
    price: 34.99,
    formattedPrice: "$34.99",
    imageUrl: "https://images.unsplash.com/photo-1596171446957-56a8c1e88327?w=600&q=80",
    category: "Skirts",
    collection: "divided",
    tags: ["skirt", "midi", "floral", "bottoms", "feminine", "pink"],
    buyUrl: "https://www2.hm.com/en_us/women/products/skirts.html",
  },
  {
    id: "div-1011",
    name: "Denim Jacket — Light Wash",
    price: 49.99,
    formattedPrice: "$49.99",
    imageUrl: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80",
    category: "Jackets",
    collection: "divided",
    tags: ["denim", "jacket", "light-wash", "outerwear", "casual"],
    buyUrl: "https://www2.hm.com/en_us/women/products/jackets-coats.html",
  },
  {
    id: "div-1012",
    name: "Oversized Knit Cardigan",
    price: 37.99,
    formattedPrice: "$37.99",
    imageUrl: "https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?w=600&q=80",
    category: "Knitwear",
    collection: "divided",
    tags: ["cardigan", "knitwear", "oversized", "tops", "cosy"],
    buyUrl: "https://www2.hm.com/en_us/women/products/knitwear.html",
  },
  {
    id: "div-1013",
    name: "Lace-Trim Cami Top",
    price: 17.99,
    formattedPrice: "$17.99",
    imageUrl: "https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=600&q=80",
    category: "Tops",
    collection: "divided",
    tags: ["cami", "lace-trim", "tops", "feminine", "white"],
    buyUrl: "https://www2.hm.com/en_us/women/products/tops.html",
  },
  {
    id: "div-1014",
    name: "Corset-Style Top — Brown",
    price: 22.99,
    formattedPrice: "$22.99",
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
    category: "Tops",
    collection: "divided",
    tags: ["corset", "tops", "trendy", "brown"],
    buyUrl: "https://www2.hm.com/en_us/women/products/tops.html",
  },
  {
    id: "div-1015",
    name: "Satin Mini Shorts",
    price: 24.99,
    formattedPrice: "$24.99",
    imageUrl: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80",
    category: "Shorts",
    collection: "divided",
    tags: ["shorts", "satin", "mini", "bottoms", "black"],
    buyUrl: "https://www2.hm.com/en_us/women/products/shorts.html",
  },
  {
    id: "div-1016",
    name: "Printed Graphic Tee",
    price: 14.99,
    formattedPrice: "$14.99",
    imageUrl: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80",
    category: "T-shirts",
    collection: "divided",
    tags: ["tee", "graphic", "print", "casual", "tops"],
    buyUrl: "https://www2.hm.com/en_us/women/products/t-shirts-tops.html",
  },
  {
    id: "div-1017",
    name: "Ruched Mini Dress — Pink",
    price: 32.99,
    formattedPrice: "$32.99",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    category: "Dresses",
    collection: "divided",
    tags: ["dress", "ruched", "mini", "pink", "party"],
    buyUrl: "https://www2.hm.com/en_us/women/products/dresses.html",
  },
  {
    id: "div-1018",
    name: "Knit Mini Skirt — Brown",
    price: 29.99,
    formattedPrice: "$29.99",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4b4f45?w=600&q=80",
    category: "Skirts",
    collection: "divided",
    tags: ["skirt", "mini", "knit", "bottoms", "brown"],
    buyUrl: "https://www2.hm.com/en_us/women/products/skirts.html",
  },
  {
    id: "div-1019",
    name: "Striped Crop Top — Navy",
    price: 17.99,
    formattedPrice: "$17.99",
    imageUrl: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&q=80",
    category: "Tops",
    collection: "divided",
    tags: ["crop-top", "striped", "navy", "tops", "casual"],
    buyUrl: "https://www2.hm.com/en_us/women/products/tops.html",
  },
  {
    id: "div-1020",
    name: "Floral Print Mini Dress",
    price: 29.99,
    formattedPrice: "$29.99",
    imageUrl: "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&q=80",
    category: "Dresses",
    collection: "divided",
    tags: ["dress", "floral", "mini", "summer", "feminine"],
    buyUrl: "https://www2.hm.com/en_us/women/products/dresses.html",
  },
];

// H&M Women's regular collection (age >= 20)
const WOMENS_ITEMS = [
  {
    id: "wmn-2001",
    name: "Silk-Look Shirt Dress",
    price: 54.99,
    formattedPrice: "$54.99",
    imageUrl: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&q=80",
    category: "Dresses",
    collection: "ladies",
    tags: ["dress", "shirt-dress", "silk", "midi", "elegant"],
    buyUrl: "https://www2.hm.com/en_us/women/products/dresses.html",
  },
  {
    id: "wmn-2002",
    name: "Tailored Wide-Leg Trousers",
    price: 49.99,
    formattedPrice: "$49.99",
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    category: "Trousers",
    collection: "ladies",
    tags: ["trousers", "wide-leg", "tailored", "bottoms", "smart"],
    buyUrl: "https://www2.hm.com/en_us/women/products/trousers.html",
  },
  {
    id: "wmn-2003",
    name: "Fitted Blazer — Black",
    price: 69.99,
    formattedPrice: "$69.99",
    imageUrl: "https://images.unsplash.com/photo-1594938403095-40e5f7bd9aff?w=600&q=80",
    category: "Jackets",
    collection: "ladies",
    tags: ["blazer", "fitted", "jacket", "outerwear", "smart", "black"],
    buyUrl: "https://www2.hm.com/en_us/women/products/jackets-coats.html",
  },
  {
    id: "wmn-2004",
    name: "Linen Shirt Dress",
    price: 44.99,
    formattedPrice: "$44.99",
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
    category: "Dresses",
    collection: "ladies",
    tags: ["dress", "linen", "shirt-dress", "casual", "summer"],
    buyUrl: "https://www2.hm.com/en_us/women/products/dresses.html",
  },
  {
    id: "wmn-2005",
    name: "Floral Wrap Midi Dress",
    price: 59.99,
    formattedPrice: "$59.99",
    imageUrl: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80",
    category: "Dresses",
    collection: "ladies",
    tags: ["dress", "floral", "wrap", "midi", "feminine"],
    buyUrl: "https://www2.hm.com/en_us/women/products/dresses.html",
  },
  {
    id: "wmn-2006",
    name: "Cropped Trench Coat",
    price: 89.99,
    formattedPrice: "$89.99",
    imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
    category: "Coats",
    collection: "ladies",
    tags: ["coat", "trench", "cropped", "outerwear", "classic"],
    buyUrl: "https://www2.hm.com/en_us/women/products/jackets-coats.html",
  },
  {
    id: "wmn-2007",
    name: "Fitted Turtleneck — Camel",
    price: 29.99,
    formattedPrice: "$29.99",
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    category: "Knitwear",
    collection: "ladies",
    tags: ["turtleneck", "knitwear", "fitted", "tops", "camel"],
    buyUrl: "https://www2.hm.com/en_us/women/products/knitwear.html",
  },
  {
    id: "wmn-2008",
    name: "High-Rise Flare Jeans",
    price: 49.99,
    formattedPrice: "$49.99",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
    category: "Jeans",
    collection: "ladies",
    tags: ["jeans", "flare", "high-rise", "denim", "bottoms"],
    buyUrl: "https://www2.hm.com/en_us/women/products/jeans.html",
  },
  {
    id: "wmn-2009",
    name: "Smocked Maxi Dress",
    price: 64.99,
    formattedPrice: "$64.99",
    imageUrl: "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&q=80",
    category: "Dresses",
    collection: "ladies",
    tags: ["dress", "maxi", "smocked", "summer", "feminine"],
    buyUrl: "https://www2.hm.com/en_us/women/products/dresses.html",
  },
  {
    id: "wmn-2010",
    name: "Velvet Mini Dress — Burgundy",
    price: 54.99,
    formattedPrice: "$54.99",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    category: "Dresses",
    collection: "ladies",
    tags: ["dress", "velvet", "mini", "burgundy", "evening", "party"],
    buyUrl: "https://www2.hm.com/en_us/women/products/dresses.html",
  },
  {
    id: "wmn-2011",
    name: "Satin Slip Skirt — Pink",
    price: 34.99,
    formattedPrice: "$34.99",
    imageUrl: "https://images.unsplash.com/photo-1596171446957-56a8c1e88327?w=600&q=80",
    category: "Skirts",
    collection: "ladies",
    tags: ["skirt", "satin", "slip", "midi", "bottoms", "pink"],
    buyUrl: "https://www2.hm.com/en_us/women/products/skirts.html",
  },
  {
    id: "wmn-2012",
    name: "Peplum Blouse — White",
    price: 27.99,
    formattedPrice: "$27.99",
    imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=600&q=80",
    category: "Blouses",
    collection: "ladies",
    tags: ["blouse", "peplum", "tops", "feminine", "white"],
    buyUrl: "https://www2.hm.com/en_us/women/products/blouses-tunics.html",
  },
  {
    id: "wmn-2013",
    name: "Knit Vest — Camel",
    price: 32.99,
    formattedPrice: "$32.99",
    imageUrl: "https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?w=600&q=80",
    category: "Knitwear",
    collection: "ladies",
    tags: ["vest", "knit", "camel", "tops", "layering"],
    buyUrl: "https://www2.hm.com/en_us/women/products/knitwear.html",
  },
  {
    id: "wmn-2014",
    name: "Fitted Leather-Look Trousers",
    price: 59.99,
    formattedPrice: "$59.99",
    imageUrl: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80",
    category: "Trousers",
    collection: "ladies",
    tags: ["trousers", "leather", "fitted", "bottoms", "black", "edgy"],
    buyUrl: "https://www2.hm.com/en_us/women/products/trousers.html",
  },
  {
    id: "wmn-2015",
    name: "Cropped Leather Biker Jacket",
    price: 79.99,
    formattedPrice: "$79.99",
    imageUrl: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80",
    category: "Jackets",
    collection: "ladies",
    tags: ["jacket", "leather", "biker", "cropped", "outerwear", "black", "edgy"],
    buyUrl: "https://www2.hm.com/en_us/women/products/jackets-coats.html",
  },
  {
    id: "wmn-2016",
    name: "Linen Wide-Leg Shorts",
    price: 27.99,
    formattedPrice: "$27.99",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4b4f45?w=600&q=80",
    category: "Shorts",
    collection: "ladies",
    tags: ["shorts", "linen", "wide-leg", "bottoms", "summer", "white"],
    buyUrl: "https://www2.hm.com/en_us/women/products/shorts.html",
  },
  {
    id: "wmn-2017",
    name: "Printed Wrap Blouse",
    price: 34.99,
    formattedPrice: "$34.99",
    imageUrl: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&q=80",
    category: "Blouses",
    collection: "ladies",
    tags: ["blouse", "printed", "wrap", "tops", "colourful"],
    buyUrl: "https://www2.hm.com/en_us/women/products/blouses-tunics.html",
  },
  {
    id: "wmn-2018",
    name: "Ribbed Midi Dress",
    price: 39.99,
    formattedPrice: "$39.99",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    category: "Dresses",
    collection: "ladies",
    tags: ["dress", "ribbed", "midi", "casual", "comfortable"],
    buyUrl: "https://www2.hm.com/en_us/women/products/dresses.html",
  },
  {
    id: "wmn-2019",
    name: "Oversized Knit Sweater — Sage",
    price: 44.99,
    formattedPrice: "$44.99",
    imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80",
    category: "Knitwear",
    collection: "ladies",
    tags: ["sweater", "knitwear", "oversized", "sage", "cosy", "tops"],
    buyUrl: "https://www2.hm.com/en_us/women/products/knitwear.html",
  },
  {
    id: "wmn-2020",
    name: "Floral Maxi Skirt",
    price: 49.99,
    formattedPrice: "$49.99",
    imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5218ees580?w=600&q=80",
    category: "Skirts",
    collection: "ladies",
    tags: ["skirt", "maxi", "floral", "bottoms", "feminine", "summer"],
    buyUrl: "https://www2.hm.com/en_us/women/products/skirts.html",
  },
];

router.get("/fashion/items", async (req, res) => {
  const apiKey = process.env["RAPIDAPI_KEY"];
  const { age } = req.query;
  const ageNum = age ? parseInt(String(age)) : null;

  // Attempt live H&M API first (always women's collection)
  if (apiKey) {
    try {
      const url = new URL(
        "https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list"
      );
      url.searchParams.set("country", "us");
      url.searchParams.set("lang", "en");
      url.searchParams.set("currentpage", "0");
      url.searchParams.set("pagesize", "40");
      // Age < 20 → Divided teen collection; else full women's
      const category = ageNum !== null && ageNum < 20 ? "ladies_divided_all" : "ladies_all";
      url.searchParams.set("categories", category);
      url.searchParams.set("sortBy", "ascPrice");

      const response = await fetch(url.toString(), {
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "apidojo-hm-hennes-mauritz-v1.p.rapidapi.com",
        },
      });

      if (response.ok && response.status !== 204) {
        const text = await response.text();
        if (text) {
          const data = JSON.parse(text) as {
            results?: Array<{
              code?: string;
              name?: string;
              price?: { value?: number; formattedValue?: string };
              images?: Array<{ url?: string }>;
              categoryName?: string;
            }>;
          };

          const items = (data.results ?? [])
            .filter((i) => i.code && i.name && i.images?.length)
            // Strict: exclude any masculine cuts
            .filter((i) => {
              const n = (i.name ?? "").toLowerCase();
              return !n.includes("men") && !n.includes("suit") && !n.includes("boxer");
            })
            .map((i) => ({
              id: i.code!,
              name: i.name!,
              price: i.price?.value ?? 0,
              formattedPrice: i.price?.formattedValue ?? `$${i.price?.value ?? 0}`,
              imageUrl: i.images![0].url!,
              category: i.categoryName ?? "Women's",
              collection: ageNum !== null && ageNum < 20 ? "divided" : "ladies",
              tags: [(i.categoryName ?? "fashion").toLowerCase()],
              buyUrl: `https://www2.hm.com/en_us/productpage.${i.code}.html`,
            }));

          if (items.length > 0) {
            res.json({ items: shuffle(items), source: "live" });
            return;
          }
        }
      }
    } catch (err) {
      req.log.warn({ err }, "Live H&M API unavailable, using curated items");
    }
  }

  // Fallback curated pool — age < 20 gets Divided only, else full women's
  const pool = ageNum !== null && ageNum < 20
    ? DIVIDED_ITEMS
    : [...DIVIDED_ITEMS, ...WOMENS_ITEMS];

  res.json({ items: shuffle(pool), source: "curated" });
});

export default router;
