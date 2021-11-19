import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { API } from 'src/environments/environment';

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
  driveResponse: any[];
  dashData: any[];
  show: boolean;
  isLoading: boolean;

  constructor(private http: HttpClient,private changeDetection: ChangeDetectorRef) {
    this.isLoading = true;
    this.show = false;
    this.displayedColumns = ['reg_no', 'name', 'gender', 'email', 'phone', 'grade_x', 'grade_xii', 'history_of_arrears', 'backlogs', 'cgpa', 'resume'];
    // this.dataSource = ELEMENT_DATA;
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
    this.http
      .get(`${API}/company/studentapplied`).subscribe(
        (res: any) => {
          this.dashData = res.drive;
          console.log(this.dashData);
        }
      )
  }

  ngAfterViewInit(): void {
    // const form = new FormData();
    // form.append('email', 'company@company.com');
    // form.append('password', 'asd');
    // form.append('role', '2');
    // this.http.post(`${API}/user/authenticate`, form,{observe: 'response'}).subscribe(
    //   (data) => {
    //     console.log(data)
    //     localStorage.setItem('errorJWT', data.headers.get('Tokenstring'))
    //     console.log(data.headers.get('Tokenstring'));
    //   },
    //   (err) => console.log(err)
    // );

    this.http
      .get(`${API}/company/drive`)
      .pipe(map((res: any) => res.drives))
      .subscribe((val) =>{
        this.driveResponse = val;
        console.log(this.driveResponse);
        
        this.isLoading = false;
        this.changeDetection.markForCheck();
      });
  }

}
