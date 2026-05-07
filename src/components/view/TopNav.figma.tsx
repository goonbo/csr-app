import figma from "@figma/code-connect";
import { TopNav } from "./TopNav";

figma.connect(
  TopNav,
  "https://www.figma.com/design/iFAZNHve9yjvuls9pMcBlC/view-2.0-design-system?node-id=5-658",
  {
    props: {
      // The React TopNav derives its workspace from the current pathname
      // — there's no `workspace` prop. The Figma `Workspace` variant is for
      // visual reference (Admin / Employee / Nonprofit chrome).
    },
    example: () => <TopNav />,
  },
);
