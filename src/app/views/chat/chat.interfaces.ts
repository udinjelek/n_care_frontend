export interface SidebarLatestMessage {
  name: string;
  userid: number ;
  photoUrl?: string;
  latestMessage: string;
  latestTime: string;
  isRead: boolean;
}

export interface DialogMessage {
  sender_id: number ;
  sender_name_used: string;
  message: string;
}