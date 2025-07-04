import { authenticate } from "~/shopify.server";
import { prisma as db } from "~/lib/prisma.server";

export const action = async ({ request }) => {
  const { payload, session } = await authenticate.webhook(request);

  const current = payload.current;

  if (session) {
    await db.session.update({
      where: {
        id: session.id,
      },
      data: {
        scope: current.toString(),
      },
    });
  }

  return new Response();
};
