
import { Channel, Member, User } from "@prisma/client";

export type ChannelWithMembersWithProfiles = Channel & {
    members: (Member & {profile: User})
};