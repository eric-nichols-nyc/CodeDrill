"use client";

import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@repo/design-system/components/ai-elements/model-selector";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@repo/design-system/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@repo/design-system/components/ai-elements/suggestion";
import type { AdminChatStatus } from "@/features/admin-chat-layout/lib/admin-chat-types";
import { CheckIcon, GlobeIcon } from "lucide-react";
import { useCallback } from "react";
import {
  adminChatChefs,
  adminChatModels,
  adminChatSuggestions,
} from "@/features/admin-chat-layout/lib/admin-chat-static-data";
import type { AdminChatModel } from "@/features/admin-chat-layout/lib/admin-chat-types";

export type AdminChatInputProps = {
  model: string;
  modelSelectorOpen: boolean;
  onModelSelect: (modelId: string) => void;
  onModelSelectorOpenChange: (open: boolean) => void;
  onSubmit: (message: PromptInputMessage) => void;
  onSuggestionClick: (suggestion: string) => void;
  onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTranscriptionChange: (transcript: string) => void;
  onToggleWebSearch: () => void;
  selectedModelData: AdminChatModel | undefined;
  status: AdminChatStatus;
  submitDisabled: boolean;
  text: string;
  useWebSearch: boolean;
};

function ModelItem({
  model,
  isSelected,
  onSelect,
}: {
  model: AdminChatModel;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const handleSelect = useCallback(() => {
    onSelect(model.id);
  }, [model.id, onSelect]);

  return (
    <ModelSelectorItem onSelect={handleSelect} value={model.id}>
      <ModelSelectorLogo provider={model.chefSlug} />
      <ModelSelectorName>{model.name}</ModelSelectorName>
      <ModelSelectorLogoGroup>
        {model.providers.map((provider) => (
          <ModelSelectorLogo key={provider} provider={provider} />
        ))}
      </ModelSelectorLogoGroup>
      {isSelected ? (
        <CheckIcon className="ml-auto size-4" />
      ) : (
        <div className="ml-auto size-4" />
      )}
    </ModelSelectorItem>
  );
}

function SuggestionItem({
  suggestion,
  onClick,
}: {
  suggestion: string;
  onClick: (suggestion: string) => void;
}) {
  const handleClick = useCallback(() => {
    onClick(suggestion);
  }, [onClick, suggestion]);

  return <Suggestion onClick={handleClick} suggestion={suggestion} />;
}

export function AdminChatInput({
  model,
  modelSelectorOpen,
  onModelSelect,
  onModelSelectorOpenChange,
  onSubmit,
  onSuggestionClick,
  onTextChange,
  onTranscriptionChange,
  onToggleWebSearch,
  selectedModelData,
  status,
  submitDisabled,
  text,
  useWebSearch,
}: AdminChatInputProps) {
  return (
    <div className="grid shrink-0 gap-4 pt-4">
      <Suggestions className="px-4">
        {adminChatSuggestions.map((suggestion) => (
          <SuggestionItem
            key={suggestion}
            onClick={onSuggestionClick}
            suggestion={suggestion}
          />
        ))}
      </Suggestions>
      <div className="w-full px-4 pb-4">
        <PromptInput globalDrop multiple onSubmit={onSubmit}>
          <PromptInputHeader>
            <PromptInputAttachments>
              {(attachment) => (
                <PromptInputAttachment data={attachment} key={attachment.id} />
              )}
            </PromptInputAttachments>
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea onChange={onTextChange} value={text} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputSpeechButton
                className="shrink-0"
                onTranscriptionChange={onTranscriptionChange}
                size="icon-sm"
                variant="ghost"
              />
              <PromptInputButton
                onClick={onToggleWebSearch}
                type="button"
                variant={useWebSearch ? "default" : "ghost"}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <ModelSelector
                onOpenChange={onModelSelectorOpenChange}
                open={modelSelectorOpen}
              >
                <ModelSelectorTrigger asChild>
                  <PromptInputButton type="button">
                    {selectedModelData?.chefSlug ? (
                      <ModelSelectorLogo provider={selectedModelData.chefSlug} />
                    ) : null}
                    {selectedModelData?.name ? (
                      <ModelSelectorName>{selectedModelData.name}</ModelSelectorName>
                    ) : null}
                  </PromptInputButton>
                </ModelSelectorTrigger>
                <ModelSelectorContent>
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                    {adminChatChefs.map((chef) => (
                      <ModelSelectorGroup heading={chef} key={chef}>
                        {adminChatModels
                          .filter((item) => item.chef === chef)
                          .map((item) => (
                            <ModelItem
                              isSelected={model === item.id}
                              key={item.id}
                              model={item}
                              onSelect={onModelSelect}
                            />
                          ))}
                      </ModelSelectorGroup>
                    ))}
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>
            <PromptInputSubmit disabled={submitDisabled} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
