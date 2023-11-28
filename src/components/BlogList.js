import axios from "axios";
import {useState, useEffect, useCallback} from "react";
import Card from "../components/Card";
import {useHistory, useLocation} from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import propTypes from "prop-types";
import Pagination from "./Pagination";
import useToast from "../hooks/toast";

const BlogList = ({isAdmin}) => {

    const history = useHistory();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const pageParam = params.get('page');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [searchText, setSearchText] = useState('');
    const {addToast} = useToast();
    const limit = 5;

    useEffect(() => {
        setNumberOfPages(Math.ceil(numberOfPosts / limit))
    }, [numberOfPosts]);

    const onClickPageButton = (page) => {
        history.push(`${location.pathname}?page=${page}`)
        setCurrentPage(page);
        getPosts(page);
    }

    const getPosts = useCallback((page = 1) => { //default 1
        let params = { // 객체 생성
            _page: page, // 페이지 번호
            _limit: limit, // 페이지에 보여줄 개수
            _sort: 'id', // 정렬할 기준
            _order: 'desc', // 정렬 방식 -> 나중에 추가한걸 앞에 표기하기 위해
            title_like: searchText, // _like 넣어주면 일부분 일치해도 검색됨
        }
        if (!isAdmin) { // 관리자 페이지가 아닐 경우
            params = {...params, publish: true} // Spread사용해서 위 객체를 포함한 새로운 객체를 만들어서 넣어줌
            // publish가 true 인것을 필터링 // 백엔드 개발자의 규칙에 맞춰서 설정
        }
        axios.get(`http://localhost:3001/posts`, {
            params
        }).then((res) => {
            setNumberOfPosts(res.headers['x-total-count']); // x-total-count -> post 개수
            setPosts(res.data);
            setLoading(false);
        })
    }, [isAdmin, searchText])

    useEffect(() => {
        setCurrentPage(parseInt(pageParam) || 1); // pagination 변경 useState 업데이트
        getPosts(parseInt(pageParam) || 1)
    }, []);

    const deleteBlog = (e, id) => {
        e.stopPropagation();
        axios.delete(`http://localhost:3001/posts/${id}`).then(() => {
            setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
            addToast({
                text: 'Successfully deleted',
                type: 'success'
            });
        });
    }

    if (loading) {
        return (
            <LoadingSpinner/>
        )
    }

    const renderBlogList = () => {
        return posts.map(post => {
            return (
                <Card
                    key={post.id}
                    title={post.title}
                    onClick={() => history.push(`/blogs/${post.id}`)} // 이것도 stopPropagation 하고싶은데
                >
                    {isAdmin ? <div>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => deleteBlog(e, post.id)}
                        >
                            Delete
                        </button>
                    </div> : null}
                </Card>
            );
        })
    }

    const onSearch = (e) => {
        if (e.key === 'Enter') {
            history.push(`${location.pathname}?page=1`)
            setCurrentPage(1);
            getPosts(1);
        }
    }

    return (
        <div>
            <input
                type='text'
                placeholder="Search"
                className="form-control"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyUp={onSearch}
            />
            <hr/>
            {posts.length === 0
                ? <div>No blog posts found</div>
                : <>
                    {renderBlogList()}
                    {numberOfPages > 1 && <Pagination // 페이지가 1보다 클 경우 표시
                        currentPage={currentPage}
                        numberOfPages={numberOfPages}
                        onClick={onClickPageButton} // 클릭 시 onClickPageButton -> getPosts실행
                    />}
                </>
            }
        </div>
    )
};

BlogList.propTypes = {
    isAdmin: propTypes.bool
}
BlogList.defaultProps = {
    isAdmin: false
}

export default BlogList;