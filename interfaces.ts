export interface TeamsMeetingInfo {
    details: Details;
    conversation: Conversation;
    organizer: Organizer;
}

interface Conversation {
    id: string;
    isGroup: boolean;
    conversationType: string;
}

interface Details {
    id: string;
    msGraphResourceId: string;
    scheduledStartTime: Date;
    scheduledEndTime: Date;
    joinUrl: string;
    title: string;
    type: string;
}

interface Organizer {
    id: string;
    tenantId: string;
    aadObjectId: string;
}
