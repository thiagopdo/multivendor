import configPromise from "@payload-config";
import { getPayload } from "payload";
import type React from "react";

import type { Category } from "@/payload-types";

import Footer from "./footer";
import { Navbar } from "./navbar";
import { SearchFilters } from "./search-filters";
import type { CustomCategory } from "./types";

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1, //para garantir que os subcategorias também sejam buscados
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
    sort: "name",
  });

  const formattedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      //because of 'depth: 1', é possível ter certeza que doc é do tipo Category
      ...(doc as Category),
      subcategories: undefined,
    })),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
}
