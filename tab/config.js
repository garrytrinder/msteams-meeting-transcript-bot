import 'https://unpkg.com/@microsoft/teams-js@2.13.0/dist/MicrosoftTeams.min.js';

(() => {
    microsoftTeams.app.initialize().then(() => {
        microsoftTeams.pages.config.registerOnSaveHandler((saveEvent) => {
            microsoftTeams.pages.config.setConfig({
                suggestedDisplayName: "Meeting Tab",
                entityId: "meetingTab",
                contentUrl: `https://${window.location.hostname}/tab.html`,
                websiteUrl: `https://${window.location.hostname}/tab.html`,
            }).then(() => {
                saveEvent.notifySuccess();
            });
        });
        microsoftTeams.pages.config.setValidityState(true);
    });
})();