import fetchAPI from "@lnl/lib";

export default async function data({ params: { path } }) {
  const id = path.split("/")[path.split("/").length - 1];
  const data = await fetchAPI(`item/${id}`);

  return { story: data };
}
