import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { RoomSummary } from "@code-interview/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Calendar,
  Check,
  Copy,
  Pen,
  Trash,
  Code,
  Loader2,
  Clock,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import { formatDuration } from "@/lib/utils";
import { InterviewRoomFormDialog } from "./interview-room-form-dialog";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { ConfirmDialog } from "./confirm-dialog";
import {
  useDeleteRoom,
  useUpdateRoom,
  useCloseRoom,
} from "@/lib/hooks/use-rooms";

export default function InterviewRoomCard({ room }: { room: RoomSummary }) {
  const clipboard = useCopyToClipboard();
  const { mutateAsync: updateRoom, isPending: isUpdating } = useUpdateRoom();
  const { mutateAsync: deleteRoom, isPending: isDeleting } = useDeleteRoom();
  const { mutateAsync: closeRoom, isPending: isClosing } = useCloseRoom();
  return (
    <Card className="rounded-xs">
      <CardHeader>
        <CardTitle className="text-xl truncate font-medium" title={room.title}>
          {room.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className="text-sm text-muted-foreground">
              {room.status === "OPEN" ? (
                <Badge className="block h-auto px-2 py-0.5 font-bold bg-green-200 dark:bg-[#17332d] text-green-700 dark:text-[#2dd381] text-[10px] uppercase rounded-xs">
                  Open
                </Badge>
              ) : (
                <Badge className="block h-auto px-2 py-0.5 font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-200 text-[10px] uppercase rounded-xs">
                  Closed
                </Badge>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Room code:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{room.code}</span>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="text-muted-foreground"
                onClick={() => clipboard.copyToClipboard(room.code, "code")}
              >
                {clipboard.copiedId === "code" ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Room link:</span>
            <div className="flex items-center gap-2 overflow-hidden">
              <Link
                href={`/room/${room.code}/join`}
                className="text-sm text-primary hover:underline truncate max-w-[150px]"
              >
                {`${process.env.NEXT_PUBLIC_WEB_URL}/room/${room.code}/join`}
              </Link>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="text-muted-foreground"
                onClick={() => {
                  const url = `${process.env.NEXT_PUBLIC_WEB_URL}/room/${room.code}/join`;
                  clipboard.copyToClipboard(url, "link");
                }}
              >
                {clipboard.copiedId === "link" ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <Separator className="bg-border mt-4 mb-2" />
        <div className="flex items-center gap-3 flex-row">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {formatDuration(room.roomDuration)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Code className="w-3 h-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{room.language}</p>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {format(room.createdAt, "dd MMM yyyy")}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 items-stretch rounded-none px-2 py-2.5 bg-slate-100 dark:bg-[#111113]">
        <ConfirmDialog
          title="Delete room"
          description="Are you sure you want to delete this room?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          variant="destructive"
          onConfirm={async () => {
            await deleteRoom(room.code);
          }}
          trigger={
            isDeleting ? (
              <Button
                variant="outline"
                disabled={isDeleting}
                className="rounded-xs px-4 py-2 h-auto font-medium text-sm border-dashed border-destructive!"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={isDeleting}
                className="rounded-xs px-4 py-2 h-auto font-medium text-sm border-dashed border-destructive!"
              >
                <Trash />
              </Button>
            )
          }
        />
        <InterviewRoomFormDialog
          room={{
            title: room.title,
            language: room.language,
            roomDuration: room.roomDuration,
            question: room.question?.id ?? undefined,
            roomCode: room.code ?? "",
          }}
          mode="edit"
          trigger={
            <Button
              variant={"outline"}
              className="rounded-xs px-4 py-2 h-auto font-medium text-sm border-dashed border-primary!"
            >
              <Pen />
            </Button>
          }
          isSubmitting={isUpdating || isClosing}
          onSubmit={async (values) => {
            await updateRoom({
              code: room.code,
              payload: values,
            });
          }}
          onCloseRoom={async () => {
            await closeRoom(room.code);
          }}
        />
        <Button
          asChild
          className="flex-1 bg-primary! text-white rounded-xs px-6 py-3 h-auto font-bold text-sm hover:opacity-85"
        >
          <Link href={`/room/${room.code}`}>Enter room</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
