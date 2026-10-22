// One row of the properties table in Supabase.
// The names match the table's columns, so image_url keeps its underscore.
export type Property = {
  id: number;
  title: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

// One row of the favourites table, with its home joined in.
export type Favourite = {
  property_id: number;
  properties: Property;
};
