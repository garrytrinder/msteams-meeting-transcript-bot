import {
  MeetingEndEventDetails,
  MeetingStartEventDetails,
  TeamsActivityHandler,
  TurnContext,
} from "botbuilder";

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

    // send message when meeting ends
    this.onTeamsMeetingEndEvent(async (meeting: MeetingEndEventDetails, context: TurnContext, next: () => Promise<void>): Promise<void> => {
      await context.sendActivity(`Meeting ended at ${meeting.endTime}`);
      await next();
    });

  };
}
