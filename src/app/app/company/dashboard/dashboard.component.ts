import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { API } from 'src/environments/environment';
import { CompanyService } from '../company.service';

export interface DashboardData {
  reg_number: number;
  name: string;
  gender: string;
  email: string;
  phone: number;
  grade_10_percentage: number;
  grade_12_percentage: number;
  history_of_arrears: string;
  number_of_arrears: number;
  ug_course_percentage: number;
  resume_link: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class CompanyDashboardComponent implements OnInit, AfterViewInit {

  displayedColumns: string[];
  dataSource: DashboardData[];
  drives: any[];
  dashData: any[];
  show: boolean;
  isLoading: boolean;
  isTabView: boolean = false;
  isMobileView: boolean = false;

  constructor(private router: Router,private route: ActivatedRoute ,public breakpointObserver: BreakpointObserver,private changeDetection: ChangeDetectorRef, private companyService: CompanyService) {
    this.isLoading = true;
    this.show = false;
    this.displayedColumns = ['reg_no', 'name', 'gender', 'email', 'phone', 'grade_x', 'grade_xii', 'history_of_arrears', 'backlogs', 'cgpa', 'resume'];
    // this.dataSource = ELEMENT_DATA;
  }

  redirect(company) {

    console.log(company.id);
    this.router.navigate(['drive'], { relativeTo: this.route, queryParams: { id: company.id} });
  }

  getStudentDetails(driveID: number, $element: any) {
    this.show = true;
    this.dataSource = this.dashData.filter(x => x.drive_id == driveID)[0].student_list;
    console.log(this.dataSource);
    console.log($element);
    setTimeout(() => {
      $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }, 500);
  }

  openNewTab(url: string){
    window.open(url, "_blank");
  }

  ngOnInit(): void {

    //Breakpoint Observer for Screen Size
    this.breakpointObserver.observe(['(min-width: 1000px)','(min-width: 620px)']).subscribe(
      (state: BreakpointState) => {
        if(state.breakpoints['(min-width: 1000px)']){
          console.log('Desktop View');
          this.isTabView = false;
          this.isMobileView = false;
        }
        else if(state.breakpoints['(min-width: 620px)']){
          console.log('Tab View');
          this.isTabView = true;
          this.isMobileView = false;
        }
        else{
          this.isMobileView = true;
          this.isTabView = false;
          console.log('Mobile View');
        }
      }
    );

    this.companyService.getAppliedStudents().subscribe(
      (res: any) => {
        this.dashData = res.drive;
        console.log(this.dashData);
      }
    )
  }

  ngAfterViewInit(): void {
    
    this.companyService.getCompanyDrives()
      .pipe(map((res: any) => res.drives))
      .subscribe((val) =>{
        this.drives = val;
        console.log(this.drives);
        
        this.isLoading = false;
        this.changeDetection.markForCheck();
      });
  }

}
