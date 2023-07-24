# Microsoft Teams Meeting Transcript Bot

This project was built using Teams Toolkit for Visual Studio Code `v5.0.1`.

Currently this app shows only the steps required for bots added to a meeting to be sent the meeting start and end activites from the bot service.

> NOTE: Meeting transcript functionality has not yet been implemented

## Get started

### 1. Create Application Access policy and grant policy to users

This is policy required to allow applications to access online meetings with application permissions.
The policy will need to be created and applied by a Teams or Global Adminstrator.

```pwsh
Install-Module -Name MicrosoftTeams -Force -AllowClobber
Connect-MicrosoftTeams
New-CsApplicationAccessPolicy -Identity Meeting-App-Policy -AppIds "<BOT_ID>" -Description "Allow applications to access online meetings with application permissions"
Grant-CsApplicationAccessPolicy -PolicyName Meeting-App-Policy -Global
```

Source: https://learn.microsoft.com/en-us/graph/cloud-communication-online-meeting-application-access-policy#configure-application-access-policy

> NOTE: Without this policy in place, the `onTeamsMeetingStartEvent` and `onTeamsMeetingEndEvent` handlers will not trigger as no message will be sent from the Bot Service when a meeting starts or ends to the messaging endpoint.

### 2. Project setup

1. Install Teams Toolkit extension.
1. Create `env/.env.local` file and add environment variable placeholders, see below.
1. Create `env/.env.local.user` and add environment variable placeholders, see below.

> Teams Toolkit will populate all the environment variable values on first run.

#### env/.env.local

```
TEAMSFX_ENV=local

BOT_ID=
TEAMS_APP_ID=
BOT_DOMAIN=
BOT_ENDPOINT=
TEAMS_APP_TENANT_ID=
```

#### env/.env.local.user

```
SECRET_BOT_PASSWORD=
```

### 2. Run the app

1. Start debug session (F5).
2. When the App Install dialog appears, close the dialog window.

### 3. Create meeting

1. Open the Calendar app from the left hand rail.
1. Create a new meeting and invite at least one person to make it an online meeting.
1. Save the meeting.
1. Re-open the meeting from the calendar (double click) and close it.

> NOTE: Re-opening the meeting after creating it ensures that the meeting is cached so you can select it in the list of meetings when you side load the app.

### 4. Sideload and test your app

1. Open Visual Studio Code and select the Output tab.
1. Find the line that has the line `Teams web client is being launched for you to debug the Teams app:`
1. Copy the URL, which will look like: `https://teams.microsoft.com/l/app/e7b0b08c-0966-4f57-84ca-6e53ffdd6e20?installAppPackage=true&webjoin=true&appTenantId=bf805346-44e7-43f7-8e60-c5e24aefe49c&login_hint=user@domain.onmicrosoft.com`
1. In the App Install dialog, select the dropdown next to the Add button.
1. Select `Add to a Meeting`.
1. Select your meeting in the list. Select `Setup your bot`.
1. The welcome message will display in the meeting chat.
1. Join the meeting, a message will display in the chat when the meeting starts.
1. Leave the meeting, a message will display in the chat when the meeting ends.

## Resource Specific Consent

This application uses Resource Specific Consent. The `webApplicationInfo` and `authorization` objects in the app manifest request resource specific consent. This is required for your bot to access basic meeting data on behalf of users.

> NOTE: Without this in place, the `onTeamsMeetingStartEvent` and `onTeamsMeetingEndEvent` handlers will not trigger as no message will be sent from the Bot Service when a meeting starts or ends to the messaging endpoint.

```json
"webApplicationInfo": {
    "id": "${{BOT_ID}}",
    "resource": "https://RscBasedStoreApp"
},
"authorization": {
    "permissions": {
        "resourceSpecific": [
            {
                "name": "OnlineMeeting.ReadBasic.Chat",
                "type": "Application"
            }
        ]
    }
}
```

Source: https://learn.microsoft.com/en-us/microsoftteams/platform/graph-api/rsc/grant-resource-specific-consent#request-rsc-permissions-for-teams-app

> NOTE: Whenever an authorized user installs your app within Teams, the RSC permissions requested in the app’s manifest are shown to the user. The permissions are granted as part of the app installation process.

> NOTE: The `resource` field has no operation in RSC but you must add a value to avoid an error response. You can add any string as value.