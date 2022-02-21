import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { map } from 'rxjs/operators';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-drive-update',
  templateUrl: './drive-update.component.html',
  styleUrls: ['./drive-update.component.scss']
})
export class DriveUpdateComponent implements OnInit {
  
  driveResponse: any[] = [];

  @Input() set drive(v: any) {

    this.driveResponse = v;
    this.patchForm();
  }

  driveID: any;
  updateLoading: boolean;
  updateSuccess: boolean;
  isTabView: boolean = false;
  isMobileView: boolean = false;

  displayedColumns: string[];
  dashData: any[];
  courses: any;
  historyOfArrears: Boolean;
  year = new Date().getFullYear();

  categories: any = [
    {
      id:1,
      name: "PRODUCT"
    },
    {
      id:2,
      name: "SERVICE"
    }
  ]
  employment_t: any = [
    {
      id:1,
      name: "FULL TIME"
    },
    {
      id:2,
      name: "INTERNSHIP"
    },
    {
      id:3,
      name: "INTERNSHIP + FULLTIME"
    }
  ]

  form = new FormGroup({
    drive_name: new FormControl(""),
    category: new FormControl(""),
    category_id: new FormControl(""),
    roles: new FormControl(""),
    employment_type: new FormControl(""),
    ctc_for_ug: new FormControl(""),
    ctc_for_pg: new FormControl(""),
    stipend_for_internship_for_ug: new FormControl(""),
    stipend_for_internship_for_pg: new FormControl(""),
    eligibility_10: new FormControl(""),
    eligibility_12: new FormControl(""),
    eligibility_graduation: new FormControl(""),
    eligibility_in_present: new FormControl(""),
    eligible_courses_id: new FormControl(""),
    year_batch_eligible: new FormControl(""),
    history_of_arrears: new FormControl(""),
    current_arrears: new FormControl(""),
    atmost_number_of_arrears: new FormControl(""),
    date_of_visiting: new FormControl(""),
    ppt_session: new FormControl(""),
    number_of_tests: new FormControl(""),
    date_time_of_test: new FormControl(""),
    duration_of_test: new FormControl(""),
    online_test: new FormControl(""),
    aptitude_test: new FormControl(""),
    coding_test: new FormControl(""),
    group_discussion: new FormControl(""),
    date_time_of_interview: new FormControl(""),
    number_of_interviews: new FormControl(""),
    technical_interview1: new FormControl(""),
    technical_interview2: new FormControl(""),
    technical_interview3: new FormControl(""),
    technical_plus_hr_interview: new FormControl(""),
    hr_interview: new FormControl(""),
    posted_date: new FormControl(""),
    registration_deadline: new FormControl(""),
    other_information: new FormControl("")
  })

  isLoading: boolean;

  constructor(private http: HttpClient,public breakpointObserver: BreakpointObserver,private changeDetection: ChangeDetectorRef, private companyService: CompanyService) {
    this.isLoading = true;
    this.updateLoading = false;
    this.updateSuccess = false;
  }

  getCourses() {
    return this.companyService.getCourses()
      .pipe(map((res: any) => res.courses));
  }

  showBacklogsDetails(e: MatRadioChange){
    if(e.value == 2)
      this.historyOfArrears = false;
    else
      this.historyOfArrears = true;
  }

  compare(c1: {name: string}, c2: {name: string}) {
    return c1 && c2 && c1.name === c2.name;
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

        this.changeDetection.markForCheck();
      }
    );

    this.getCourses().subscribe((res) => {
      this.courses = res;
    });

  }

  patchForm() {

    if(!this.driveResponse) return;

    this.form.get('drive_name').setValue(this.driveResponse['drive_name']);
    this.form.get('category').setValue(this.driveResponse['category']['id']);
    this.form.get('roles').setValue(this.driveResponse['roles']);
    this.form.get('employment_type').setValue(this.driveResponse['employment_type']['id']);
    this.form.get('ctc_for_ug').setValue(this.driveResponse['ctc_for_ug']);
    this.form.get('ctc_for_pg').setValue(this.driveResponse['ctc_for_pg']);
    this.form.get('stipend_for_internship_for_ug').setValue(this.driveResponse['stipend_for_internship_for_ug']);
    this.form.get('stipend_for_internship_for_pg').setValue(this.driveResponse['stipend_for_internship_for_pg']);
    this.form.get('eligibility_10').setValue(this.driveResponse['eligibility_10']);
    this.form.get('eligibility_12').setValue(this.driveResponse['eligibility_12']);
    this.form.get('eligibility_graduation').setValue((this.driveResponse['eligibility_graduation']/10).toString());
    this.form.get('eligibility_in_present').setValue((this.driveResponse['eligibility_in_present']/10).toString());
    this.form.get('eligible_courses_id').setValue(this.driveResponse['eligible_courses_id'][0].replace(/\s/g, "").split(','));
    this.form.get('year_batch_eligible').setValue(Number(this.driveResponse['year_batch_eligible'][0]));
    this.form.get('history_of_arrears').setValue(this.driveResponse['history_of_arrears'] === true ? '1' : '2');
    this.form.get('current_arrears').setValue(this.driveResponse['atmost_number_of_arrears']);
    this.form.get('date_of_visiting').setValue(this.driveResponse['date_of_visiting'].substring(0, (this.driveResponse['date_of_visiting'] as String).length-1).split('T')[0]);
    this.form.get('ppt_session').setValue(this.driveResponse['ppt_session'].substring(0, (this.driveResponse['ppt_session'] as String).length-1));
    this.form.get('number_of_tests').setValue(this.driveResponse['number_of_tests']);
    this.form.get('date_time_of_test').setValue(this.driveResponse['date_time_of_test'].substring(0, (this.driveResponse['date_time_of_test'] as String).length-1));
    this.form.get('duration_of_test').setValue(this.driveResponse['duration_of_test']);
    this.form.get('online_test').setValue(this.driveResponse['online_test']);
    this.form.get('aptitude_test').setValue(this.driveResponse['aptitude_test']);
    this.form.get('coding_test').setValue(this.driveResponse['coding_test']);
    this.form.get('group_discussion').setValue(this.driveResponse['group_discussion']);
    this.form.get('date_time_of_interview').setValue(this.driveResponse['date_time_of_interview'][0]);
    this.form.get('number_of_interviews').setValue(this.driveResponse['number_of_interviews']);
    this.form.get('technical_interview1').setValue(this.driveResponse['technical_interview1']);
    this.form.get('technical_interview2').setValue(this.driveResponse['technical_interview2']);
    this.form.get('technical_interview3').setValue(this.driveResponse['technical_interview3']);
    this.form.get('technical_plus_hr_interview').setValue(this.driveResponse['technical_plus_hr_interview']);
    this.form.get('hr_interview').setValue(this.driveResponse['hr_interview']);
    this.form.get('posted_date').setValue(this.driveResponse['posted_date'].split('T')[0]);
    this.form.get('registration_deadline').setValue(this.driveResponse['registration_deadline'].substring(0, (this.driveResponse['registration_deadline'] as String).length-1));
    this.form.get('other_information').setValue(this.driveResponse['other_information']);

    if(this.form.get('history_of_arrears').value == true)
      this.historyOfArrears = true;

  }

  OnSubmit(){
    this.updateLoading = true;
    const req = new FormData();
    this.driveID = this.driveResponse['id'];
    req.append('id', this.driveResponse['id'])
    req.append('drive_id', this.driveResponse['id'])
    req.append('drive_name', this.form.get('drive_name').value)
    req.append('category', this.form.get('category').value)
    req.append('roles', this.form.get('roles').value)
    req.append('employment_type', this.form.get('employment_type').value)
    req.append('ctc_for_ug', this.form.get('ctc_for_ug').value)
    req.append('ctc_for_pg', this.form.get('ctc_for_pg').value)
    req.append('stipend_for_internship_for_ug', this.form.get('stipend_for_internship_for_ug').value)
    req.append('stipend_for_internship_for_pg', this.form.get('stipend_for_internship_for_pg').value)
    req.append('eligibility_10', this.form.get('eligibility_10').value)
    req.append('eligibility_12', this.form.get('eligibility_12').value)
    req.append('eligibility_graduation', (parseFloat(this.form.get('eligibility_graduation').value + 0)*10).toString())
    req.append('eligibility_in_present', (parseFloat(this.form.get('eligibility_in_present').value + 0)*10).toString())
    req.append('eligible_courses_id', this.form.get('eligible_courses_id').value)
    req.append('year_batch_eligible', this.form.get('year_batch_eligible').value)
    req.append('history_of_arrears', this.form.get('history_of_arrears').value)
    req.append('current_arrears', this.form.get('current_arrears').value > 0 ? 'true':'false')
    req.append('atmost_number_of_arrears', this.form.get('current_arrears').value)
    req.append('date_of_visiting', this.form.get('date_of_visiting').value)
    req.append('ppt_session',this.form.get('ppt_session').value)
    req.append('number_of_tests', '2')
    req.append('date_time_of_test',this.form.get('date_time_of_test').value)
    req.append('duration_of_test',this.form.get('duration_of_test').value)
    req.append('online_test', 'false')
    req.append('aptitude_test',this.form.get('aptitude_test').value ? 'true' : 'false')
    req.append('coding_test',this.form.get('coding_test').value ? 'true' : 'false')
    req.append('group_discussion',this.form.get('group_discussion').value ? 'true' : 'false')
    req.append('date_time_of_interview',this.form.get('date_time_of_interview').value)
    req.append('number_of_interviews', '1')
    req.append('technical_interview1',this.form.get('technical_interview1').value ? 'true' : 'false')
    req.append('technical_interview2',this.form.get('technical_interview2').value ? 'true' : 'false')
    req.append('technical_interview3',this.form.get('technical_interview3').value ? 'true' : 'false')
    req.append('technical_plus_hr_interview',this.form.get('technical_plus_hr_interview').value ? 'true' : 'false')
    req.append('hr_interview',this.form.get('hr_interview').value ? 'true' : 'false')
    req.append('registration_deadline',this.form.get('registration_deadline').value.split('T')[0])
    req.append('other_information',this.form.get('other_information').value)

    this.companyService.updateDrive(this.driveID, req).subscribe(
      (data: any) => {
        if (data.response.status === 200 && this.driveID != null){
          console.log(data);
          this.updateLoading = false;
          this.updateSuccess = true;
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      },
      (err) => console.log(err));
  }

}