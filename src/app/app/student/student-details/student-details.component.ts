import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMapTo } from 'rxjs/operators';
import { CourseModel } from 'src/app/shared/models/student/course.model';
import { StudentModel } from 'src/app/shared/models/student/student.model';
import { API, IMG_URL } from 'src/environments/environment';
import { StudentService } from '../student.service';
import { StudentModelComponent } from './student-model/student-model.component';
import { VisualFeedbackService } from 'src/app/shared/visual-feedback/visual-feedback.service';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss'],
})
export class StudentDetailsComponent implements OnInit {

  student: StudentModel;
  photographLink: string;

  courses: CourseModel[];

  options: any[];
  courseTypes: any[];

  myData$: Observable<Object>;
  event$: BehaviorSubject<any>;

  placeholderLink = `${IMG_URL}/placeholder-profile.png`;

  first_login = false;

  constructor(
    private dialog: MatDialog,
    private studentService: StudentService,
  ) {
    this.options = [
      { key: 'Yes', value: true },
      { key: 'No', value: false },
    ];
    this.courseTypes = [
      {
        key: 'Full Time',
        value: 1,
      },
      { key: 'Part Time', value: 2 },
    ];
    this.event$ = new BehaviorSubject(true);
    this.myData$ = this.event$.pipe(switchMapTo(this.studentService.getStudent().pipe(map(response => response?.profile))));
  }

  altImg() {

    this.photographLink = `${IMG_URL}/placeholder-profile.png`;
  }

  ngOnInit(): void {

    this.studentService.getStudent().pipe(

      map((response) => {

        this.first_login = response?.first_login;

        return response?.profile;
      }),

      mergeMap((data) => {

        this.student = data;

        this.student.photograph_link !== 'null'
          ? (this.photographLink = this.convertImgURL(data.photograph_link))
          : (this.photographLink = `${IMG_URL}/user.jpg`);

        return this.studentService
          .getCourses()

      }),
      
    ).
    subscribe((data) => {

      this.courses = data;

      if(this.first_login) this.onEdit();
    });
  }

  // Converts the drive link to image link
  convertImgURL(url: string) {
    const newUrl = url.split('/');
    return `https://drive.google.com/uc?export=view&id=${newUrl[5]}`;
  }

  filterCourseType(value: number) {
    return this.courseTypes.filter((d) => d.value === value)[0]?.key;
  }

  filterOptions(value: boolean) {
    return this.options.filter((d) => d.value === value)[0].key;
  }

  onEdit() {

    if(!this.student) return;

    let dialogRef = this.dialog.open(StudentModelComponent, {
      data: {
        student: this.student,
        courses: this.courses,
        options: this.options,
        courseTypes: this.courseTypes,
        first_login: this.first_login,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().pipe(

      mergeMap((result: FormData) => {

        if(result) {

          return this.studentService.updateStudent(result);
        } else return of(null);
      })

    ).
    subscribe((data) => {
      if (data) {
          if (data.response.status === 200) {
            this.first_login = false;
            this.event$.next(true);
            this.myData$.subscribe((data: any) => {
              console.log(data);
              this.student = data;
              this.studentService.currentStudent = data;
              this.student.photograph_link !== 'null'
                ? (this.photographLink = this.convertImgURL(
                    data.photograph_link
                  ))
                : (this.photographLink = `${IMG_URL}/user.jpg`);
              this.studentService
                .getCourses()
                .subscribe((data) => (this.courses = data));
            });
          }
      }
    });
  }
}

//
