// lib/chatUtils.ts
import { Message, ChatMember } from "@/lib/api";

/**
 * Determine if a message is read by checking if it comes before the last read message
 * @param message The message to check
 * @param messages All messages in the chat (sorted by sentAt)
 * @param members Chat members with their read status
 * @param currentUserId The ID of the current user
 * @returns true if the message is read by at least one other user
 */
export function isMessageRead(
  message: Message,
  messages: Message[],
  members: ChatMember[],
  currentUserId: number | string  // Accept both number and string
): boolean {
  // Convert to string for consistent comparison
  const currentUserIdStr = String(currentUserId);
  
  // Only check read status for messages sent by the current user
  if (String(message.senderId) !== currentUserIdStr) {
    return false;
  }

  // Find the index of this message in the sorted messages array
  const messageIndex = messages.findIndex(msg => msg.messageId === message.messageId);
  if (messageIndex === -1) return false;

  // Get all other members (excluding current user)
  const otherMembers = members.filter(member => String(member.userId) !== currentUserIdStr);
  
  // If no other members, message is considered "read" (edge case)
  if (otherMembers.length === 0) {
    return true;
  }

  // Check if ALL other members have read past this message
  for (const member of otherMembers) {
    // If this member has no last read message, they haven't read anything
    if (!member.lastReadMessageId) {
      return false; // At least one member hasn't read it
    }

    // Find the index of their last read message
    const lastReadIndex = messages.findIndex(msg => msg.messageId === member.lastReadMessageId);
    
    // If their last read message comes before this message, they haven't read it
    if (lastReadIndex < messageIndex) {
      return false; // At least one member hasn't read it
    }
  }

  // All other members have read this message
  return true;
}