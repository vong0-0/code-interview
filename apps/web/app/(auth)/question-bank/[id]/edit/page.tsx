"use client";

import * as React from "react";
import { useQuestion, useUpdateQuestion } from "@/lib/hooks/use-questions";
import { QuestionForm } from "@/components/common/question-form";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { QuestionFormValues } from "@/lib/schemas/question.schema";
import { QuestionFormSkeleton } from "@/components/skeletons/question-form-skeleton";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, FileQuestion } from "lucide-react";

export default function EditQuestionPage(props: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(props.params);
  const { data: question, isLoading } = useQuestion(id);
  const updateMutation = useUpdateQuestion();

  const [showConfirm, setShowConfirm] = React.useState(false);
  const [pendingValues, setPendingValues] =
    React.useState<QuestionFormValues | null>(null);
  const [isDirty, setIsDirty] = React.useState(false);

  const handleSubmit = async (values: QuestionFormValues) => {
    setPendingValues(values);
    setShowConfirm(true);
  };

  const handleConfirmUpdate = () => {
    if (!pendingValues) return;

    updateMutation.mutate(
      { id, payload: pendingValues },
      {
        onSuccess: () => {
          setShowConfirm(false);
          router.push("/question-bank");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader isSubmitting={false} isDirty={false} />
        <Card className="mx-auto border-none rounded-sm p-0 shadow-none bg-white dark:bg-black">
          <CardContent className="p-0">
            <QuestionFormSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="space-y-8">
        <PageHeader isSubmitting={false} isDirty={false} />
        <Card className="mx-auto border-none rounded-sm p-0 shadow-none bg-white dark:bg-black min-h-[500px] flex items-center justify-center">
          <EmptyState
            icon={FileQuestion}
            title="Question Not Found"
            description="The question you're trying to edit doesn't exist, you don't have permission to view it, or it has been deleted."
            action={{
              label: "Go back to Question Bank",
              href: "/question-bank",
            }}
            size="lg"
            className="border-none bg-transparent"
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader isSubmitting={updateMutation.isPending} isDirty={isDirty} />
      <Card className="mx-auto border-none rounded-sm p-0 shadow-none bg-white dark:bg-black">
        <CardContent className="p-0">
          <QuestionForm
            formId="question-form"
            initialData={{
              title: question.title,
              description: question.description || "",
              difficulty: question.difficulty,
              language: question.language || "",
              starterCode: question.starterCode || "",
            }}
            onSubmit={handleSubmit}
            onDirtyChange={setIsDirty}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Update Question"
        description="Are you sure you want to update this question? Existing coding rooms using this question might be affected by these changes."
        confirmLabel="Save Changes"
        cancelLabel="Cancel"
        onConfirm={handleConfirmUpdate}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}

function PageHeader({
  isSubmitting,
  isDirty,
}: {
  isSubmitting: boolean;
  isDirty: boolean;
}) {
  const router = useRouter();
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      router.push("/question-bank");
    }
  };

  return (
    <>
      <section id="page-header">
        <div className="flex flex-col @[600px]/main:flex-row @[600px]/main:items-center justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/question-bank">Question Bank</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Update Question</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-bold">Update Question</h1>
            <p className="text-muted-foreground text-sm">
              Modify the details, constraints, or starter code for this existing
              coding challenge.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1 @[600px]/main:w-auto h-auto px-6 py-2 rounded-sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 @[600px]/main:w-auto h-auto px-6 py-2 rounded-sm"
              type="submit"
              form="question-form"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={showCancelConfirm}
        onOpenChange={setShowCancelConfirm}
        title="Discard Changes?"
        description="You have unsaved changes. Are you sure you want to cancel? All the data you've entered will be lost."
        confirmLabel="Yes, Discard"
        cancelLabel="No, Keep Editing"
        variant="destructive"
        onConfirm={() => router.push("/question-bank")}
      />
    </>
  );
}
