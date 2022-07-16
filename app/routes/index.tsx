import { Link } from "@remix-run/react";
import { styled } from "~/styles/stitches.config";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return <Main>Hello world!</Main>;
}

const Main = styled("main", {
  padding: 32,
  backgroundColor: "$red",
  color: "#fff",
});
