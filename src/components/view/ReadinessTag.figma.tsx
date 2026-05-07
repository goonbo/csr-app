import figma from "@figma/code-connect";
import { ReadinessTag } from "./ReadinessTag";

figma.connect(
  ReadinessTag,
  "https://www.figma.com/design/iFAZNHve9yjvuls9pMcBlC/view-2.0-design-system?node-id=5-474",
  {
    props: {
      tag: figma.enum("State", {
        Strong: "strong",
        Solid: "solid",
        "Worth a closer look": "closer-look",
        "Limited evidence": "limited",
        "Not assessed": "not-assessed",
      }),
    },
    example: ({ tag }) => <ReadinessTag tag={tag} />,
  },
);
