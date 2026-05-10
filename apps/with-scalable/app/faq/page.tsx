"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/ui/accordion";

const faqs = [
  {
    question: "How does SOLID help you keep your React components scalable?",
    answer:
      "Well, I make sure each component has one responsibility—like a ProductCard just renders the card and a useProducts hook handles the data—so when something changes I only touch one place. I keep components open for extension but closed for modification, so I add behavior with composition, wrappers, or render props instead of editing the component itself. I design so that any component that matches the same contract can be swapped in without breaking the parent. I only pass the props a component actually needs so I don’t end up with giant prop objects, and I depend on props and context instead of concrete APIs so I can plug in different data or themes without rewriting the component. For me that’s how SOLID keeps things scalable.",
  },
  {
    question: "How do you structure folders so the app stays scalable?",
    answer:
      "I like to keep app or pages for routes only and put the real logic in a features folder—one folder per feature, and inside each I have components, hooks, utils, types, and maybe api or lib. That way when I add a new feature I add a new folder and I'm not constantly moving files or wondering where something lives. I keep shared UI in a components folder, and things like API clients, db, and config in a lib folder so they're easy to find. Co-locating tests next to the file they test keeps the structure flat and makes it obvious what's covered. For me the main thing is that the structure answers 'where does this go?' so the codebase scales without turning into a mess.",
  },
  {
    question: "What are the benefits of a design system?",
    answer:
      "For me the biggest benefit is consistency—buttons, forms, and layouts all come from one place so every app or feature feels like the same product. It also speeds things up because I'm composing instead of rebuilding; when I need a modal or a form field I grab it from the design system instead of writing it again. It gives design and engineering a shared language so we're not constantly re-explaining what we mean. And when we need to support another brand or theme we can do it with tokens and theming instead of duplicating a bunch of UI. So for me it's consistency, speed, and the ability to scale to more products without the UI exploding.",
  },
  {
    question: "What are the benefits of a monorepo?",
    answer:
      "I like that shared code lives in one repo so when I refactor a shared component or type I can do it in one PR and see the impact everywhere. No more publishing a package, waiting, then updating consumers in another repo—I change the app and its dependency in one commit. We also get one place for lint, test, and build config so it's easier to keep standards consistent as the team grows. And the dependency graph is explicit so I can see what breaks when I change something. For me the main benefits are atomic changes, shared tooling, and not having to chase version skew across a bunch of repos.",
  },
  {
    question: "What is the compound component pattern and when do you use it?",
    answer:
      "It's when you have a parent component and a set of child components that work together and share state through context—like Card with CardHeader and CardContent, or Tabs with TabsList, TabsTrigger, and TabsContent. I use it when I want a flexible API where the caller can arrange or omit pieces in markup instead of passing a bunch of props into one component. So instead of a Card with a header prop and a body prop and a footer prop, I use Card, CardHeader, CardContent and the structure is right there in the JSX. It keeps the parent from becoming a prop nightmare and makes it easy to add new slots or variants without changing the main component's interface. For me it's the go-to when I'm building something that has a few logical parts and I want it to stay composable as we scale.",
  },
  {
    question: "What is Storybook and why use it?",
    answer:
      "Storybook is a tool for developing and documenting UI components in isolation—you render a component in different states and variants without running the full app. I use it so we have a single place to see every component, every prop combination, and the usage docs, which makes the design system discoverable and easier to scale. It also lets me develop and debug a component without navigating through the app, and we can add visual regression or interaction tests per story. For me it's the go-to when we're building or maintaining a component library so design and engineering can browse, review, and test components without digging through code or spinning up multiple apps.",
  },
];

const FaqPage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-bold text-4xl">FAQ</h1>
        <p className="mt-2 text-muted-foreground">
          Frequently asked questions about scaling React apps and architecture
        </p>
      </div>

      <Accordion className="w-full" type="multiple">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </main>
);

export default FaqPage;
