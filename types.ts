export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
  isWhatsappButton?: boolean;
  sources?: GroundingSource[] | null;
}

export enum ProjectStatus {
  COMPLETED = 'Concluído',
  IN_PROGRESS = 'Em Andamento',
  UNDER_CONSTRUCTION = 'Em Construção',
}

export interface Project {
  title: string;
  description: string;
  status: ProjectStatus;
  tech: string[];
  repoUrl?: string;
  deployUrl?: string;
}

export enum TimelineItemType {
  EDUCATION = 'education',
  EXPERIENCE = 'experience'
}

export interface TimelineItem {
    type: TimelineItemType;
    title: string;
    institution: string;
    period: string;
    description: string[];
}