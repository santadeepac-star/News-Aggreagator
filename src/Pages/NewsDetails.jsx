import React,{useState, useEffect} from "react";
import {useLocation,Link} from "react-router-dom";
import "./NewsDetails.css";

function NewsDetails(){

const location=useLocation();

const article=location.state;

const [comment,setComment]=useState("");

const [comments,setComments]=useState([]);

const handleComment = async () => {
const [commentMessage,setCommentMessage]=
useState("");


const [showSummary,setShowSummary]=
useState(false);

const [summary,setSummary]=
useState([]);



    const response =
      await fetch(
        "http://localhost:8000/comment",
        {
          method: "POST",
        })
      }
/* COMMENT */


const handleComment2=()=>{

if(comment.trim()==="") return;

setComments([

...comments,

comment

]);

setComment("");

setCommentMessage(

"✅ Thank you for commenting!"

);

setTimeout(()=>{

setCommentMessage("");

},3000);

};
const [isDarkMode,setIsDarkMode]=
useState(false);


useEffect(()=>{

setIsDarkMode(

localStorage.getItem(
"theme"
)==="dark"

);

},[]);


/* GENERATE SUMMARY */

const generateSummary=()=>{

if(showSummary){

setShowSummary(false);

return;

}

const text=

article.description ||
article.content ||
article.title ||
"No summary available";


const words=text.split(" ");


const points=[

words.slice(0,12).join(" "),

words.slice(12,24).join(" "),

words.slice(24,36).join(" ")

].filter(
item=>item!==""
);


setSummary(points);

setShowSummary(true);

};



if(!article){

return(

<div className={`details-page ${isDarkMode ? "dark-mode" : "light-mode"}`}>

<h2>

No News Found

</h2>

<Link
to="/dashboard"
>

Go Back

</Link>

</div>

);

}


return(

<div className={`details-page ${
isDarkMode
?
"dark-mode"
:
"light-mode"
}`}>


<Link
to="/dashboard"
className="back-btn"
>

← Back

</Link>


{/* TITLE + SUMMARY */}

<div className="title-row">

<h1>

{article.title}

</h1>

<button
className="summary-btn"
onClick={generateSummary}
>

{

showSummary

?

"❌ Hide Summary"

:

"✨ Generate Summary"

}

</button>

</div>


{/* IMAGE */}

<img

src={

article.image ||

"https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000"

}

alt="news"

className="details-image"

onError={(e)=>{

e.target.src=

"https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000";

}}

/>


{/* SUMMARY */}

{

showSummary && (

<div className="summary-box">

<h3>

📰 Article Summary

</h3>

<ul>

{

summary.map(

(item,index)=>(

<li
key={index}
>

{item}

</li>

)

)

}

</ul>

</div>

)

}


<p className="source">

Source:
{" "}
{article.source?.name}

</p>


<p className="description">

{

article.description ||
article.content

}

</p>


<a

href={article.url}

target="_blank"

rel="noreferrer"

className="read-more"

>

Read Complete Article

</a>


{/* COMMENTS */}

<div className="comments-section">

<h2>

Comments

</h2>

<textarea

placeholder="Write a comment..."

value={comment}

onChange={(e)=>

setComment(
e.target.value
)

}

/>


<button
onClick={handleComment}
>

Add Comment

</button>


{

commentMessage && (

<p className="comment-success">

{commentMessage}

</p>

)

}


{

comments.map(

(item,index)=>(

<div
key={index}
className="comment"
>

{item}

</div>

)

)

}

</div>

</div>

);

}

export default NewsDetails;