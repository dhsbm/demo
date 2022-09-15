import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { Spinner } from '../../components/Spinner'
import { useGetPostQuery, useEditPostMutation } from '../api/apiSlice'

export const EditPostForm = ({ match }) => {
  const { postId } = match.params

  const { data: post } = useGetPostQuery(postId)
  const [updatePost, { isLoading }] = useEditPostMutation()

  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  const history = useHistory()

  const onTitleChange = (e) => setTitle(e.target.value)
  const onContentChange = (e) => setContent(e.target.value)

  const onSavePostClicked = async () => {
    if (title && content) {
      await updatePost({ id: postId, title, content })
      history.push(`/posts/${postId}`)
    }
  }

  let renderContent
  if (isLoading) {
    renderContent = <Spinner text="Loading..." />
  } else {
    renderContent = (
      <section>
        <h2>编辑帖子</h2>
        <form>
          <label htmlFor="postTitle">帖子标题：</label>
          <input
            type="text"
            id="postTitle"
            name="postTitle"
            placeholder="what's on your mind"
            value={title}
            onChange={onTitleChange}
          />
          <label htmlFor="postContent">内容：</label>
          <input
            type="text"
            id="postContent"
            name="postContent"
            placeholder="what's on your mind"
            value={content}
            onChange={onContentChange}
          />
        </form>
        <button type="button" onClick={onSavePostClicked}>
          保存帖子
        </button>
      </section>
    )
  }

  return <div>{renderContent}</div>
}
