import figma from "@figma/code-connect";
import { ViewSourcePill } from "./ViewSourcePill";

figma.connect(
  ViewSourcePill,
  "https://www.figma.com/design/iFAZNHve9yjvuls9pMcBlC/view-2.0-design-system?node-id=5-483",
  {
    props: {
      size: figma.enum("Size", {
        Default: "default",
        Sm: "sm",
      }),
      partner: figma.string("Partner"),
    },
    example: ({ size, partner }) => (
      <ViewSourcePill size={size} partner={partner} />
    ),
  },
);
