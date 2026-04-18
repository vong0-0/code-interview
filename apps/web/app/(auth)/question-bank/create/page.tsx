"use client";

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

import { QuestionForm } from "@/components/common/question-form";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { QuestionFormValues } from "@/lib/schemas/question.schema";
import { Loader2 } from "lucide-react";
import { useCreateQuestion } from "@/lib/hooks/use-questions";

export default function CreateQuestionPage() {
  const router = useRouter();
  const createQuestionMutation = useCreateQuestion();

  const handleSubmit = async (values: QuestionFormValues) => {
    createQuestionMutation.mutate(values, {
      onSuccess: () => {
        router.push("/question-bank");
      },
      onError: (error) => {
        console.error("Failed to create question:", error);
      },
    });
  };

  const isSubmitting = createQuestionMutation.isPending;

  return (
    <div className="space-y-8">
      <PageHeader isSubmitting={isSubmitting} />
      <Card className="mx-auto border-none rounded-sm p-0 shadow-none bg-white dark:bg-black">
        <CardContent className="p-0">
          <QuestionForm formId="question-form" onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
function PageHeader({ isSubmitting }: { isSubmitting: boolean }) {
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
                  <BreadcrumbPage>New Question</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-bold">New Question</h1>
            <p className="text-muted-foreground text-sm">
              Create a new coding challenge for your question bank to use in
              future technical interviews.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1 @[600px]/main:w-auto h-auto px-6 py-2 rounded-sm"
              asChild
            >
              <Link href="/question-bank">Cancel</Link>
            </Button>
            <Button
              className="flex-1 @[600px]/main:w-auto h-auto px-6 py-2 rounded-sm"
              type="submit"
              form="question-form"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Question
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
