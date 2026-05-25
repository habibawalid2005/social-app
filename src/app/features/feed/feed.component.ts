import { Component } from '@angular/core';
import { FeedContentComponent } from './components/feed-content/feed-content.component';
import { RightSidebarComponent,  } from './components/side-right/side-right.component';
import { SideLeftComponent } from './components/side-left/side-left.component';

@Component({
  selector: 'app-feed',
  imports: [FeedContentComponent, RightSidebarComponent,SideLeftComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent {

}
