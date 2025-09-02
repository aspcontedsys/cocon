export interface RegisteredUser {
    id: number;
    name: string;
    short_name: string;
    image: string;
    status: string;
}

export interface ChatListUsers extends RegisteredUser {
  conversation_id: number;

  // 🔹 New optional fields
  linkedin?: string;     // LinkedIn profile URL
  requestSent?: boolean; // Local state for request toggle
}

export interface OpenListUsers extends ChatListUsers {
  unread_count: number;
}

export interface ChatHistory {
  id: number;
  sender_id: number;
  message: string;
  message_type: string;
  created_at: Date;
  attachment_path: string;
  attachment_type: string;
  read_at: Date;
}

export interface Conversations {
  id: number;
  from_id: number;
  to_id: number;
  last_message: string;
  last_messaged_at: Date;
}

export interface sendModel extends ChatHistory {
  conversation_id: number;
  to_id: number;
}

export interface loginResponse {
  token: string;
  data: RegisteredUser;
}

export interface Speaker {
  salutation: string;
  name: string;
  designation: string;
  company_name: string;
  about: string;
  photo: string;
  role: string;
  topics: Topic[];
  linkedin?: string;
}

interface Topic {
  end_time: string;
  event_date: string;
  facility_id: number;
  facility_name: string;
  name: string;
  start_time: string;
  topic_duration: string;
}

export interface EventDetails {
  id: number;
  name: string;
  website_url: string;
  about_conference: string;
  app_help: string;
  venue_layout: string;
  stall_layout: string;
}

export interface DelegateProfile {
  category: string;
  name: string;
  short_name: string;
  unique_no: string;
  email: string;
  mobile: string;
  designation: string;
  company_name: string;
  workshop: string;
  image: string;
}

export interface VirtualBadge {
  category: string;
  name: string;
  designation: string;
  company_name: string;
  qr_code: string;
}

export interface Schedule {
  event_date: string;
  halls: Hall[];
}

interface Hall {
  hall_id: number;
  hall_name: string;
  topics: Topic[];
}

interface Topic {
  topic_name: string;
  start_time: string;
  end_time: string;
  roles: Role[];
}

interface Role {
  role_id: number;
  role_name: string;
  participants: Participant[];
}

interface Participant {
  id: number;
  name: string;
  email: string | null;
}

export interface SponsorsList {
  id: number;
  name: string;
  image: string;
  sponsors: Sponsor[];
}

export interface Sponsor {
  id: number;
  name: string;
  image: string;
}

export interface FeedbackQuestion {
  id: number;
  feedback_head: string;
  name: string;
  answer_type: string;
}

export interface Exhibitor {
  id: number;
  name: string;
  address: string;
  phone: string;
  products: string;
}

export interface DirectoryList {
  id: number;
  name: string;
  phone: string;
  directories: Directory[];
}

export interface Directory {
  id: number;
  name: string;
  phone: string;
}

export interface Attractions {
  id: number;
  name: string;
  attractions: Attraction[];
}

export interface Attraction {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface AppHelp {
  app_help: string;
}

export interface AboutConference {
  about_conference: string;
}
