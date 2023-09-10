import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/service/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {

  enteredContent = ''
  enteredTitle = ''
  myForm: FormGroup
  showForm: boolean = true;

  constructor(private fb: FormBuilder, private postsService: PostsService) {

  }

  ngOnInit() {
    this.myForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    })

  }

  onAddPost () {
    const newPost: Post = {
      id: null,
      title: this.myForm.controls['title'].value,
      content: this.myForm.controls['content'].value
    }
    this.postsService.addPost(newPost)
    this.showForm = false;
    setTimeout(() => {
      this.myForm.reset()
      this.showForm = true
    })
  }

}
