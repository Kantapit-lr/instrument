export interface ProjectFormData {
  name: string;
  nickName: string;
}

export const emptyProjectForm: ProjectFormData = {
  name: "",
  nickName: "",
};

export interface ProjectListItem {
  projectId: number;
  name: string;
  nickName: string;
  profileCount: number;
}
