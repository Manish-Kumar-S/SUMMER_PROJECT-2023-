import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StudentService } from '../student.service';
import { Location } from '@angular/common';
import { filter, map } from 'rxjs/operators';
;


@Injectable({
  providedIn: 'root'
})
export class PlacementRepresentativeGuard implements CanActivate {

  constructor(private studentService: StudentService, private location: Location) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.studentService.currentStudent === null ? this.studentService.getStudent().pipe(
      filter(student => student !== null),

      map(student => {

        if(student.is_placement_representative) return true;

        this.location.back();

        return false;
      })
    ) : this.studentService.currentStudent.is_placement_representative;
  }
}
