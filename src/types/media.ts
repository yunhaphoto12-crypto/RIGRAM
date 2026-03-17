export type Media = {
  id: string;
  school_id: string;
  department_id: string;
  url: string;
  type: 'photo' | 'video';
  category: 'all' | 'team' | 'organization' | 'club' | 'event';
  video_thumbnail: string | null;
  created: string;
  updated: string;
};
