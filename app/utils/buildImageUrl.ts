const buildImageUrl = (relativePath: string) => {
  return relativePath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${relativePath}`
    : "";
};
export default buildImageUrl;
