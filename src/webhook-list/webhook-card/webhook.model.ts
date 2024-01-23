export type UnitTime = 'seconds' | 'minutes'
export const UnitTime = {
  Seconds: 'seconds' as UnitTime,
  Minutes: 'minutes' as UnitTime
}

export interface Path {
  path: string;
  totalMessage: number;
  lastMessageAt: string;
}

export interface Message {
  messageId: string;
  path: string;
  serviceSentMessageAt: string;
  serverReceivedMessageAt: string;
  responseStatusCode: number;
  serverTimeout: number;
  extra: any;
}
