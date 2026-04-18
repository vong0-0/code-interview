"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "../ui/input";
import { SelectGroup, SelectItem, SelectLabel } from "../ui/select";
import { FormField } from "./form-field";
import { FormSelect } from "./form-select";
import { FormTextarea } from "./form-textarea";
import { FormSegmentedGroup, SegmentedOption } from "./form-segmented-group";
import { FormCodeEditor } from "./form-code-editor";
import {
  questionFormSchema,
  QuestionFormValues,
} from "@/lib/schemas/question.schema";
import { Difficulty } from "@code-interview/types";
import { PROGRAMMING_LANGUAGES } from "@/app/constants/questions";

interface QuestionFormProps {
  initialData?: QuestionFormValues;
  onSubmit: (values: QuestionFormValues) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
  submitLabel?: string;
  formId?: string;
  onDirtyChange?: (isDirty: boolean) => void;
}

const difficultyOptions: SegmentedOption<Difficulty>[] = [
  {
    value: "EASY",
    label: "Easy",
    activeClassName: "border-blue-500 text-blue-500 bg-blue-500/10",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    activeClassName: "border-orange-500 text-orange-500 bg-orange-500/10",
  },
  {
    value: "HARD",
    label: "Hard",
    activeClassName: "border-red-500 text-red-500 bg-red-500/10",
  },
];

export function QuestionForm({
  initialData,
  onSubmit,
  className,
  formId,
  onDirtyChange,
}: QuestionFormProps) {
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      difficulty: "EASY",
      language: "",
      starterCode: "",
    },
  });

  const language = useWatch({ control: form.control, name: "language" });

  const { isDirty } = form.formState;

  React.useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty);
    }
  }, [isDirty, onDirtyChange]);

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("space-y-8 p-6", className)}
    >
      <FieldGroup className="flex flex-col gap-6 @[900px]/main:flex-row">
        <div className="space-y-8 w-full @[900px]/main:max-w-sm @[900px]/main:shrink-0">
          {/* Title */}
          <FormField
            id="question-title"
            name="title"
            control={form.control}
            label="Title"
          >
            {(field, id) => (
              <Input
                {...field}
                id={id}
                placeholder="e.g. Invert Binary Tree"
                autoComplete="off"
              />
            )}
          </FormField>

          {/* Description */}
          <FormTextarea
            id="question-description"
            name="description"
            control={form.control}
            label="Description"
            placeholder="Describe the problem constraints and examples..."
            className="min-h-32 text-base"
          />

          {/* Difficulty */}
          <FormSegmentedGroup
            id="question-difficulty"
            name="difficulty"
            control={form.control}
            label="Difficulty"
            options={difficultyOptions}
          />

          {/* Language */}
          <FormSelect
            id="question-language"
            name="language"
            control={form.control}
            label="Programming Language"
            placeholder="Select Language"
            orientation="vertical"
          >
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              {PROGRAMMING_LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </FormSelect>
        </div>

        {/* Starter Code */}
        <FormCodeEditor
          id="question-starter-code"
          className="flex-1"
          name="starterCode"
          control={form.control}
          label="Starter Code"
          language={language}
          disabled={!language}
          minHeight="350px"
        />
      </FieldGroup>
    </form>
  );
}
