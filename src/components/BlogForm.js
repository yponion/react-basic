import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import propTypes from "prop-types";
import useToast from "../hooks/toast";
import LoadingSpinner from "./LoadingSpinner";

const BlogForm = ({editing}) => {
    const navigate = useNavigate();
    const {id} = useParams();

    // 제목
    const [title, setTitle] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');// 수정을 확인하기 위한 오리지널 선언

    // 내용
    const [body, setBody] = useState('');
    const [originalBody, setOriginalBody] = useState('');

    // 공개/비공개
    const [publish, setPublish] = useState(false);
    const [originalPublish, setOriginalPublish] = useState(false);

    // title, body 미입력시 error메시지 표시하기위한 bool
    const [titleError, setTitleError] = useState(false);
    const [bodyError, setBodyError] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const {addToast} = useToast();

    useEffect(() => {
        if (editing) {
            axios.get(`http://localhost:3001/posts/${id}`).then((res) => {
                setTitle(res.data.title);
                setOriginalTitle(res.data.title);
                setBody(res.data.body);
                setOriginalBody(res.data.body);
                setPublish(res.data.publish);
                setOriginalPublish(res.data.publish);
                setLoading(false);
            }).catch(e=>{
                setError('something went wrong in db');
                addToast({
                    text:'something went wrong in db',
                    type: 'danger'
                })
                setLoading(false);
            })
        }else {
            setLoading(false);
        }
    }, [id, editing]);

    const isEditing = () => { // 수정 확인 함수
        return title !== originalTitle
            || body !== originalBody
            || publish !== originalPublish;
    }

    const goBack = () => {
        if (editing) { // 수정 이였을 땐 블로그 상세 페이지로
            navigate(`/blogs/${id}`);
        } else { // 이외엔 블로그 리스트 페이지로
            navigate('/blogs');
        }
    }

    const validateForm = () => {
        setTitleError(false);
        setBodyError(false);
        let validated = true;
        if (title === '') {
            setTitleError(true);
            validated = false;
        }
        if (body === '') {
            setBodyError(true);
            validated = false;
        }
        return validated;
    }

    const onSubmit = () => {
        if (validateForm()) {
            if (editing) { // update
                axios.patch(`http://localhost:3001/posts/${id}`, {
                    title,
                    body,
                    publish
                }).then(res => {
                    // setOriginalTitle(res.data.title); // 오리지널도 변경해줘야 버튼 다시 비활성화 됨
                    // setOriginalBody(res.data.body);
                    // setOriginalPublish(res.data.publish);
                    navigate(`/blogs/${id}`) // 블로그 상세 페이지로 돌아갈 것이기 때문에 위 주석 3줄은 필요없음
                }).catch(e=>{
                    addToast({
                        text:'We could not update blog',
                        type:'danger'
                    })
                })
            } else { // create
                axios.post('http://localhost:3001/posts', {
                    title,
                    body,
                    publish,
                    createdAt: Date.now()
                }).then(() => {
                    addToast({
                        type: 'success',
                        text: 'Successfully creaded!'
                    })
                    navigate('/admin');
                }).catch(e=>{
                    addToast({
                        text:'We could not create blog',
                        type:'danger'
                    })
                })
            }
        }
    };

    const onChangePublish = (e) => {
        setPublish(e.target.checked)
    };

    if (loading){
        return <LoadingSpinner/>
    }

    if (error){
        return <div>{error}</div>
    }
    return (
        <div>
            <h1>{editing ? 'Edit' : 'Create a blog post'}</h1> {/*수정이라면 Edit, 아니면 Create로 텍스트 지정*/}
            <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                    className={`form-control ${titleError && 'border-danger'}`}
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                    }}
                />
                {titleError && <div className="text-danger">
                    Title is required.
                </div>}
            </div>
            <div className="mb-3">
                <label className="form-label">Body</label>
                <textarea
                    className={`form-control ${bodyError && 'border-danger'}`}
                    value={body}
                    onChange={(event) => {
                        setBody(event.target.value);
                    }}
                    rows="10"
                />
                {bodyError && <div className="text-danger">
                    Body is required.
                </div>}
            </div>
            <div className="form-check mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={publish}
                    onChange={onChangePublish}
                />
                <label className="form-check-label">
                    Publish
                </label>

            </div>
            <button
                className="btn btn-primary"
                onClick={onSubmit}
                disabled={editing && !isEditing()} // 수정이고, 수정되지 않았다면 비활성화
            >
                {editing ? 'Edit' : 'Post'} {/*수정이라면 Edit, 아니면 Post 로 버튼 텍스트 지정*/}
            </button>
            <button
                className="btn btn-danger ms-2"
                onClick={goBack}
            >
                Cancel
            </button>
        </div>
    )
};

BlogForm.propType = {
    editing: propTypes.bool // 수정인지 확인하기 위해 선언한 editing 타입을 bool으로
}
BlogForm.defaultProps = {
    editing: false // 수정확인 기본값은 false로
}

export default BlogForm;