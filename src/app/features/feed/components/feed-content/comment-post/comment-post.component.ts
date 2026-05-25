import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from './comments.service';
import { Comment } from './comment.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-post',
  imports: [FormsModule],
  templateUrl: './comment-post.component.html',
  styleUrl: './comment-post.component.css',
})
export class CommentPostComponent  implements OnInit {
  private readonly commentsService = inject(CommentsService);
  @Input() postId: string = "";
  commentList:Comment[] = [];
  newComment: string = '';


  ngOnInit(): void {
    this.getCommentsPost();
  }

  getCommentsPost() {
    this.commentsService.getPostsComments(this.postId).subscribe({
      next: (res) => {
        console.log(res);
        this.commentList = res.data.comments;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  createComment() {
    if (!this.newComment?.trim()) return;

    this.commentsService.createComment(this.postId, this.newComment).subscribe({
      next: (res: any) => {

        this.commentList.unshift(res.data.comment);

        this.newComment = '';
      },
      error: (err) => {
        console.error(err);
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
