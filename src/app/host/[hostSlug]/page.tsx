import { prisma } from "@/lib/prisma";

export default async function HostPage({
  params,
}: {
  params: Promise<{ hostSlug: string }>;
}) {
  const { hostSlug } = await params;

  const invite = await prisma.invite.findUnique({
    where: { hostSlug },
    include: {
      rsvps: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!invite) return <div>Invite not found</div>;

  const counts = {
    YES: invite.rsvps.filter((r) => r.response === "YES").length,
    NO: invite.rsvps.filter((r) => r.response === "NO").length,
    MAYBE: invite.rsvps.filter((r) => r.response === "MAYBE").length,
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(/backgrounds/${invite.style}.jpg)` }}
    >
      <div className="min-h-screen bg-black/70">
        <div className="max-w-2xl mx-auto p-6 space-y-4 text-white">
          <h1 className="text-2xl font-bold">Host Dashboard</h1>

          <div className="border p-4 rounded">
            <h2 className="font-semibold">{invite.title}</h2>
            <p className="text-sm text-gray-300">{invite.body}</p>
          </div>

          <div className="border p-4 rounded">
            <p className="font-semibold">Guest Invite Link</p>
            <code className="block mt-2 p-2 bg-gray-100 text-gray-800 rounded">
              http://localhost:3000/i/{invite.publicSlug}
            </code>
          </div>

          <div className="border p-4 rounded space-y-4">
            <p className="font-semibold">RSVPs</p>

            <div className="flex gap-4">
              <div>Yes: {counts.YES}</div>
              <div>No: {counts.NO}</div>
              <div>Maybe: {counts.MAYBE}</div>
            </div>

            {invite.rsvps.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Name</th>
                    <th className="text-left py-1">Response</th>
                    <th className="text-left py-1">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {invite.rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="border-b">
                      <td className="py-1">{rsvp.name}</td>
                      <td className="py-1">{rsvp.response}</td>
                      <td className="py-1">
                        {rsvp.createdAt.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-400">No RSVPs yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
