import figma from "@figma/code-connect";
import { Pill } from "./Pill";

figma.connect(
  Pill,
  "https://www.figma.com/design/iFAZNHve9yjvuls9pMcBlC/view-2.0-design-system?node-id=5-458",
  {
    props: {
      tone: figma.enum("Tone", {
        Neutral: "neutral",
        Sage: "sage",
        Terracotta: "terracotta",
        Amber: "amber",
        Rose: "rose",
        // Note: the Figma file also has an Emerald tone for visual reference,
        // but the React component only declares neutral/sage/terracotta/amber/
        // rose. Designers selecting Emerald should map to Sage in code (sage
        // and terracotta both alias to --primary; emerald visuals come from
        // direct Tailwind classes).
      }),
      children: figma.string("Label"),
    },
    example: ({ tone, children }) => <Pill tone={tone}>{children}</Pill>,
  },
);
