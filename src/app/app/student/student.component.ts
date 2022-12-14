import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavInput } from '../shared/components/nav/nav.component';
import { AuthService } from '../shared/auth/auth.service';
import { StudentModel } from '../shared/models/student/student.model';
import { VisualFeedbackService } from '../shared/visual-feedback/visual-feedback.service';
import { StudentService } from './student.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit, OnDestroy {

  navInput: NavInput = {

    title: 'CUIC | STUDENT',
    primaryInfo: '',
    secondaryInfo: 0,
    isPlacementRep: false,

    routes: [
      {
        path: './home',
        icon: 'fa-home',
        name: 'Home',

        show: true,
      },

      {
        path: './personal-details',
        icon: 'fa-user-edit',
        name: 'Personal Details',

        show: true,
      },

      {
        path: './upcoming-companies',
        icon: 'fa-building',
        name: 'Upcoming Companies',

        show: true,
      },

      {
        path: './placement-representative',
        icon: 'fa-building',
        name: 'Placement Representative',

        //Changed Later based on user
        show: false
      }, 
    ]
  }

  first_login = new BehaviorSubject<boolean>(false);

  subs = new Subscription();

  constructor(
    private studentService: StudentService,
    private authSerivce: AuthService,
    private router: Router,
    private visualFeedbackService: VisualFeedbackService,
  ) { }

  ngOnInit(): void {

    this.studentService.studentToken = jwtDecode(this.authSerivce.getToken());
    
    this.studentService.getStudent().pipe(

      map((res: any) => {

        this.first_login.next(res?.first_login);

        return res?.profile
      }),

    ).subscribe((student: StudentModel) => {
      
      this.studentService.currentStudent = student;
    });

    const s1 = this.studentService.currentStudentChange$.subscribe(data => {

      this.navInput.primaryInfo = data?.first_name + ' ' + data?.last_name;
      this.navInput.secondaryInfo = data?.reg_number;
      this.navInput.routes[this.navInput.routes.length - 1].show = data?.is_placement_representative;
    });

    const s2 = this.first_login.subscribe((data) => {

      console.log(data);  
      if(data) {

        this.router.navigateByUrl('student/personal-details');
        this.visualFeedbackService.snackBar("Complete your profile to proceed!", 5000);
      }
    });

    this.subs.add(s1).add(s2);
  }

  ngOnDestroy(): void {
      
    this.subs.unsubscribe();
    this.studentService.currentStudent = null;
  }

}
