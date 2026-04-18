"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  trigger?: React.ReactNode; // The element that triggers the dialog (e.g., a Button)
  open?: boolean; // Controlled open state
  onOpenChange?: (open: boolean) => void; // Controlled state handler
  title: string; // The dialog title
  description?: string; // Optional additional information or context
  confirmLabel?: string; // Label for the confirmation button (defaults to "Confirm")
  cancelLabel?: string; // Label for the cancellation button (defaults to "Cancel")
  variant?: "destructive" | "default"; // Visual variant for the confirmation button
  onConfirm: () => void; // Callback function executed when confirmation is clicked
  isLoading?: boolean; // Whether the dialog is in a loading state (disables buttons)
}

export function ConfirmDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-medium">
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            className="h-auto px-4 py-2 font-medium text-sm rounded-sm"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              variant === "destructive" &&
                "bg-destructive! text-white hover:bg-destructive/80!",
              "h-auto px-4 py-2 font-medium text-sm rounded-sm",
            )}
          >
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
