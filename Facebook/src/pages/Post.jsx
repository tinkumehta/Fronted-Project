import {Container, Button, } from "../components"
import appwriteService from "../appwrite/config"
import React, { useEffect, useState } from 'react'
import {Link, useNavigate, useParams} from "react-router-dom"
import {useSelector} from "react-redux"
import parse from "html-react-parser"

function Post() {
    const [post, setPosts] = useState(null);
    const navigate = useNavigate()
    const {slug} = useParams()

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPosts().then((posts) => {
                if (posts) setPosts(posts)
                    navigate("/")
            })
        } else
        navigate('/')
    }, [slug, navigate])

    const deletePost = () => {
        appwriteService.deleteFile(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate('/')
            }
        });
    }


  return post ? (
    <div className="py-8">
        <Container>
            <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                <img 
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="rounded-xl"
            />
        {isAuthor && (
            <div className="absolute right-6 top-6">
            <Link to={`/edit-post/${post.$id}`}>
            <Button bgColor="bg-green-500" className="mr-3">
                Edit
            </Button>
            </Link>
            <Button bgColor="bg-red-500" className="mr-3" onClick={deletePost}>
                Delete
            </Button>
            </div>
        )}
            </div>
        <div className="w-full mb-6">
            <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>
        <div className="browser-css">
            {parse(post.content)}
        </div>
        </Container>
    </div>
  ) : null;
}

export default Post