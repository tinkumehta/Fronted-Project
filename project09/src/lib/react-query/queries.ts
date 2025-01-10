import {useQuery, useMutation, useQueryClient, useInfiniteQuery} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import {  createUserAccount,
    signInAccount,
    getCurrentUser,
    signOutAccount,
    getUsers,
    createPost,
    getPostById,
    updatePost,
    getUserPosts,
    deletePost,
    likePost,
    getUserById,
    updateUser,
    getRecentPosts,
    getInfinitePosts,
    searchPosts,
    savePost,
    deleteSavedPost,} from "@/lib/appwrite/api"
import {INewPost, INewUser, IUpdatePost, IUpdateUser} from "@/types"


// AUTH QUERIES

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user : INewUser) => createUserAccount(user),
    });
};

export const useSignInAccount = () => {
    return useMutation({
        mutationFn : (user : {email : string; password : string}) => 
            signInAccount(user),
    });
};

export const useSignOutAccount = () => {
    return useMutation ({
        mutationFn : signOutAccount,
    });
};

// ======= POST QUERIES

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey : [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn : getInfinitePosts as any,
        getNextPageParam : (lastPage : any) => {
            // if ther's no data , there are no more pages.
            if (lastPage && lastPage.documents.length === 0) {
                return null;
            }
            // Use the id of the last document as the cursor.
            const lastId = lastPage.documents[lastPage.documents.length -1].$id;
            return lastId;
        },
    });
};

export const useSearchPosts = (searchTerm : string) => {
    return useQuery ({
        queryKey : [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn : () => useSearchPosts(searchTerm),
        enabled : !!searchTerm,
    });
};

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey : [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn : useGetRecentPosts,
    });
};

export const useCreatePost = () => {
    const QueryClient = useQueryClient();
    return useMutation ({
        mutationFn : (post : INewPost) => createPost(post),
        onSuccess : () => {
            QueryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_RECENT_POSTS],
            });
        },
    });
};

export const useGetPostsById = (postId?: string) => {
    return useQuery ({
        queryKey : [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn : () => getPostById(postId),
        enabled: !!postId,
    });
};

export const useGetUserPosts = (userId? : string) => {
    return useQuery ({
        queryKey : [QUERY_KEYS.GET_USER_POSTS, userId],
        queryFn : () => useGetUserPosts(userId),
        enabled : !!userId,
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation ({
        mutationFn: (post : IUpdatePost) => updatePost(post),
        onSuccess : (data) => {
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
            });
        },
    });
}

export const useDeletePost = () => {
    const queryClient = useQueryClient() ;
    return useMutation({
        mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
          deletePost(postId, imageId),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
          });
        },
      });
    };

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation ({
        mutationFn : ({
            postId,
            likesArray,
        } : {
            postId : string;
            likesArray : string[];
        }) => likePost(postId, likesArray),
        onSuccess : (data) => {
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
            });
         queryClient.invalidateQueries({
            queryKey : [QUERY_KEYS.GET_RECENT_POSTS],
         });
         queryClient.invalidateQueries({
            queryKey : [QUERY_KEYS.GET_CURRENT_USER],
         });
        },
    });
};

export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn : ({userId, postId} : {userId : string; PostValidation: }) => 
            useSavePost(userId, postId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
};

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();
    return useMutation ({
        mutationFn: (savedRecordId : string) => deleteSavedPost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
};

// ======== user queries

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey : [QUERY_KEYS.GET_CURRENT_USER],
        queryFn : getCurrentUser,
    });
};

export const useGetUsers = (limit?: number) => {
    return useQuery({
        queryKey : [QUERY_KEYS.GET_USERS],
        queryFn : () => getUsers(limit),
    });
};

export const useGetUserById = (userId : string) => {
    return useQuery ({
        queryKey : [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn : () => getUserById(userId),
        enabled: !!userId,
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn : (user : IUpdateUser) => updateUser(user),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_CURRENT_USER],
            });
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_CURRENT_USER, data?.$id],
            })
        }
    })
}