// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  loginServer: 'https://cocon2.tedsys.in/cocon-counter-version/public',
  appKey: 'ABCD0001',  
  // API Endpoints
  endpoints: {
    eventDetails: { api: 'api/fetch-active-event', method: 'get', authenticationType: 'appkey' },
    login: { api: 'api/login-with-otp', method: 'post', authenticationType: 'appkey' },
    verifyOtp: { api: 'api/verify-otp', method: 'post', authenticationType: 'appkey' },
    delegateprofile: { api: 'api/delegate/profile', method: 'get', authenticationType: 'OAuth' },
    delegateBadge: { api: 'api/delegate/virtual-badge', method: 'get', authenticationType: 'OAuth' },
    networkingDelegates: { api: 'api/networking-delegates', method: 'get', authenticationType: 'OAuth' },
    networkingStatusUpdated: { api: 'api/update-networking-status', method: 'post', authenticationType: 'OAuth' },
    addChatRequest: { api: 'api/store-chat-request', method: 'post', authenticationType: 'OAuth' },
    updateChatRequest: { api: 'api/update-chat-request', method: 'post', authenticationType: 'OAuth' },
    fetchChatMessages: { api: 'api/fetch-chat-messages', method: 'get', authenticationType: 'OAuth' },
    addChatMessage: { api: 'api/store-chat-message', method: 'post', authenticationType: 'OAuth' },
    schedules: { api: 'api/schedules', method: 'get', authenticationType: 'appkey' },
    todaySchedule: { api: 'api/today-schedules', method: 'get', authenticationType: 'appkey' },
    participants: { api: 'api/participants', method: 'get', authenticationType: 'appkey' },
    sponserCategories: { api: 'api/sponsor-categories', method: 'get', authenticationType: 'appkey' },
    sponserList: { api: 'api/sponsors', method: 'get', authenticationType: 'appkey' },
    feedbackQuestionList: { api: 'api/feedback-questions', method: 'get', authenticationType: 'OAuth' },
    feedbackSubmit: { api: 'api/store_delegate_feedback', method: 'post', authenticationType: 'OAuth' },
    exhibitorsList: { api: 'api/exhibitors', method: 'get', authenticationType: 'appkey' },
    directoryCategories: { api: 'api/directory-categories', method: 'get', authenticationType: 'appkey' },
    directoryList: { api: 'api/directories', method: 'get', authenticationType: 'appkey' },
    attractionCategories: { api: 'api/attraction-categories', method: 'get', authenticationType: 'appkey' },
    attractionList: { api: 'api/attractions', method: 'get', authenticationType: 'appkey' },
    fcmToken: { api: 'api/update-phone-identifier', method: 'post', authenticationType: 'OAuth' },
    appHelp: { api: 'api/fetch-app-help', method: 'get', authenticationType: 'appkey' },
    aboutConference: { api: 'api/fetch-about-conference', method: 'get', authenticationType: 'appkey' },
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
