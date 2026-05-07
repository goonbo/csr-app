import figma from "@figma/code-connect";
import { AIBlock } from "./AIBlock";

figma.connect(
  AIBlock,
  "https://www.figma.com/design/iFAZNHve9yjvuls9pMcBlC/view-2.0-design-system?node-id=6-707",
  {
    props: {
      label: figma.string("Eyebrow"),
    },
    example: ({ label }) => (
      <AIBlock label={label} onRegenerate={() => {}}>
        {/* AI-generated content goes here */}
      </AIBlock>
    ),
  },
);
