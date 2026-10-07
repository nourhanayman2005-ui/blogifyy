let pageNumber = 1;
let limit = 10;

let posts = document.getElementById("posts");
let loading = document.getElementById("loading");
let error = document.getElementById("error");


// get data
async function getData(url, params = {}) {

    try {

        let response = await axios.get(url, {
            params: params
        });

        return response.data;

    } catch (e) {

        return null;
    }
}


// bookmarks
function getBookmarks() {

    let data = localStorage.getItem("bookmarks");

    if (data) {
        return JSON.parse(data);
    }

    return [];
}


// show posts
function showPosts(data) {

    posts.textContent = "";

    let saved = getBookmarks();

    data.forEach(function(post) {

        let card = document.createElement("div");
        card.className = "card";


        let title = document.createElement("h2");
        title.textContent = post.title;


        let body = document.createElement("p");

        body.textContent =
            post.body.substring(0, 100) + "...";


        let tags = document.createElement("div");

        post.tags.forEach(function(tagName) {

            let tag = document.createElement("span");

            tag.className = "tag";

            tag.textContent = tagName;

            tags.appendChild(tag);
        });


        let likes = document.createElement("p");

        likes.textContent =
            "Likes: " + post.reactions.likes;


        // reading time bonus

        let words =
            post.body.split(" ").length;

        let time =
            Math.ceil(words / 200);


        let readTime =
            document.createElement("p");

        readTime.textContent =
            time + " min read";


        // read button

        let read = document.createElement("button");

        read.textContent = "Read Post";

        read.onclick = function() {

            location.href =
                "post.html?id=" + post.id;
        };


        // bookmark button

        let bookmark =
            document.createElement("button");


        let isSaved = saved.some(function(x) {

            return x.id == post.id;

        });


        if (isSaved) {

            bookmark.textContent = "Saved";

        } else {

            bookmark.textContent = "Bookmark";
        }


        bookmark.onclick = function() {

            let bookmarks = getBookmarks();

            let found = bookmarks.findIndex(
                function(x) {
                    return x.id == post.id;
                }
            );


            if (found == -1) {

                bookmarks.push(post);

                bookmark.textContent = "Saved";

                localStorage.setItem(
                    "bookmarks",
                    JSON.stringify(bookmarks)
                );


                // toast bonus

                let toast =
                    document.getElementById("toast");

                toast.style.display = "block";


                setTimeout(function() {

                    toast.style.display = "none";

                }, 2000);


            } else {

                bookmarks.splice(found, 1);

                bookmark.textContent =
                    "Bookmark";

                localStorage.setItem(
                    "bookmarks",
                    JSON.stringify(bookmarks)
                );
            }
        };


        card.appendChild(title);
        card.appendChild(body);
        card.appendChild(tags);
        card.appendChild(likes);
        card.appendChild(readTime);
        card.appendChild(read);
        card.appendChild(bookmark);

        posts.appendChild(card);
    });
}


// load posts

async function loadPosts() {

    loading.style.display = "block";

    error.textContent = "";

    posts.textContent = "";


    let skip = (pageNumber - 1) * limit;


    let data = await getData(
        "https://dummyjson.com/posts",
        {
            limit: limit,
            skip: skip
        }
    );


    loading.style.display = "none";


    if (!data) {

        error.textContent =
            "Something went wrong. Please try again.";

        return;
    }


    showPosts(data.posts);

    document.getElementById("page").textContent =
        "Page " + pageNumber;
}


// pagination

document.getElementById("next").onclick =
    function() {

        pageNumber++;

        loadPosts();
    };


document.getElementById("previous").onclick =
    function() {

        if (pageNumber > 1) {

            pageNumber--;

            loadPosts();
        }
    };


// search bonus

let timer;

document.getElementById("search").oninput =
    function() {

        clearTimeout(timer);

        let word = this.value;


        timer = setTimeout(async function() {

            if (word == "") {

                loadPosts();

                return;
            }


            loading.style.display = "block";

            posts.textContent = "";


            let data = await getData(
                "https://dummyjson.com/posts/search",
                {
                    q: word
                }
            );


            loading.style.display = "none";


            if (data) {

                showPosts(data.posts);

            }

        }, 500);
    };


// dark mode bonus

let darkButton =
    document.getElementById("darkButton");


if (localStorage.getItem("dark") == "yes") {

    document.body.classList.add("dark");

    darkButton.textContent = "Light Mode";
}


darkButton.onclick = function() {

    document.body.classList.toggle("dark");


    if (
        document.body.classList.contains("dark")
    ) {

        localStorage.setItem("dark", "yes");

        darkButton.textContent = "Light Mode";

    } else {

        localStorage.setItem("dark", "no");

        darkButton.textContent = "Dark Mode";
    }
};


// welcome cookie bonus

function getCookie(name) {

    let all = document.cookie.split(";");

    for (let x of all) {

        x = x.trim();

        if (x.startsWith(name + "=")) {

            return x.substring(
                name.length + 1
            );
        }
    }

    return null;
}


function makeCookie(name, value) {

    let date = new Date();

    date.setTime(
        date.getTime() +
        7 * 24 * 60 * 60 * 1000
    );

    document.cookie =
        name +
        "=" +
        value +
        ";expires=" +
        date.toUTCString() +
        ";path=/";
}


let name = getCookie("name");


if (!name) {

    name = prompt("What is your name?");

    if (name) {

        makeCookie("name", name);
    }
}


if (name) {

    document.getElementById("welcome").textContent =
        "Welcome back, " + name + "!";

} else {

    document.getElementById("welcome").textContent =
        "Welcome to Blogify!";
}


loadPosts();