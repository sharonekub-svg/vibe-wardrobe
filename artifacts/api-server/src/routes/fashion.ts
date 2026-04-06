import { Router } from "express";

const router = Router();

// Curated real H&M men's items with live product page URLs
const FALLBACK_ITEMS = [
  {
    id: "1116615001",
    name: "Slim Fit Oxford Shirt",
    price: 34.99,
    formattedPrice: "$34.99",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    category: "Shirts",
    buyUrl: "https://www2.hm.com/en_us/productpage.1116615001.html",
  },
  {
    id: "1030763001",
    name: "Slim Fit Chinos",
    price: 39.99,
    formattedPrice: "$39.99",
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    category: "Trousers",
    buyUrl: "https://www2.hm.com/en_us/productpage.1030763001.html",
  },
  {
    id: "0927955001",
    name: "Regular Fit Linen Shirt",
    price: 49.99,
    formattedPrice: "$49.99",
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
    category: "Shirts",
    buyUrl: "https://www2.hm.com/en_us/productpage.0927955001.html",
  },
  {
    id: "0909350001",
    name: "Skinny Fit Jeans",
    price: 44.99,
    formattedPrice: "$44.99",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    category: "Jeans",
    buyUrl: "https://www2.hm.com/en_us/productpage.0909350001.html",
  },
  {
    id: "0852839001",
    name: "Regular Fit Blazer",
    price: 79.99,
    formattedPrice: "$79.99",
    imageUrl: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80",
    category: "Jackets",
    buyUrl: "https://www2.hm.com/en_us/productpage.0852839001.html",
  },
  {
    id: "1103506001",
    name: "Knit Turtleneck Sweater",
    price: 54.99,
    formattedPrice: "$54.99",
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    category: "Knitwear",
    buyUrl: "https://www2.hm.com/en_us/productpage.1103506001.html",
  },
  {
    id: "1085310001",
    name: "Merino Blend Crewneck",
    price: 59.99,
    formattedPrice: "$59.99",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    category: "Knitwear",
    buyUrl: "https://www2.hm.com/en_us/productpage.1085310001.html",
  },
  {
    id: "0875367002",
    name: "Regular Fit Denim Jacket",
    price: 59.99,
    formattedPrice: "$59.99",
    imageUrl: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80",
    category: "Jackets",
    buyUrl: "https://www2.hm.com/en_us/productpage.0875367002.html",
  },
  {
    id: "1028773001",
    name: "Slim Fit Suit Trousers",
    price: 59.99,
    formattedPrice: "$59.99",
    imageUrl: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80",
    category: "Trousers",
    buyUrl: "https://www2.hm.com/en_us/productpage.1028773001.html",
  },
  {
    id: "0901668001",
    name: "Slim Fit Polo Shirt",
    price: 24.99,
    formattedPrice: "$24.99",
    imageUrl: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    category: "Polo Shirts",
    buyUrl: "https://www2.hm.com/en_us/productpage.0901668001.html",
  },
  {
    id: "1095560001",
    name: "Regular Fit Puffer Jacket",
    price: 89.99,
    formattedPrice: "$89.99",
    imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&q=80",
    category: "Jackets",
    buyUrl: "https://www2.hm.com/en_us/productpage.1095560001.html",
  },
  {
    id: "1078467001",
    name: "Slim Fit Henley Shirt",
    price: 29.99,
    formattedPrice: "$29.99",
    imageUrl: "https://images.unsplash.com/photo-1589465885857-44edb59bbff2?w=600&q=80",
    category: "Shirts",
    buyUrl: "https://www2.hm.com/en_us/productpage.1078467001.html",
  },
  {
    id: "1017769001",
    name: "Regular Fit Overcoat",
    price: 149.99,
    formattedPrice: "$149.99",
    imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
    category: "Coats",
    buyUrl: "https://www2.hm.com/en_us/productpage.1017769001.html",
  },
  {
    id: "0947140001",
    name: "Regular Fit Canvas Trousers",
    price: 34.99,
    formattedPrice: "$34.99",
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    category: "Trousers",
    buyUrl: "https://www2.hm.com/en_us/productpage.0947140001.html",
  },
  {
    id: "1048993001",
    name: "Slim Fit Bomber Jacket",
    price: 69.99,
    formattedPrice: "$69.99",
    imageUrl: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80",
    category: "Jackets",
    buyUrl: "https://www2.hm.com/en_us/productpage.1048993001.html",
  },
  {
    id: "0934834001",
    name: "Regular Fit Lounge Shirt",
    price: 27.99,
    formattedPrice: "$27.99",
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
    category: "Shirts",
    buyUrl: "https://www2.hm.com/en_us/productpage.0934834001.html",
  },
  {
    id: "1061748001",
    name: "Slim Fit Wool-Blend Trousers",
    price: 64.99,
    formattedPrice: "$64.99",
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    category: "Trousers",
    buyUrl: "https://www2.hm.com/en_us/productpage.1061748001.html",
  },
  {
    id: "0855787001",
    name: "Regular Fit Printed Shirt",
    price: 29.99,
    formattedPrice: "$29.99",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    category: "Shirts",
    buyUrl: "https://www2.hm.com/en_us/productpage.0855787001.html",
  },
  {
    id: "1021048001",
    name: "Slim Fit Suit Jacket",
    price: 99.99,
    formattedPrice: "$99.99",
    imageUrl: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80",
    category: "Jackets",
    buyUrl: "https://www2.hm.com/en_us/productpage.1021048001.html",
  },
  {
    id: "0921328001",
    name: "Regular Fit Sweatshirt",
    price: 34.99,
    formattedPrice: "$34.99",
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80",
    category: "Sweatshirts",
    buyUrl: "https://www2.hm.com/en_us/productpage.0921328001.html",
  },
];

router.get("/fashion/items", async (req, res) => {
  const apiKey = process.env["RAPIDAPI_KEY"];
  const { budget } = req.query;

  // Attempt live H&M API first
  if (apiKey) {
    try {
      const url = new URL(
        "https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list"
      );
      url.searchParams.set("country", "us");
      url.searchParams.set("lang", "en");
      url.searchParams.set("currentpage", "0");
      url.searchParams.set("pagesize", "30");
      url.searchParams.set("categories", "men_all");
      url.searchParams.set("sortBy", "ascPrice");

      const response = await fetch(url.toString(), {
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "apidojo-hm-hennes-mauritz-v1.p.rapidapi.com",
        },
      });

      // 204 = endpoint returned no content (API inactive)
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
            .map((i) => ({
              id: i.code!,
              name: i.name!,
              price: i.price?.value ?? 0,
              formattedPrice:
                i.price?.formattedValue ?? `$${i.price?.value ?? 0}`,
              imageUrl: i.images![0].url!,
              category: i.categoryName ?? "Men's",
              buyUrl: `https://www2.hm.com/en_us/productpage.${i.code}.html`,
            }))
            .filter((i) =>
              budget ? i.price <= parseFloat(String(budget)) : true
            );

          if (items.length > 0) {
            res.json({ items, source: "live" });
            return;
          }
        }
      }
    } catch (err) {
      req.log.warn({ err }, "Live H&M API unavailable, using curated items");
    }
  }

  // Fallback: curated H&M items with real product URLs
  const filtered = FALLBACK_ITEMS.filter((i) =>
    budget ? i.price <= parseFloat(String(budget)) : true
  );

  res.json({ items: filtered, source: "curated" });
});

export default router;
