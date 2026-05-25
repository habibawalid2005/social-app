import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  templateUrl: './loading-skeleton.component.html',
  standalone: true
})
export class LoadingSkeletonComponent {
  @Input() loadingType: string = '';
}