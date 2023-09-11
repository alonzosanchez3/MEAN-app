import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/service/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {

  posts:Post[] = []
  postSubscription: Subscription;
  isLoading = false;

  handleDelete(post: Post) {
    this.postsService.deletePost(post)
  }

  constructor(private postsService:PostsService) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts()
    this.postSubscription = this.postsService.getPostUpdateListener().subscribe((value) => {
      this.isLoading = false
      this.posts = value;
    })
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe()
  }

}
