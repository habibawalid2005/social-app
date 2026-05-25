import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../../../core/services/posts.service';
import { Post } from '../../../../core/models/post.interface';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentPostComponent } from "./comment-post/comment-post.component";
import { RouterLink } from "@angular/router";
import { LoadingSkeletonComponent } from "../../../../shared/loading-skeleton/loading-skeleton.component";
import { CommonModule } from '@angular/common'; 
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-feed-content',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    CommentPostComponent,
    RouterLink,
    LoadingSkeletonComponent
  ],
  templateUrl: './feed-content.component.html',
  styleUrl: './feed-content.component.css',
})
export class FeedContentComponent implements OnInit {

  private readonly postsService = inject(PostsService);

  content: FormControl = new FormControl('');
  privacy: FormControl = new FormControl('public');

  isLoading: boolean = true;
  postList: any[] = [];

  userId: string = '';

  ngOnInit(): void {
    this.getAllPostsData();
    this.userId = JSON.parse(localStorage.getItem('socialUser')!)?._id;
  }

  getAllPostsData(): void {
    this.isLoading = true;

    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        console.log("POSTS:", res);

        this.postList = res.data.posts.map((post: any) => ({
          ...post,
          isLiked: post.likes?.includes(this.userId) ?? false, // 👈 الحل الصح
          likesCount: post.likesCount ?? post.likes?.length ?? 0,
          sharesCount: post.sharesCount ?? 0
        }));

        this.isLoading = false;
      },
      error: (err) => {
        console.log("ERROR:", err);
        this.isLoading = false;
      }
    });
  }
  // ---------------- CREATE POST ----------------

  selectedImage: File | null = null;
  previewImage: string | null = null;

  autoResize(event: any): void {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  uploadImage(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedImage = null;
  }

  submitForm(event: Event): void {
    event.preventDefault();

    const formData = new FormData();

    if (this.content.value) {
      formData.append('body', this.content.value);
    }

    if (this.privacy.value) {
      formData.append('privacy', this.privacy.value);
    }

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.postsService.createPosts(formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.content.reset();
          this.privacy.reset('public');
          this.selectedImage = null;
          this.getAllPostsData();
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // ---------------- DELETE ----------------

  deletePostItem(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        if (res.success) {
          this.getAllPostsData();
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // ---------------- TIME ----------------

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

  // ---------------- LIKE ----------------

  toggleLike(post: any) {
    // optimistic update 
    post.isLiked = !post.isLiked;
    post.likesCount += post.isLiked ? 1 : -1;

    this.postsService.likeOnPost(post._id).subscribe({
      error: () => {
        
        post.isLiked = !post.isLiked;
        post.likesCount += post.isLiked ? 1 : -1;
      },
    });
    
  }




  // ---------------- SHARE ----------------
  sharePost(post: any) {
    const link = `${window.location.origin}/details/${post._id}`;

    Swal.fire({
      title: 'Share Post',
      text: 'Copy link or share with friends',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Copy Link',
      denyButtonText: 'WhatsApp',
      cancelButtonText: 'Cancel',
      background: '#202225',
      color: '#fff',
      confirmButtonColor: '#F62E8E', 
      denyButtonColor: '#3A3B3C',
    }).then((result) => {
      if (result.isConfirmed) {
        navigator.clipboard.writeText(link);

        post.sharesCount++;

        Swal.fire({
          title: 'Copied!',
          text: 'Link copied successfully 🔥',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#202225',
          color: '#fff',
        });

      } else if (result.isDenied) {
        window.open(`https://wa.me/?text=${link}`);

        post.sharesCount++;
      }
    });
  }
}