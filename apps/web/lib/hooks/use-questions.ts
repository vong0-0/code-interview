import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { questionService, questionKeys } from "@/lib/services/question.service";
import { QuestionFilters } from "../types/question.type";
import { QuestionFormPayload } from "../schemas/question.schema";

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: QuestionFormPayload) =>
      questionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}

export function useQuestions(filters?: QuestionFilters, options?: Omit<Parameters<typeof useQuery>[0], "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: questionKeys.list(filters ?? {}),
    queryFn: () => questionService.getAll(filters),
    ...options,
  });
}

export function useQuestionOverview() {
  const { data: questions, isLoading } = useQuery({
    queryKey: questionKeys.list({}),
    queryFn: () => questionService.getAll(),
  });

  const overview = {
    totalQuestions: questions?.length ?? 0,
    easyQuestions:
      questions?.filter((q) => q.difficulty === "EASY").length ?? 0,
    mediumQuestions:
      questions?.filter((q) => q.difficulty === "MEDIUM").length ?? 0,
    hardQuestions:
      questions?.filter((q) => q.difficulty === "HARD").length ?? 0,
  };

  return { overview, isLoading };
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => questionService.getOne(id),
    enabled: !!id,
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: QuestionFormPayload }) =>
      questionService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(id) });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}
