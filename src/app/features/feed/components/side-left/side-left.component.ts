import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";

@Component({
  selector: 'app-side-left',
  imports: [RouterLink],
  templateUrl: './side-left.component.html',
  styleUrl: './side-left.component.css',
})
export class SideLeftComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  activeBtn: string = 'feed';

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(
      query => {
        this.activeBtn = query.get('tab') || 'feed';
      }
    )
  }
}
