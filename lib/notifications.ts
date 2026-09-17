import { Prisma } from "@prisma/client";

export async function createUserNotification(
  tx: Prisma.TransactionClient,
  userId: string,
  title: string,
  message: string,
  type = "INFO"
) {
  return tx.notification.create({ data: { userId, title, message, type } });
}
