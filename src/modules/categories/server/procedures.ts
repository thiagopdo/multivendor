import type { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
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

    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        //because of 'depth: 1', é possível ter certeza que doc é do tipo Category
        ...(doc as Category),
        subcategories: undefined,
      })),
    }));
    return formattedData;
  }),
});
