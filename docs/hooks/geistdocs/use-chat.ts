import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Export the prompt atom so it can be used from other parts of the app
export const chatPromptAtom = atom<string>("");

// Export the open state atom for controlling chat visibility
export const chatOpenAtom = atomWithStorage<boolean>(
  "geistdocs:chat-open",
  false
);

// Export the page context atom for passing page-specific context
export const chatPageContextAtom = atom<{
  title: string;
  url: string;
  content: string;
} | null>(null);

export const useChatContext = () => {
  const [prompt, setPrompt] = useAtom(chatPromptAtom);
  const [isOpen, setIsOpen] = useAtom(chatOpenAtom);
  const [pageContext, setPageContext] = useAtom(chatPageContextAtom);

  return {
    prompt,
    setPrompt,
    isOpen,
    setIsOpen,
    pageContext,
    setPageContext,
  };
};
