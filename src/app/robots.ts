import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/result/"],
      },
    ],
    sitemap: "https://sellornotsell.com/sitemap.xml",
  };
}
