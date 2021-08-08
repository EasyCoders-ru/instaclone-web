import PropTypes from "prop-types";
import styled from "styled-components";
import Comment from "./Comment";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";

const CommentsContainer = styled.div`
  margin-top: 20px;
`;

const CommentsNumber = styled.span`
  opacity: 0.7;
  margin: 10px 0;
  display: block;
  font-size: 12px;
  font-weight: 600;
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      error
    }
  }
`;

function Comments({ photoId, author, caption, commentsNumber, comments }) {
  const { register, handleSubmit, setValue } = useForm();
  const [createComment, { loading }] = useMutation(CREATE_COMMENT_MUTATION);
  const onValid = (data) => {
    const { payload } = data;
    if (loading) return;
    createComment({
      variables: {
        photoId,
        payload,
      },
    });
    setValue("payload", "");
  };
  return (
    <CommentsContainer>
      <Comment author={author} payload={caption} />
      <CommentsNumber>
        {commentsNumber === 1
          ? "1 комментарий"
          : `${commentsNumber} комментариев`}
      </CommentsNumber>
      {comments?.map((comment) => (
        <Comment
          key={comment.id}
          author={comment.user.username}
          payload={comment.payload}
        />
      ))}
      <div>
        <form onSubmit={handleSubmit(onValid)}>
          <input
            {...register("payload", { required: true })}
            type="text"
            placeholder="Добавьте комментарий..."
          />
        </form>
      </div>
    </CommentsContainer>
  );
}

Comments.propTypes = {
  photoId: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  caption: PropTypes.string,
  commentsNumber: PropTypes.number.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      caption: PropTypes.string,
      user: PropTypes.shape({
        username: PropTypes.string,
      }),
      createdAt: PropTypes.string,
      isMine: PropTypes.bool,
    })
  ),
};

export default Comments;