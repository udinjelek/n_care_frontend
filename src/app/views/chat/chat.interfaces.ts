export interface SidebarLatestMessage {
  name: string;
  userid: number ;
  photoUrl?: string;
  latestMessage: string;
  isRead: boolean;
  timestamp: number;
  date_time_string: string;
}

export interface DialogMessage {
  sender_id: number ;
  receive_id: number ;
  sender_name_used: string;
  message: string;
  timestamp: number;
  date_time_string: string;
  group_ally: boolean;
  is_first: boolean;
  is_last: boolean;
  attachment_url: string;
  is_picture: boolean;
  file_name: string;
}