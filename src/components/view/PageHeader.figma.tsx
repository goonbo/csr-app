import figma from "@figma/code-connect";
import { PageHeader } from "./PageHeader";

figma.connect(
  PageHeader,
  "https://www.figma.com/design/iFAZNHve9yjvuls9pMcBlC/view-2.0-design-system?node-id=5-587",
  {
    props: {
      title: figma.string("Title"),
      subtitle: figma.string("Subtitle"),
      greeting: figma.string("Greeting"),
    },
    example: ({ title, subtitle, greeting }) => (
      <PageHeader
        greeting={greeting}
        title={title}
        subtitle={subtitle}
        action={<button>Plan an event</button>}
      />
    ),
  },
);
