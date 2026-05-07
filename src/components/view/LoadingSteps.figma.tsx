import figma from "@figma/code-connect";
import { LoadingSteps } from "./LoadingSteps";

figma.connect(
  LoadingSteps,
  "https://www.figma.com/design/iFAZNHve9yjvuls9pMcBlC/view-2.0-design-system?node-id=5-577",
  {
    props: {
      // The Figma file shows a single step with three states (Pending /
      // Active / Done) for visual reference. The React component accepts a
      // `steps: string[]` array and an `idx` index — every step before idx
      // is Done, the step at idx is Active, every step after is Pending.
    },
    example: () => (
      <LoadingSteps
        steps={[
          "Pulling attendance and outputs…",
          "Reading post-event survey signals…",
          "Synthesizing impact for both sides…",
          "Composing the recap…",
        ]}
        idx={1}
      />
    ),
  },
);
