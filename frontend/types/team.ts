export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  linkedinUrl?: string;
  githubUrl?: string;
  instagramUrl?: string;
  phoneNumber?: string;
}

export interface TeamSubcategory {
  title: string;
  members: TeamMember[];
}

export interface TeamCategory {
  id: string;
  name: string;
  year: number;
  subcategories: TeamSubcategory[];
}

export interface SidebarItem {
  icon: string;
  alt: string;
  label: string;
  path: string;
  darkIcon: string;
}
