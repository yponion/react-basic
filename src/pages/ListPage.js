import axios from "axios";
import {useState, useEffect} from "react";
import Card from "../components/Card";
import {Link} from "react-router-dom";
import {useHistory} from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const ListPage = () => {
    const history = useHistory();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getPosts = () => {
        axios.get('http://localhost:3001/posts').then((res) => {
            setPosts(res.data);
            setLoading(false);
        })
    };

    useEffect(() => {
        getPosts();
    }, []);

    const deleteBlog = (e, id) => {
        e.stopPropagation();
        axios.delete(`http://localhost:3001/posts/${id}`).then(() => {
            setPosts(prevPosts => prevPosts.filter(post => post.id !== id))
        });
    }

    const renderBlogList = () => {
        if (loading) {
            return (
                <LoadingSpinner/>
            )
        }

        if (posts.length === 0) {
            return (
                <div>No blog posts found</div>
            )
        }

        return (
            posts.map(post => {
                return (
                    <Card
                        key={post.id}
                        title={post.title}
                        onClick={() => history.push(`/blogs/${post.id}`)} // 이것도 stopPropagation 하고싶은데
                    >
                        <div>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={(e) => deleteBlog(e, post.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </Card>
                );
            })
        )
    }

    return (
        <div>
            <div className="d-flex justify-content-between">
                <h1>List Page</h1>
                <div>
                    <Link to="/blogs/create" className="btn btn-success">
                        Create New
                    </Link>
                </div>
            </div>
            {renderBlogList()}
        </div>
    );
};
export default ListPage;