interface Props {
  params: Promise<{ category: string; subcategory: string }>;
}

export default async function page({ params }: Props) {
  const { category, subcategory } = await params;

  return (
    <div>
      Category: {category} <br />
      SubCategory: {subcategory}
    </div>
  );
}
