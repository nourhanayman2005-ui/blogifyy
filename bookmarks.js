let div =
    document.getElementById("bookmarks");


function getBookmarks() {

    let data =
        localStorage.getItem("bookmarks");

    if (data) {

        return JSON.parse(data);
    }

    return [];
}


function showBookmarks() {

    div.textContent = "";

    let bookmarks =
        getBookmarks();


    if (bookmarks.length == 0) {

        let message =
            document.createElement("p");

        message.textContent =
            "No saved posts yet.";

        div.appendChild(message);

        return;
    }


    bookmarks.forEach(function(post) {

        let card =
            document.createElement("div");

        card.className = "card";


        let title =
            document.createElement("h2");

        title.textContent =
            post.title;


        let body =
            document.createElement("p");

        body.textContent =
            post.body.substring(0, 100) +
            "...";


        let read =
            document.createElement("button");

        read.textContent =
            "Read Post";


        read.onclick = function() {

            location.href =
                "post.html?id=" + post.id;
        };


        let remove =
            document.createElement("button");

        remove.textContent =
            "Remove";


        remove.onclick = function() {

            let answer =
                confirm(
                    "Remove this bookmark?"
                );


            if (answer) {

                let bookmarks =
                    getBookmarks();


                bookmarks =
                    bookmarks.filter(
                        function(x) {

                            return x.id != post.id;
                        }
                    );


                localStorage.setItem(
                    "bookmarks",
                    JSON.stringify(bookmarks)
                );


                showBookmarks();
            }
        };


        card.appendChild(title);

        card.appendChild(body);

        card.appendChild(read);

        card.appendChild(remove);

        div.appendChild(card);
    });
}


// clear all

document.getElementById("clear").onclick =
    function() {

        let bookmarks =
            getBookmarks();


        if (bookmarks.length == 0) {

            return;
        }


        let answer =
            confirm(
                "Clear all bookmarks?"
            );


        if (answer) {

            localStorage.removeItem(
                "bookmarks"
            );

            showBookmarks();
        }
    };


showBookmarks();