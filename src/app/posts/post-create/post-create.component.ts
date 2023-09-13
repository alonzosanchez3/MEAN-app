import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/service/posts.service';
import { mimeType } from './mime-type.validator';

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
  private mode: 'create' | 'edit' = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  imagePreview: string;

  constructor(private fb: FormBuilder, private postsService: PostsService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.myForm = this.fb.group({
      title: [this.post ? this.post.title : '', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      image: [null, [Validators.required], mimeType]
    })


    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit'
        this.postId = paramMap.get('postId')
        this.isLoading = true
        this.postsService.getPost(this.postId).subscribe((response) => {
          this.isLoading = false
          this.post = {...response.post, id: response.post.id}
          console.log(this.post)
          this.myForm.patchValue({
            title: this.post ? this.post.title : '',
            content: this.post ? this.post.content : ''
          })
        })

      } else {
        this.mode = 'create'
        this.postId = null;
      }
    });

  }

  onAddPost () {
    this.post = {
      id: this.post?.id || null,
      title: this.myForm.controls['title'].value,
      content: this.myForm.controls['content'].value
    }
    this.isLoading = true
    if(this.mode === 'create') {
      this.postsService.addPost(this.post, this.myForm.value.image)
      this.showForm = false;
      setTimeout(() => {
        this.myForm.reset()
        this.showForm = true
      })
    } else {
      this.postsService.updatePost(this.post)
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]
    this.myForm.patchValue({image: file})
    this.myForm.get('image').updateValueAndValidity()
    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file)
  }



}
