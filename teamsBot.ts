import {
  MeetingEndEventDetails,
  MeetingStartEventDetails,
  TeamsActivityHandler,
  TeamsInfo,
  TurnContext,
} from "botbuilder";
import { GraphHelper } from "./graph";
import config from "./config";
import { TeamsMeetingInfo } from "./interfaces";

export class TeamsBot extends TeamsActivityHandler {

  constructor() {
    super();

    // send welcome message when installed
    this.onInstallationUpdateAdd(async (context, next) => {
      await context.sendActivity("Thanks for installing me!");
      await next();
    });

    // send message when meeting starts
    this.onTeamsMeetingStartEvent(async (meeting: MeetingStartEventDetails, context: TurnContext, next: () => Promise<void>): Promise<void> => {
      await context.sendActivity(`Meeting started at ${meeting.startTime}`);
      await next();
    });

    // send messages when meeting ends
    this.onTeamsMeetingEndEvent(async (meeting: MeetingEndEventDetails, context: TurnContext, next: () => Promise<void>): Promise<void> => {
      // get meeting details
      const meetingDetails = await TeamsInfo.getMeetingInfo(context, meeting.id) as TeamsMeetingInfo;
      const { msGraphResourceId: meetingId } = meetingDetails.details;

      // get organizer details
      const { aadObjectId: userId, tenantId } = meetingDetails.organizer;

      // get transcription from Microsoft Graph
      const graphHelper = new GraphHelper(tenantId, config.botId, config.botPassword);
      const content = await graphHelper.GetMeetingTranscription(meetingId, userId);

      // send messages to meeting chat
      await context.sendActivity(`Meeting ${meetingId} ended at ${meeting.endTime}`);
      await context.sendActivity(`Transcription: ${content ? content : "No transcription available"}`);
      await next();
    });

  };
}
