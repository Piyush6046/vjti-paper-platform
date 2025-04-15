
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface ChatMessageProps {
  message: Message;
  isCurrentUser?: boolean;
}

export function ChatMessage({ message, isCurrentUser = false }: ChatMessageProps) {
  const { content, user, timestamp } = message;

  return (
    <div
      className={`flex ${
        isCurrentUser ? "justify-end" : "justify-start"
      } mb-4`}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col max-w-[75%]">
        {!isCurrentUser && (
          <span className="text-xs text-muted-foreground mb-1">{user.name}</span>
        )}
        <div
          className={`rounded-lg p-3 ${
            isCurrentUser
              ? "bg-vjti-accent text-white"
              : "bg-muted"
          }`}
        >
          <p className="text-sm">{content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
        </span>
      </div>
      {isCurrentUser && (
        <Avatar className="h-8 w-8 ml-2">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
