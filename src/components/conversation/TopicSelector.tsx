
import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Topic options for conversation
export const CONVERSATION_TOPICS = [
  { value: "daily_life", label: "Daily Life" },
  { value: "travel", label: "Travel" },
  { value: "work", label: "Work & Career" },
  { value: "hobbies", label: "Hobbies & Interests" },
  { value: "food", label: "Food & Dining" },
  { value: "technology", label: "Technology" }
];

interface TopicSelectorProps {
  activeTopic: string;
  onTopicChange: (value: string) => void;
  disabled: boolean;
}

const TopicSelector = ({
  activeTopic,
  onTopicChange,
  disabled
}: TopicSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="topic" className="whitespace-nowrap">Topic:</Label>
      <Select value={activeTopic} onValueChange={onTopicChange} disabled={disabled}>
        <SelectTrigger id="topic" className="w-40">
          <SelectValue placeholder="Select topic" />
        </SelectTrigger>
        <SelectContent>
          {CONVERSATION_TOPICS.map((topic) => (
            <SelectItem key={topic.value} value={topic.value}>{topic.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TopicSelector;
