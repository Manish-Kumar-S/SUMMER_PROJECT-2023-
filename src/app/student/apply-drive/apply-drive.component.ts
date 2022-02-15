import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseModel } from 'src/app/shared/models/student/course.model';
import { API } from 'src/environments/environment';
import { StudentService } from '../student.service';
import { StudentModel } from '../../shared/models/student/student.model';

@Component({
  selector: 'app-apply-drive',
  templateUrl: './apply-drive.component.html',
  styleUrls: ['./apply-drive.component.scss'],
})
export class ApplyDriveComponent implements OnInit {

  company: any;
  student: StudentModel;
  courses: CourseModel[];
  driveId: number;
  applySpinner: boolean = false;
  applySuccess: boolean = false;
  applyError: boolean = false;

  get pendingApproval(): boolean {

    return this.student.pending_approval;
  }

  get passing_out_year(): boolean {

    return this.company.eligible_status.year_batch_eligible;
  }

  get course_percentage(): boolean {

    return this.company.eligible_status.eligibility_in_present;
  }

  get current_arrears(): boolean {

    return this.company.eligible_status.current_arrears;
  }

  get history_of_arrears(): boolean {

    return this.company.eligible_status.history_of_arrears;
  }

  get eligibility_12(): boolean {

    return this.company.eligible_status.eligibility_12;
  }

  get eligibility_10(): boolean {

    return this.company.eligible_status.eligibility_10;
  }

  get eligible_status(): boolean {

    return this.company.eligible_status.eligible_status;
  }

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.studentService.getCourses().subscribe((data) => {
      this.courses = data;
      this.studentService.getUpcomingCompanies().subscribe((data) => {
        this.route.queryParams.subscribe((params) => {
          data.companies.forEach((c:any) => {
            this.driveId = c.id;
            if (c.id === +params.id) {
              this.company = c;
            }
          });
         });
        this.student = this.studentService.currentStudent;
        console.log(this.company);
        console.log(this.studentService.currentStudent);
      });
    });
  }

  filterCourses(course_id: string) {
    return this.courses.filter((d) => d.id === +course_id)[0].code;
  }

  applyDrive() {

    this.applySpinner = true;

    this.studentService.applyDrive(this.driveId).subscribe((data) => {
      if(data.response.status == 200) {
        console.log(data);
        this.applySpinner = false;
        this.applySuccess = true;
      }else {
        this.applySpinner = false;
        this.applyError = true;
      }
    });
  }
  
}
