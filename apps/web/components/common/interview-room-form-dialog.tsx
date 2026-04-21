"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Check, Copy, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "../ui/input";
import { TimePicker } from "./time-picker";
import { SelectGroup, SelectItem, SelectLabel } from "../ui/select";
import {
  RoomFormValues,
  RoomFormPayload,
  roomFormSchema,
} from "@/lib/schemas/room.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "./form-field";
import { FormSelect } from "./form-select";
import { FormCombobox } from "./form-combobox";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { ConfirmDialog } from "./confirm-dialog";
import { useQuestions } from "@/lib/hooks/use-questions";
import type { QuestionSummary } from "@code-interview/types";

export function InterviewRoomFormDialog({
  mode = "create",
  trigger,
  room,
  isSubmitting,
  onSubmit,
  onCloseRoom,
}: {
  room?: RoomFormValues & {
    roomCode: string;
  };
  mode?: "create" | "edit";
  trigger?: React.ReactNode;
  isSubmitting?: boolean;
  onSubmit?: (values: RoomFormValues) => Promise<void>;
  onCloseRoom?: () => void;
}) {
  const { data: questionsResponse, isLoading: isLoadingQuestions } =
    useQuestions();
  const questions = questionsResponse || ([] as QuestionSummary[]);

  const questionOptions = React.useMemo(() => {
    return questions.map((q) => ({
      label: q.title,
      value: q.id,
    }));
  }, [questions]);

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      title: room?.title || "",
      language: room?.language || "javascript",
      roomDuration: room?.roomDuration || 3600000,
      question: room?.question || undefined,
    },
  });
  const [open, setOpen] = useState(false);

  // Reset form version on dialog open or room prop change
  useEffect(() => {
    if (open) {
      form.reset({
        title: room?.title || "",
        language: room?.language || "javascript",
        roomDuration: room?.roomDuration || 3600000,
        question: room?.question || undefined,
      });
    }
  }, [open, room, form]);

  const clipboard = useCopyToClipboard();

  async function handleSubmit(values: RoomFormValues) {
    const payload: RoomFormPayload = {
      title: values.title,
      language: values.language,
      roomDuration: values.roomDuration,
      questionId: values.question,
    };

    await onSubmit?.(payload);
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="outline">
            {mode === "create" ? "Create Room" : "Edit Room"}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-background max-w-[450px]! w-screen!">
        <AlertDialogHeader className="flex items-center justify-between gap-2">
          <AlertDialogTitle className="text-start font-bold text-xl">
            {mode === "create" ? "Create Room" : "Edit Room"}
          </AlertDialogTitle>
          <Button variant={"ghost"} onClick={() => setOpen(false)}>
            <X />
          </Button>
        </AlertDialogHeader>

        {mode === "edit" && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-4">
              <span
                className={cn(
                  jetbrainsMono.className,
                  "text-sm tracking-tight",
                )}
              >
                Room Code
              </span>
              <div className="flex items-center gap-0.5">
                <span
                  className={cn(
                    jetbrainsMono.className,
                    "text-lg tracking-tight text-primary font-bold ",
                  )}
                >
                  {room?.roomCode}
                </span>
                <Button
                  variant={"ghost"}
                  size={"icon-xs"}
                  onClick={() =>
                    clipboard.copyToClipboard(room?.roomCode || "", "code")
                  }
                >
                  {clipboard.copiedId === "code" ? (
                    <Check className="size-3 text-green-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span
                className={cn(
                  jetbrainsMono.className,
                  "text-sm tracking-tight",
                )}
              >
                Room Link
              </span>
              <div className="flex items-center gap-0.5">
                <span
                  className={cn(
                    jetbrainsMono.className,
                    "inline-block text-xs tracking-tight max-w-[200px] truncate",
                  )}
                >
                  {`${process.env.NEXT_PUBLIC_WEB_URL}/room/${room?.roomCode}/join`}
                </span>
                <Button
                  variant={"ghost"}
                  size={"icon-xs"}
                  onClick={() => {
                    const url = `${process.env.NEXT_PUBLIC_WEB_URL}/room/${room?.roomCode}/join`;
                    clipboard.copyToClipboard(url, "link");
                  }}
                >
                  {clipboard.copiedId === "link" ? (
                    <Check className="size-3 text-green-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        <Separator />

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <FormField
              id="room-title"
              name="title"
              control={form.control}
              label="Room Title"
            >
              {(field, id) => (
                <Input
                  {...field}
                  id={id}
                  placeholder="e.g Senior Frontend Engineer interview"
                  autoComplete="off"
                />
              )}
            </FormField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Select — language */}
              <FormSelect
                id="select-language"
                name="language"
                control={form.control}
                label="Language"
                placeholder="Select Language"
              >
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                </SelectGroup>
              </FormSelect>
              <FormCombobox
                id="select-question"
                name="question"
                control={form.control}
                label="Question"
                placeholder={
                  isLoadingQuestions ? "Loading..." : "Select Question"
                }
                searchPlaceholder="Search questions..."
                emptyMessage="No questions found."
                options={questionOptions}
                disabled={isLoadingQuestions}
              />
            </div>
            {/* TimePicker */}
            <FormField
              id="room-duration"
              name="roomDuration"
              control={form.control}
              label="Duration"
            >
              {(field, id) => (
                <TimePicker
                  id={id}
                  mode="duration"
                  outputFormat="ms"
                  {...field}
                />
              )}
            </FormField>
          </FieldGroup>
        </form>
        <AlertDialogFooter
          className={cn(
            "flex gap-4",
            mode === "edit" ? "justify-between!" : "",
          )}
        >
          {mode === "edit" && (
            <ConfirmDialog
              trigger={
                <Button
                  variant="destructive"
                  className="rounded-sm px-4 py-2 h-auto border-red-500"
                >
                  Close Room
                </Button>
              }
              title="Close this room?"
              description="Candidates will no longer be able to join this room."
              confirmLabel="Close Room"
              variant="destructive"
              onConfirm={async () => {
                await onCloseRoom?.();
                setOpen(false);
              }}
            />
          )}
          <div className="flex items-center justify-end gap-2">
            <Button
              variant={"outline"}
              className="rounded-sm px-4 py-2 h-auto"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit(handleSubmit)}
              className="rounded-sm px-8 py-2 h-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : mode === "create" ? (
                "Create"
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
