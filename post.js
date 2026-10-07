let id =
    new URLSearchParams(location.search)
    .get("id");


if (!id) {

    location.assign("index.html");
}


let postDiv =
    document.getElementById("post");

let loading =
    document.getElementById("loading");

let error =
    document.getElementById("error");


async function getData(url) {

    try {

        let response =
            await axios.get(url);

        return response.data;

    } catch (e) {

        return null;
    }
}


async function loadPost() {

    let post =
        await getData(
            "https://dummyjson.com/posts/" + id
        );


    if (!post) {

        loading.style.display = "none";

        error.textContent =
            "Something went wrong. Please try again.";

        return;
    }


    let author =
        await getData(
            "https://dummyjson.com/users/" +
            post.userId
        );


    let comments =
        await getData(
            "https://dummyjson.com/posts/" +
            id +
            "/comments"
        );


    loading.style.display = "none";


    postDiv.textContent = "";


    let title =
        document.createElement("h1");

    title.textContent = post.title;


    let body =
        document.createElement("p");

    body.textContent = post.body;


    let tags =
        document.createElement("div");


    post.tags.forEach(function(x) {

        let tag =
            document.createElement("span");

        tag.className = "tag";

        tag.textContent = x;

        tags.appendChild(tag);
    });


    let info =
        document.createElement("p");

    info.textContent =
        "Likes: " +
        post.reactions.likes +
        " | Views: " +
        post.views;


    // reading time bonus

    let words =
        post.body.split(" ").length;

    let time =
        Math.ceil(words / 200);


    let reading =
        document.createElement("p");

    reading.textContent =
        "Reading time: " + time + " min";


    // author

    let authorDiv =
        document.createElement("div");

    authorDiv.className = "author";


    let image =
        document.createElement("img");

    image.src = author.image;


    let authorName =
        document.createElement("p");

    authorName.textContent =
        "Author: " +
        author.firstName +
        " " +
        author.lastName;


    authorDiv.appendChild(image);

    authorDiv.appendChild(authorName);


    // comments

    let commentTitle =
        document.createElement("h2");

    commentTitle.textContent =
        "Comments";


    let commentsDiv =
        document.createElement("div");


    comments.comments.forEach(function(x) {

        let one =
            document.createElement("div");

        one.className = "comment";


        let username =
            document.createElement("strong");

        username.textContent =
            x.user.username;


        let text =
            document.createElement("p");

        text.textContent =
            x.body;


        one.appendChild(username);

        one.appendChild(text);

        commentsDiv.appendChild(one);
    });


    postDiv.appendChild(title);

    postDiv.appendChild(body);

    postDiv.appendChild(tags);

    postDiv.appendChild(info);

    postDiv.appendChild(reading);

    postDiv.appendChild(authorDiv);

    postDiv.appendChild(commentTitle);

    postDiv.appendChild(commentsDiv);
}


document.getElementById("back").onclick =
    function() {

        history.back();
    };


loadPost();