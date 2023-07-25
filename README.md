# Microsoft Teams Meeting Transcript Bot

This project was built using Teams Toolkit for Visual Studio Code `v5.0.1`.

## Get started

Follow the below steps to run this app against your Microsoft 365 tenant from your local machine.

> NOTE: It is highly recommended to use a free [Microsoft 365 Developer Program Instant Sandbox](https://developer.microsoft.com/en-us/microsoft-365/dev-program)

### 1. Enable Meeting Transcripts

Meeting transcripts are not enabled by default, so you will need to ensure that the setting is enabled on the `Global (org-wide)` policy.

1. Navigate to the [Microsoft Teams Admin Center](https://admin.teams.microsoft.com).
1. Expand the `Meetings` section on the left hand menu and select `Meeting policies`.
1. Select `Global (org-wide)` policy.
1. Find the `Recording & Transcription` section and toggle the `Transcription` setting to `On`.
1. Save the changes.

> NOTE: This can take 30 mins+ for the policy to propogate to all users.

### 2. Project setup

1. Install Teams Toolkit extension.
1. Create `env/.env.local` file and add environment variable placeholders, see below.
1. Create `env/.env.local.user` and add environment variable placeholders, see below.

> NOTE: Teams Toolkit will populate all the environment variable values on first run.

#### env/.env.local

```
TEAMSFX_ENV=local

BOT_ID=
BOT_OBJECT_ID=
TEAMS_APP_ID=
BOT_DOMAIN=
BOT_ENDPOINT=
TEAMS_APP_TENANT_ID=
```

#### env/.env.local.user

```
SECRET_BOT_PASSWORD=
```

### 3. Run the app

This is required to start the required local services and also provision the required cloud resources.

1. Start debug session (F5).
1. When the App Install dialog appears, close the dialog window.

### 4. Grant API Permissions consent

During the provisioning of cloud resources an Azure AD App Registration is created with Application permissions to Microsoft Graph which will require admin consent.

1. Open a new tab and navigate to `https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/CallAnAPI/appId/{BOT_ID}/isMSAApp~/false` replacing `{BOT_ID}` with the environment variable value in `env/.env.local`.
2. Select `Grant admin consent for <domain>` and select `Yes` to confirm the prompt.

### 5. Create Application Access policy and grant policy to users

This is policy required to allow applications to access online meetings with application permissions. Replacing `{BOT_ID}` with the environment variable value from 

Open a PowerShell window and run each line individually. 

> NOTE: Replace `{BOT_ID}` with the environment variable value in `env/.env.local` to execute `New-CsApplicationAccessPolicy` cmdlet.

```pwsh
Install-Module -Name MicrosoftTeams -Force -AllowClobber
Connect-MicrosoftTeams
New-CsApplicationAccessPolicy -Identity Meeting-App-Policy -AppIds "{BOT_ID}" -Description "Allow applications to access online meetings with application permissions"
Grant-CsApplicationAccessPolicy -PolicyName Meeting-App-Policy -Global
```

Source: https://learn.microsoft.com/en-us/graph/cloud-communication-online-meeting-application-access-policy#configure-application-access-policy

> NOTE: The policy will need to be created and applied by a Teams or Global Adminstrator.

> NOTE: Without this policy in place, the `onTeamsMeetingStartEvent` and `onTeamsMeetingEndEvent` handlers will not trigger as no message will be sent from the Bot Service when a meeting starts or ends to the messaging endpoint.

### 6. Create meeting

1. Open the Calendar app from the left hand rail in Microsoft Teams.
1. Create a new meeting and invite at least one person to make it an online meeting.
1. Save the meeting.
1. Re-open the meeting from the calendar (double click) and close it.

> NOTE: Re-opening the meeting after creating it ensures that the meeting is cached so you can select it in the list of meetings when you side load the app.

### 7. Sideload and test your app

1. Open `Visual Studio Code` and select the `Output` tab to view `Teams Toolkit` logs.
1. Find the line that has `Teams web client is being launched for you to debug the Teams app:`
1. Navigate to the URL shown, which will look like: `https://teams.microsoft.com/l/app/e7b0b08c-0966-4f57-84ca-6e53ffdd6e20?installAppPackage=true&webjoin=true&appTenantId=bf805346-44e7-43f7-8e60-c5e24aefe49c&login_hint=user@domain.onmicrosoft.com` to start the sideloading process.
1. In the App Install dialog window, select the dropdown next to the Add button and select `Add to a Meeting`.
1. Select the meeting in the list that you want to add the app to, then select `Setup your bot`.
1. A message will be displayed in the meeting chat when the app is installed.
1. Join the meeting, a message will display in the chat when the meeting starts.
1. In the meeting, select `More`, open the `Record and transcribe` menu and select `Start transcript`.
1. Talk in the meeting to generate content.
1. Select `More`, open the `Record and transcribe` menu and select `Stop transcript`.
1. Leave the meeting, a message will display in the chat when the meeting ends and another message is displayed with the transcript contents.

> NOTE: The code in this sample only returns the first transcript from the meeting. Starting and stopping a meeting with an existing transcript will return the same contents each time. See line 24 in `./graph.ts`.

# Useful Information

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

## Microsoft Graph Transcripts API

As of 25th July 2023, obtaining the meeting transcriptions and their contents is only possible through the Microsoft Graph API `beta` endpoint.

Source: https://learn.microsoft.com/en-us/microsoftteams/platform/graph-api/meeting-transcripts/api-transcripts

> NOTE: APIs under the `/beta` version in Microsoft Graph are subject to change. Use of these APIs in production applications is not supported.