import { auth, db, onAuthStateChanged, signOut, getDoc, doc, collection, addDoc, getDocs, deleteDoc, updateDoc, serverTimestamp, orderBy, query } from "../firebaseConfig.js"

const blogContainer = document.querySelector('.blogContainer');
console.log(blogContainer);

createPost()

async function createPost() {
    blogContainer.innerHTML = ``;
    const postsCollectionRef = collection(db, "blogs");

    // Create a query to order the documents by "time" field in descending order
    const sortedQuery = query(postsCollectionRef, orderBy("timestamp", "asc")); // "desc"
    const querySnapshot = await getDocs(sortedQuery);
    querySnapshot.forEach(async (doc) => {
        let postId = doc.id
        // doc.data() is never undefined for query doc snapshots
        const { BlogContent, BlogTitle, author, timestamp } = doc.data()

        const gettingUserData = await getAuthData(author)

        let div = document.createElement('div')
        div.setAttribute('class', 'postConatiner postInputContainer my-3')
        div.setAttribute('onclick', `seeUserBlogHandler('${postId}', '${author}')`)
        div.innerHTML = `<div class="d-flex justify-content-between ">
                    <div class="authorsDetails d-flex align-items-center">
                        <div class="post-header-container d-flex align-items-center">
                            <div class="image">
                                <img src=${gettingUserData?.profilePicture || "../assets/dummy.jpeg"}
                                    alt="" class="img-fluid rounded mx-auto d-block">
                            </div>
                            <div class="userName-id ms-2">
                                <h4 class="mb-1 blogTitle" style="color: #868686;">
                                    ${BlogTitle}</h4>
                                <div class="d-flex align-items-center justify-content-center">
                                    <h6 class="mb-1 username">${gettingUserData.firstName} ${gettingUserData.lastName}</h6>
                                    <h6 class="mb-0 ms-2">${moment(timestamp.toDate()).fromNow()}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="blogDetails">
                    <p id="post-text" class="mt-2">${BlogContent}</p>
                </div>`
        blogContainer.prepend(div)
    });
}

function seeUserBlogHandler(postId, authUid){
    console.log(postId, authUid)
    const postAndUser = {
        userPostId: postId,
        userAuthUid: authUid
    }
    localStorage.setItem('userBlog', JSON.stringify(postAndUser))
    window.location.href = '../seeUser/seeUser.html'
}

async function getAuthData(id) {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data()
    } else {
        console.log("No such document!");
    }
}

window.seeUserBlogHandler = seeUserBlogHandler;