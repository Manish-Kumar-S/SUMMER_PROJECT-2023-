import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseModel } from 'src/app/shared/models/student/course.model';
import { API } from 'src/environments/environment';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-apply-drive',
  templateUrl: './apply-drive.component.html',
  styleUrls: ['./apply-drive.component.scss'],
})
export class ApplyDriveComponent implements OnInit {

  company: any;
  courses: CourseModel[];
  driveId: number;
  applySpinner: boolean = false;
  applySuccess: boolean = false;
  applyError: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.studentService.getCourses().subscribe((data) => {
      this.courses = data;
      this.http.get<any>(`${API}/student/drives/upcoming`).subscribe((data) => {
        // console.log(data)
        this.route.queryParams.subscribe((params) => {
          data.companies.forEach((c:any) => {
            // console.log(c.id);
            this.driveId = c.id;
            if (c.id === +params.id) {
              this.company = c;
            }
          });
         });
        // this.companies = data.companies;
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

    this.http.post<any>(`${API}/student/drives/apply?drive_id=${this.driveId}`, {}).subscribe((data) => {
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