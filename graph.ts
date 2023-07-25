import 'isomorphic-fetch';
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import * as MicrosoftGraphBeta from '@microsoft/microsoft-graph-types-beta';

export class GraphHelper {

    private client: Client;

    constructor(tenantId: string, clientId: string, clientSecret: string) {
        const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
        const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: ['https://graph.microsoft.com/.default'] });
        this.client = Client.initWithMiddleware({
            defaultVersion: 'beta',
            debugLogging: true,
            authProvider
        });
    }

    async GetMeetingTranscription(meetingId: string, organizerId: string) {
        // get transcripts for meeting
        const { value: transcripts }: { value: MicrosoftGraphBeta.CallTranscript[] } = await this.client.api(`/users/${organizerId}/onlineMeetings/${meetingId}/transcripts`).get();
        
        // return empty string if no transcripts
        if (transcripts.length === 0 && transcripts != null) { return "" };

        // get stream of first transcript
        const stream = await this.client.api(`/users/${organizerId}/onlineMeetings/${meetingId}/transcripts/${transcripts[0].id}/content?$format=text/vtt`).get();
        
        // return content as string
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.from(chunk));
        }
        return Buffer.concat(chunks).toString('utf-8');
    }
}