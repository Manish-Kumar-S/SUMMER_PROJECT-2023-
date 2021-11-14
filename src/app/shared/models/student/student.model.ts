export interface StudentModel {
  email: string;
  first_name: string;
  last_name: string;
  reg_number: number;
  phone: number;
  campus: string;
  course_id: number;
  course_type: number;
  course_percentage: number;
  ug_course: string;
  ug_coursePercentage: number;
  grade10: string;
  grade10_percentage: number;
  grade12: string;
  grade12_percentage: number;
  history_of_arrears: boolean;
  current_arrears: boolean;
  number_of_arrears: number;
  year_gap: number;
  resume_link: string;
  photograph_link: string;
}
