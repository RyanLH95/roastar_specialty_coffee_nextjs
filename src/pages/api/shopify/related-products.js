import { fetchShopifyData } from "./route";

export default async function fetchRelatedProducts(req, res) {
  try {
    const query = `
      {
        products(first: 5) {
          edges {
            node {
              id
              title
              handle
              images(first: 1) {
                edges {
                  node {
                    src
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    priceV2 {
                      amount
                    }
                  }
                }
              } 
            }
          }
        }
      }
    `;
  
    const data = await fetchShopifyData(query);
    if (!data || !data.products || !data?.products?.edges) {
      throw new Error("Invalid response from Shopify");
    }
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ products: data?.products?.edges });
  } catch(error) {
    console.error("Error in API route:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}