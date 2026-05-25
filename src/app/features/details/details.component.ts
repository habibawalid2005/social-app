import { Post } from './../../core/models/post.interface';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../core/services/posts.service';
import { CommentPostComponent } from "../feed/components/feed-content/comment-post/comment-post.component";
import { LoadingSkeletonComponent } from '../../shared/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-details',
  imports: [CommentPostComponent, LoadingSkeletonComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  // id,url
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  PostId: string = "";
  postDetails: Post = {} as Post;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      console.log(param.get('id'));
      this.PostId = param.get('id')!;
      this.getPostDetails();
    });
  }

  getPostDetails(): void {
    this.isLoading = true;

    this.postsService.getSinglePost(this.PostId).subscribe({
      next: (res) => {
        this.postDetails = res.data.post;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }
  
  getTimeAgo(date: any): string {
    const now = new Date().getTime();
    const postTime = new Date(date).getTime();

    const diff = Math.floor((now - postTime) / 1000);

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor(diff / 60);

    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `now`;
  }
}
