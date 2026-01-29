import { prisma } from "@/lib/prisma";
import RsvpForm from "./RsvpForm";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ publicSlug: string }>;
}) {
  const { publicSlug } = await params;

  const invite = await prisma.invite.findUnique({
    where: { publicSlug },
  });

  if (!invite) return <div>Invite not found</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(/backgrounds/${invite.style}.jpg)` }}
    >
      <div className="min-h-screen bg-black/70">
        <div className="max-w-xl mx-auto p-6 space-y-4 text-white">
          <h1 className="text-2xl font-bold">{invite.title}</h1>
          <p>{invite.body}</p>

          <RsvpForm inviteId={invite.id} />
        </div>
      </div>
    </div>
  );
}
